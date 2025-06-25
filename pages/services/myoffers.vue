<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'

definePageMeta({
  middleware: ["auth"],
  layout: "navbar",
});

const services = ref([])
const loading = ref(true)
const toast = useToast()

const { user } = useUserSession()

onMounted(async () => {
  try {
    const response = await $fetch('/api/services/list')
    if (response.success) {
      let allServices = response.services.map(service => {
        if (!Array.isArray(service.tag)) service.tag = []
        return service
      })
      if (user.value && user.value.id) {
        services.value = allServices.filter(service => service.user_id === user.value.id)
      } else {
        services.value = []
      }
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: 'Impossible de récupérer la liste de vos services',
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
})

const navigateToDetails = (id) => {
  navigateTo(`/services/${id}`)
}
</script>

<template>
  <div class="container mx-auto p-4">
    <Toast />
    <h1 class="text-2xl font-bold mb-6">Mes offres</h1>
    <div v-if="loading" class="flex justify-center">
      <ProgressSpinner />
    </div>
    <div v-else>
      <div v-if="services.length === 0" class="text-center py-8">
        <p class="text-gray-500">Vous n'avez pas encore de services</p>
        <Button label="Créer un service" class="mt-4" @click="navigateTo('/services/new')" />
      </div>
      <div v-else>
        <div class="flex justify-end mb-4">
          <Button label="Nouveau service" icon="pi pi-plus" @click="navigateTo('/services/new')" />
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="service in services" :key="service.id" class="p-2">
            <Card class="h-full shadow-md rounded-xl overflow-hidden">
              <template #header>
                <div class="h-40 bg-gray-200 flex items-center justify-center">
                  <i class="pi pi-box text-4xl" v-if="!service.image"></i>
                  <img v-else :src="service.image" :alt="service.title" class="h-full w-full object-cover" />
                </div>
              </template>
              <template #title>
                {{ service.title || 'Sans titre' }}
              </template>
              <template #subtitle>
                <div class="flex items-center gap-2 mb-2" v-if="service.tag && service.tag.length > 0">
                  <i class="pi pi-tag"></i>
                  <span>{{ Array.isArray(service.tag) ? service.tag.join(', ') : service.tag }}</span>
                </div>
                <div class="flex items-center gap-2 mb-2" v-else>
                  <i class="pi pi-tag"></i>
                  <span>Non catégorisé</span>
                </div>
                <div class="mt-1 flex items-center">
                  <Badge :value="service.status || 'pending'"
                    :severity="service.status === 'active' ? 'success' :
                              service.status === 'pending' ? 'warning' :
                              service.status === 'completed' ? 'info' : 'danger'" />
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
  </div>
</template>