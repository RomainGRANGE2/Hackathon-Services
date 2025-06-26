<template>
  <Dialog
    :visible="visible"
    modal
    :header="analysis?.projectTitle || 'Analyse de votre projet'"
    :style="{ width: '90vw', maxWidth: '900px' }"
    class="project-analysis-modal"
    @update:visible="$emit('close')"
  >
    <div v-if="analysis" class="space-y-6">
      <!-- Résumé du projet -->
      <div class="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <h3 class="font-semibold text-blue-900 mb-2">📋 Résumé du projet</h3>
        <p class="text-blue-800">{{ analysis.projectSummary }}</p>
      </div>

      <!-- Tâches et services recommandés -->
      <div class="space-y-4">
        <h3 class="text-xl font-bold text-gray-800 mb-4">🎯 Tâches identifiées et services recommandés</h3>
        
        <div 
          v-for="(task, index) in analysis.tasks" 
          :key="index"
          class="border rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <!-- Titre de la tâche -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h4 class="text-lg font-semibold text-gray-900 mb-2">
                {{ task.title }}
              </h4>
              <p class="text-gray-600 text-sm">{{ task.description }}</p>
            </div>
            <div class="ml-4">
              <Badge 
                :value="task.recommendedService ? 'Service trouvé' : 'Aucun service'" 
                :severity="task.recommendedService ? 'success' : 'warning'"
              />
            </div>
          </div>

          <!-- Service recommandé -->
          <div v-if="task.recommendedService" class="bg-green-50 border border-green-200 rounded-lg p-4 mt-3">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h5 class="font-semibold text-green-900 mb-2">
                  ✅ {{ task.recommendedService.title }}
                </h5>
                <p class="text-green-800 text-sm mb-2">
                  {{ task.recommendedService.description }}
                </p>
                <p class="text-green-700 text-xs italic mb-3">
                  💡 {{ task.recommendedService.matchReason }}
                </p>
                <div class="flex items-center justify-between">
                  <span class="text-green-900 font-bold text-lg">
                    {{ task.recommendedService.price }}€
                  </span>
                  <Button 
                    label="Voir le service" 
                    size="small" 
                    class="bg-green-600 hover:bg-green-700"
                    @click="viewService(task.recommendedService.id)"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Aucun service trouvé -->
          <div v-else class="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-3">
            <div class="flex items-center space-x-2">
              <span class="text-orange-600">⚠️</span>
              <span class="text-orange-800 font-medium">Aucun service disponible pour cette tâche</span>
            </div>
            <p class="text-orange-700 text-sm mt-2">
              Nous n'avons pas encore de freelance spécialisé pour cette partie de votre projet.
            </p>
            <Button 
              label="Proposer un service" 
              text 
              size="small" 
              class="text-orange-600 mt-2"
              @click="requestService(task)"
            />
          </div>
        </div>
      </div>

      <!-- Résumé financier -->
      <div class="bg-gray-50 p-4 rounded-lg">
        <h4 class="font-semibold text-gray-900 mb-3">💰 Estimation budgétaire</h4>
        <div class="space-y-2">
          <div v-for="(task, index) in analysis.tasks.filter(t => t.recommendedService)" :key="index" class="flex justify-between text-sm">
            <span class="text-gray-700">{{ task.title }}</span>
            <span class="font-medium">{{ task.recommendedService.price }}€</span>
          </div>
          <div class="border-t pt-2 mt-3">
            <div class="flex justify-between font-bold text-lg">
              <span>Total estimé :</span>
              <span class="text-green-600">{{ totalEstimate }}€</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <Button 
          label="Fermer" 
          text 
          @click="$emit('close')"
        />
        <div class="space-x-2">
          <Button 
            label="Modifier la recherche" 
            outlined 
            @click="$emit('modify-search')"
          />
          <Button 
            label="Contacter les freelances" 
            @click="contactFreelancers"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  analysis: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'modify-search'])

// Calcul du total estimé
const totalEstimate = computed(() => {
  if (!props.analysis?.tasks) return 0
  return props.analysis.tasks
    .filter(task => task.recommendedService)
    .reduce((total, task) => total + (task.recommendedService.price || 0), 0)
})

// Voir un service spécifique
const viewService = (serviceId) => {
  navigateTo(`/services/${serviceId}`)
}

// Demander un service pour une tâche sans service disponible
const requestService = (task) => {
  // Ici on pourrait ouvrir un formulaire pour demander un nouveau service
  console.log('Demande de service pour:', task.title)
  // Ou rediriger vers une page de contact
}

// Contacter les freelances
const contactFreelancers = () => {
  console.log('Contacter les freelances pour ce projet')
  // Ici on pourrait ouvrir un formulaire de contact global
}
</script>

<style scoped>
.project-analysis-modal {
  font-family: 'Inter', sans-serif;
}

.project-analysis-modal .p-dialog-content {
  padding: 1.5rem;
}
</style>
