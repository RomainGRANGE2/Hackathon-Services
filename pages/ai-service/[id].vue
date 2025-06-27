<template>
  <div class="container mx-auto p-4 max-w-4xl">
    <Toast />
    
    <div v-if="loading" class="flex justify-center py-8">
      <ProgressSpinner />
    </div>
    
    <div v-else-if="!service" class="text-center py-8">
      <p class="text-gray-500">Service non trouvé</p>
    </div>
    
    <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold">🤖 {{ service.title }}</h1>
            <p class="text-purple-100 mt-2">{{ service.description }}</p>
            <div class="flex items-center mt-3">
              <span class="bg-white/20 px-3 py-1 rounded-full text-sm">
                Prix: {{ service.price }}€
              </span>
            </div>
          </div>
          <Button
            icon="pi pi-arrow-left"
            class="p-button-text p-button-rounded text-white"
            @click="navigateTo('/services')"
          />
        </div>
      </div>
      
      <div class="flex flex-col h-96">
        <div ref="chatContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          <div
            v-for="(message, index) in messages"
            :key="index"
            class="flex"
            :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-xs lg:max-w-md px-4 py-2 rounded-lg"
              :class="message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800 shadow-md'"
            >
              <div class="whitespace-pre-wrap">{{ message.content }}</div>
              <div class="text-xs opacity-70 mt-1">
                {{ new Date(message.timestamp).toLocaleTimeString() }}
              </div>
            </div>
          </div>
          
          <div v-if="isProcessing" class="flex justify-start">
            <div class="bg-white text-gray-800 shadow-md px-4 py-2 rounded-lg">
              <div class="flex items-center space-x-2">
                <ProgressSpinner style="width: 20px; height: 20px" />
                <span>L'IA traite votre demande...</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="border-t bg-white p-4">
          <div class="flex items-end space-x-2">
            <Textarea
              v-model="newMessage"
              placeholder="Tapez votre message..."
              class="flex-1"
              rows="2"
              @keypress="handleKeyPress"
              :disabled="isProcessing"
            />
            <Button
              icon="pi pi-send"
              @click="sendMessage"
              :disabled="isProcessing || !newMessage.trim()"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  middleware: ['auth'],
  layout: 'navbar'
})

const route = useRoute()
const toast = useToast()
const { user } = useUserSession()

const serviceId = route.params.id
const service = ref(null)
const loading = ref(true)
const conversation = ref(null)
const messages = ref([])
const newMessage = ref('')
const isProcessing = ref(false)
const chatContainer = ref(null)

onMounted(async () => {
  await loadService()
  if (service.value) {
    await loadOrCreateConversation()
  }
})

const loadService = async () => {
  try {
    const response = await $fetch(`/api/services/list/${serviceId}`)
    if (response.success) {
      service.value = response.service
      
      if (service.value.service_type !== 'ai') {
        toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Ce service n\'est pas un service IA',
          life: 3000
        })
        await navigateTo('/services')
        return
      }
      
      if (typeof service.value.ai_config === 'string') {
        try {
          service.value.ai_config = JSON.parse(service.value.ai_config)
        } catch (e) {
          console.error('Erreur parsing ai_config:', e)
        }
      }
    }
  } catch (error) {
    console.error('Erreur:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger le service',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const loadOrCreateConversation = async () => {
  try {
    const response = await $fetch('/api/ai-services/conversation', {
      method: 'POST',
      body: {
        serviceId: parseInt(serviceId),
        userId: user.value.id
      }
    })
    
    if (response.success) {
      conversation.value = response.conversation
      messages.value = response.conversation.messages || []
      
      if (messages.value.length === 0) {
        const welcomeMessage = {
          role: 'assistant',
          content: getWelcomeMessage(),
          timestamp: new Date().toISOString()
        }
        messages.value.push(welcomeMessage)
        await saveConversation()
      }
      
      await nextTick()
      scrollToBottom()
    }
  } catch (error) {
    console.error('Erreur conversation:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de charger la conversation',
      life: 3000
    })
  }
}

const getWelcomeMessage = () => {
  const config = service.value?.ai_config
  if (!config) return 'Bonjour ! Comment puis-je vous aider ?'
  
  switch (config.type) {
    case 'translation':
      return 'Bonjour ! Je suis votre assistant de traduction IA. Envoyez-moi le texte à traduire et précisez la langue de destination.'
    case 'summarization':
      return 'Bonjour ! Je suis votre assistant de résumé IA. Envoyez-moi le texte à résumer.'
    case 'correction':
      return 'Bonjour ! Je suis votre assistant de correction IA. Envoyez-moi le texte à corriger.'
    default:
      return 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?'
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return
  
  const userMessage = {
    role: 'user',
    content: newMessage.value,
    timestamp: new Date().toISOString()
  }
  
  messages.value.push(userMessage)
  newMessage.value = ''
  isProcessing.value = true
  
  await nextTick()
  scrollToBottom()
  
  try {
    const response = await $fetch('/api/ai-services/process', {
      method: 'POST',
      body: {
        conversationId: conversation.value.id,
        message: userMessage,
        serviceConfig: service.value.ai_config
      }
    })
    
    if (response.success) {
      const aiMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString()
      }
      
      messages.value.push(aiMessage)
      await saveConversation()
    } else {
      throw new Error(response.error || 'Erreur de traitement')
    }
  } catch (error) {
    console.error('Erreur traitement:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Erreur lors du traitement de votre demande',
      life: 3000
    })
    
    const errorMessage = {
      role: 'assistant',
      content: 'Désolé, une erreur est survenue. Veuillez réessayer.',
      timestamp: new Date().toISOString()
    }
    messages.value.push(errorMessage)
  } finally {
    isProcessing.value = false
    await nextTick()
    scrollToBottom()
  }
}

const saveConversation = async () => {
  try {
    await $fetch('/api/ai-services/conversation/save', {
      method: 'PUT',
      body: {
        conversationId: conversation.value.id,
        messages: messages.value
      }
    })
  } catch (error) {
    console.error('Erreur sauvegarde:', error)
  }
}

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

const handleKeyPress = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}
</script>
