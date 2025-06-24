<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  middleware: ["auth"],
  layout: "navbar",
});

// État pour stocker les services et l'état de chargement
const services = ref([])
const loading = ref(true)
const toast = useToast()

// Récupérer les services lors du montage du composant
try {
  const response = await $fetch('/api/services/list')
  if (response.success) {
    services.value = response.services
  } else {
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: 'Impossible de récupérer la liste des services',
      life: 3000
    })
  }
} catch (error) {
  toast.add({
    severity: 'error',
    summary: 'Erreur',
    detail: 'Une erreur s\'est produite lors de la récupération des services',
    life: 3000
  })
  console.error(error)
} finally {
  loading.value = false
}

// Fonction pour naviguer vers les détails du service
const navigateToDetails = (id) => {
  // Remplacez par la logique de navigation appropriée
  console.log('Naviguer vers les détails du service avec l\'ID:', id)
}
</script>
<template>
  <div class="container mx-auto p-4">
    <Toast />
    <h1 class="text-2xl font-bold mb-6">Liste des services</h1>

    <div v-if="loading" class="flex justify-center">
      <ProgressSpinner />
    </div>

    <div v-else>
      <div v-if="services.length === 0" class="text-center py-8">
        <p class="text-gray-500">Aucun service disponible pour le moment</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <div v-for="service in services" :key="service.id" class="p-2">
          <Card class="h-full shadow-md rounded-xl overflow-hidden">
            <template #header>
              <div class="h-40 bg-gray-200 flex items-center justify-center">
                <i class="pi pi-briefcase text-4xl" v-if="!service.image"></i>
                <img v-else :src="service.image" :alt="service.title" class="h-full w-full object-cover" />
              </div>
            </template>
            <template #title>
              {{ service.title || 'Sans titre' }}
            </template>
            <template #subtitle>
              <div class="flex items-center gap-2 mb-2" v-if="service.tag && service.tag.length > 0">
                <i class="pi pi-tag"></i>
                <span>{{ service.tag.join(', ') }}</span>
              </div>
              <div class="flex items-center gap-2 mb-2" v-else>
                <i class="pi pi-tag"></i>
                <span>Non catégorisé</span>
              </div>
            </template>
            <template #content>
              <p class="text-sm line-clamp-3">{{ service.description || 'Pas de description' }}</p>
              <div class="flex justify-between items-center mt-4">
                <span class="font-bold text-lg">{{ service.price || '0' }} €</span>
              </div>
            </template>
            <template #footer>
              <div class="flex justify-center">
                <Button label="Voir détails" icon="pi pi-search" class="w-full" @click="navigateToDetails(service.id)" />
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>
