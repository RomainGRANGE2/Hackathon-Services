<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'primevue/usetoast'
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  TagIcon,
  CubeIcon
} from '@heroicons/vue/24/outline'

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
          <Button label="Nouveau service" class="flex items-center gap-2" @click="navigateTo('/services/new')">
            <PlusIcon class="h-5 w-5" />
            <span>Nouveau service</span>
          </Button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div v-for="service in services" :key="service.id" class="p-2">
            <Card class="h-full shadow-md rounded-xl overflow-hidden">
              <template #header>
                <div class="h-40 bg-gray-200 flex items-center justify-center">
                  <CubeIcon class="h-10 w-10 text-gray-400" v-if="!service.image" />
                  <img v-else :src="service.image" :alt="service.title" class="h-full w-full object-cover" />
                </div>
              </template>
              <template #title>
                {{ service.title || 'Sans titre' }}
              </template>
              <template #subtitle>
                <div class="flex items-center gap-2 mb-2" v-if="service.tag && service.tag.length > 0">
                  <TagIcon class="h-5 w-5" />
                  <span>{{ Array.isArray(service.tag) ? service.tag.join(', ') : service.tag }}</span>
                </div>
                <div class="flex items-center gap-2 mb-2" v-else>
                  <TagIcon class="h-5 w-5" />
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
                <div class="flex flex-col gap-2 w-full">
                  <div class="flex gap-2 ">
                    <Button class="p-button-warning flex items-center justify-center" @click="navigateTo(`/services/edit/${service.id}`)">
                      <PencilIcon class="h-5 w-5" />
                    </Button>
                    <Button class="p-button-danger flex items-center justify-center" @click="navigateTo(`/services/list/${service.id}`)">
                      <TrashIcon class="h-5 w-5" />
                    </Button>
                  </div>
                  <Button class="w-full flex items-center justify-center gap-2" @click="navigateToDetails(service.id)">
                    <MagnifyingGlassIcon class="h-5 w-5" />
                    <span>Voir détails</span>
                  </Button>
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>