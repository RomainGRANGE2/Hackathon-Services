<template>
  <Dialog
    :visible="visible"
    modal
    :header="analysis?.projectTitle || 'Analyse de votre projet'"
    :style="{ width: '90vw', maxWidth: '900px' }"
    class="project-analysis-modal"
    @update:visible="$emit('close')"
  >
    <!-- État de chargement -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-12 space-y-4">
      <ProgressSpinner />
      <div class="text-center">
        <h3 class="text-lg font-semibold text-gray-800 mb-2">🤖 Analyse en cours...</h3>
        <p class="text-gray-600">Notre IA analyse votre projet et recherche les meilleurs services</p>
        <div class="mt-4 text-sm text-gray-500">
          <p>⚡ Décomposition du projet en tâches</p>
          <p>🔍 Recherche des services adaptés</p>
          <p>💰 Calcul du budget estimé</p>
        </div>
      </div>
    </div>

    <!-- Résultats de l'analyse -->
    <div v-else-if="analysis" class="space-y-6">
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
        <div class="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <p class="text-sm text-blue-700">
            💡 En cliquant sur "Contacter", vous enverrez automatiquement une demande personnalisée à chaque freelance avec le contexte complet de votre projet.
          </p>
        </div>
      </div>    </div>

    <!-- État d'erreur -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-12 space-y-4">
      <div class="text-center">
        <div class="text-red-500 text-6xl mb-4">⚠️</div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">Erreur lors de l'analyse</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <Button 
          label="Réessayer" 
          @click="$emit('retry')"
          class="mr-2"
        />
        <Button 
          label="Modifier la recherche" 
          outlined 
          @click="$emit('modify-search')"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between w-full" v-if="!loading">
        <Button 
          label="Fermer" 
          text 
          @click="$emit('close')"
        />
        <div class="space-x-2" v-if="analysis">
          <Button 
            label="Modifier la recherche" 
            outlined 
            @click="$emit('modify-search')"
          />
          <Button 
            :label="`Contacter ${availableServicesCount} freelance(s)`"
            :disabled="availableServicesCount === 0"
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
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close', 'modify-search', 'retry'])

// Calcul du total estimé
const totalEstimate = computed(() => {
  if (!props.analysis?.tasks) return 0
  return props.analysis.tasks
    .filter(task => task.recommendedService)
    .reduce((total, task) => total + (task.recommendedService.price || 0), 0)
})

// Nombre de services disponibles pour contact
const availableServicesCount = computed(() => {
  if (!props.analysis?.tasks) return 0
  return props.analysis.tasks.filter(task => task.recommendedService).length
})

// Voir un service spécifique
const viewService = (serviceId) => {
  // Fermer la modal et naviguer vers le service
  emit('close')
  navigateTo(`/services/${serviceId}`)
}

// Demander un service pour une tâche sans service disponible
const requestService = (task) => {
  // Ici on pourrait ouvrir un formulaire pour demander un nouveau service
  console.log('Demande de service pour:', task.title)
  // Ou rediriger vers une page de contact
}

// Contacter les freelances
const contactFreelancers = async () => {
  if (!props.analysis) return;

  try {
    // Préparer les données des services à réserver
    const servicesToBook = props.analysis.tasks
      .filter(task => task.recommendedService)
      .map(task => ({
        serviceId: task.recommendedService.id,
        taskTitle: task.title,
        matchReason: task.recommendedService.matchReason || 'Service recommandé par notre IA'
      }));

    if (servicesToBook.length === 0) {
      alert('Aucun service disponible à réserver pour ce projet.');
      return;
    }

    // Confirmation avant réservation
    const confirmMessage = `Vous allez contacter ${servicesToBook.length} freelance(s) pour votre projet "${props.analysis.projectTitle}". 

Services concernés :
${servicesToBook.map(s => `• ${s.taskTitle}`).join('\n')}

Confirmer les réservations ?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    // Appeler l'API de réservation multiple
    const response = await $fetch('/api/services/book-multiple', {
      method: 'POST',
      body: {
        projectSummary: props.analysis.projectSummary,
        services: servicesToBook
      }
    });

    if (response.success) {
      alert(`✅ ${response.message}\n\nLes freelances vont être notifiés par email avec tous les détails de votre projet.`);
      
      // Optionnel : fermer la modal et rediriger vers les réservations
      emit('close');
      navigateTo('/services/myoffers');
    } else {
      alert(`❌ Erreur: ${response.message}`);
      if (response.errors) {
        console.error('Erreurs détaillées:', response.errors);
      }
    }

  } catch (error) {
    console.error('Erreur lors du contact des freelances:', error);
    alert('❌ Une erreur est survenue lors de l\'envoi des demandes de contact.');
  }
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
