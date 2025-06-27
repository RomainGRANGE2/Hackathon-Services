<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'

definePageMeta({
  middleware: ["auth"],
  layout: "navbar",
});

const router = useRouter()
const toast = useToast()

const service = ref({
  title: '',
  description: '',
  price: null,
  tag: [],
  status: 'pending',
  service_type: 'human', // Toujours humain pour les utilisateurs
  ai_config: null
})

const loading = ref(false)

const availableTags = ref([
  { tags: 'Cuisine' },
  { tags: 'Jardinage' },
  { tags: 'Bricolage' },
  { tags: 'Ménage' },
  { tags: 'Informatique' },
  { tags: 'Cours' },
  { tags: 'Transport' },
  { tags: 'Autres' }
])

const submitService = async () => {
  if (!service.value.title || !service.value.description || service.value.price === null) {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Veuillez remplir tous les champs obligatoires',
      life: 3000
    })
    return
  }

  try {
    loading.value = true
    const response = await $fetch('/api/services/create', {
      method: 'POST',
      body: service.value
    })

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Votre service a été créé avec succès',
        life: 3000
      })
      navigateTo('/services/myoffers')
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: response.error || 'Une erreur s\'est produite lors de la création du service',
        life: 3000
      })
    }
  } catch (error) {
    console.error('Erreur lors de la création du service:', error)
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Une erreur s\'est produite lors de la création du service',
      life: 3000
    })
  } finally {
    loading.value = false
  }
}

const cancelCreation = () => {
  navigateTo('/services/list')
}
</script>

<template>
  <div class="container mx-auto p-4">
    <Toast />

    <div class="flex items-center mb-6">
      <Button
        icon="pi pi-arrow-left"
        class="p-button-text mr-3"
        @click="cancelCreation"
        aria-label="Retour"
      />
      <h1 class="text-2xl font-bold">Créer un nouveau service</h1>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
      <form @submit.prevent="submitService">
        <div class="mb-4">
          <label for="title" class="block text-gray-700 font-medium mb-1">Titre du service*</label>
          <InputText
            id="title"
            v-model="service.title"
            class="w-full"
            placeholder="Ex: Cours de cuisine italienne"
            required
          />
        </div>

        <div class="mb-4">
          <label for="description" class="block text-gray-700 font-medium mb-1">Description*</label>
          <Textarea
            id="description"
            v-model="service.description"
            class="w-full"
            rows="5"
            placeholder="Décrivez en détail votre service..."
            required
          />
        </div>

        <div class="mb-4">
          <label for="price" class="block text-gray-700 font-medium mb-1">Prix (€)*</label>
          <InputNumber
            id="price"
            v-model="service.price"
            class="w-full"
            :minFractionDigits="2"
            :maxFractionDigits="2"
            placeholder="Ex: 25.00"
            required
          />
        </div>

        <div class="mb-4">
          <label for="tags" class="block text-gray-700 font-medium mb-1">Catégories</label>
          <MultiSelect
            id="tags"
            v-model="service.tag"
            :options="availableTags"
            optionLabel="tags"
            optionValue="tags"
            placeholder="Sélectionnez une ou plusieurs catégories"
            class="w-full"
            display="chip"
          />
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <Button
            label="Annuler"
            class="p-button-text"
            @click="cancelCreation"
            type="button"
          />
          <Button
            label="Créer le service"
            type="submit"
            :loading="loading"
          />
        </div>
      </form>
    </div>
  </div>
</template>
