<script setup>
import { ref, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import {
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  TagIcon,
  CubeIcon,
} from '@heroicons/vue/24/outline';

definePageMeta({
  middleware: ['auth'],
  layout: 'navbar',
});

const services = ref([]);
const loading = ref(true);
const toast = useToast();
const confirmDelete = ref(false);
const serviceToDelete = ref(null);
const deleting = ref(false);

const { user } = useUserSession();

onMounted(async () => {
  try {
    // Vérifier que l'utilisateur est connecté
    if (!user.value || !user.value.id) {
      toast.add({
        severity: 'error',
        summary: 'Accès refusé',
        detail:
          'Vous devez être connecté en tant que prestataire pour accéder à cette page',
        life: 3000,
      });
      navigateTo('/auth');
      return;
    }

    const response = await $fetch('/api/services/my-offers');
    if (response.success) {
      // L'API retourne directement les services du prestataire connecté
      services.value = response.services.map((service) => {
        if (service.tag && typeof service.tag === 'string') {
          try {
            service.tag = JSON.parse(service.tag);
          } catch (e) {
            service.tag = [];
          }
        } else if (!service.tag) {
          service.tag = [];
        }
        return service;
      });
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail: response.error || 'Impossible de récupérer vos offres',
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "Une erreur s'est produite lors du chargement de vos offres",
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
});

const navigateToDetails = (id) => {
  navigateTo(`/services/${id}`);
};

const confirmDeleteService = (service) => {
  serviceToDelete.value = service;
  confirmDelete.value = true;
};

const deleteService = async () => {
  if (!serviceToDelete.value) return;

  try {
    deleting.value = true;
    const response = await $fetch('/api/services/delete', {
      method: 'DELETE',
      body: {
        id: serviceToDelete.value.id,
      },
    });

    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Le service a été supprimé avec succès',
        life: 3000,
      });
      // Retirer le service de la liste
      services.value = services.value.filter(
        (s) => s.id !== serviceToDelete.value.id
      );
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail:
          response.error ||
          "Une erreur s'est produite lors de la suppression du service",
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Erreur lors de la suppression du service:', error);
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "Une erreur s'est produite lors de la suppression du service",
      life: 3000,
    });
  } finally {
    deleting.value = false;
    confirmDelete.value = false;
    serviceToDelete.value = null;
  }
};
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
        <Button
          label="Créer un service"
          class="mt-4"
          @click="navigateTo('/services/new')"
        />
      </div>
      <div v-else>
        <div class="flex justify-end mb-4">
          <Button
            label="Nouveau service"
            class="flex items-center gap-2"
            @click="navigateTo('/services/new')"
          >
            <PlusIcon class="h-5 w-5" />
            <span>Nouveau service</span>
          </Button>
        </div>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <div v-for="service in services" :key="service.id" class="p-2">
            <Card class="h-full shadow-md rounded-xl overflow-hidden">
              <template #header>
                <div class="h-40 bg-gray-200 flex items-center justify-center">
                  <CubeIcon
                    class="h-10 w-10 text-gray-400"
                    v-if="!service.image"
                  />
                  <img
                    v-else
                    :src="service.image"
                    :alt="service.title"
                    class="h-full w-full object-cover"
                  />
                </div>
              </template>
              <template #title>
                {{ service.title || 'Sans titre' }}
              </template>
              <template #subtitle>
                <div
                  class="flex items-center gap-2 mb-2"
                  v-if="service.tag && service.tag.length > 0"
                >
                  <TagIcon class="h-5 w-5" />
                  <span>{{
                    Array.isArray(service.tag)
                      ? service.tag.join(', ')
                      : service.tag
                  }}</span>
                </div>
                <div class="flex items-center gap-2 mb-2" v-else>
                  <TagIcon class="h-5 w-5" />
                  <span>Non catégorisé</span>
                </div>
              </template>
              <template #content>
                <p class="text-sm line-clamp-3">
                  {{ service.description || 'Pas de description' }}
                </p>
                <div class="flex justify-between items-center mt-4">
                  <span class="font-bold text-lg"
                    >{{ service.price || '0' }} €</span
                  >
                </div>
              </template>
              <template #footer>
                <div class="flex flex-col gap-2 w-full">
                  <div class="flex gap-2">
                    <Button
                      class="p-button-warning flex items-center justify-center"
                      @click="navigateTo(`/services/edit/${service.id}`)"
                    >
                      <PencilIcon class="h-5 w-5" />
                    </Button>
                    <Button
                      class="p-button-danger flex items-center justify-center"
                      @click="confirmDeleteService(service)"
                    >
                      <TrashIcon class="h-5 w-5" />
                    </Button>
                  </div>
                  <Button
                    class="w-full flex items-center justify-center gap-2"
                    @click="navigateToDetails(service.id)"
                  >
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

    <!-- Dialog de confirmation de suppression -->
    <Dialog
      v-model:visible="confirmDelete"
      modal
      header="Confirmation de suppression"
      :style="{ width: '450px' }"
    >
      <div class="flex flex-column align-items-center">
        <i class="pi pi-exclamation-triangle text-5xl text-yellow-500 mb-3"></i>
        <p>
          Êtes-vous sûr de vouloir supprimer le service "{{
            serviceToDelete?.title
          }}" ? Cette action est irréversible.
        </p>
      </div>
      <template #footer>
        <Button
          label="Non"
          icon="pi pi-times"
          class="p-button-text"
          @click="confirmDelete = false"
        />
        <Button
          label="Oui"
          icon="pi pi-check"
          class="p-button-danger"
          @click="deleteService"
          :loading="deleting"
        />
      </template>
    </Dialog>
  </div>
</template>
