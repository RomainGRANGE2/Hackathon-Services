<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';

definePageMeta({
  middleware: ['auth'],
  layout: 'navbar',
});

const route = useRoute();
const router = useRouter();
const toast = useToast();

const serviceId = route.params.id;
const service = ref(null);
const loading = ref(true);
const isOwner = ref(false);
const confirmDelete = ref(false);
const updating = ref(false);

// Récupérer les données directement au lieu d'utiliser onMounted
const response = await $fetch(`/api/services/list/${serviceId}`);
if (response.success) {
  service.value = response.service;
  isOwner.value = response.isOwner;
  // Gestion des tags
  if (service.value.tag && typeof service.value.tag === 'string') {
    try {
      service.value.tag = JSON.parse(service.value.tag);
    } catch (e) {
      service.value.tag = [];
    }
  } else if (!service.value.tag) {
    service.value.tag = [];
  }
} else {
  toast.add({
    severity: 'error',
    summary: 'Erreur',
    detail: 'Impossible de récupérer les détails du service',
    life: 3000,
  });
  setTimeout(() => router.push('/services/list'), 2000);
}
loading.value = false;

const updateServiceStatus = async (newStatus) => {
  try {
    updating.value = true;
    const response = await $fetch(`/api/services/update`, {
      method: 'PUT',
      body: {
        id: serviceId,
        status: newStatus,
      },
    });
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: `Le statut du service a été mis à jour en "${newStatus}"`,
        life: 3000,
      });
      service.value.status = newStatus;
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail:
          response.error ||
          "Une erreur s'est produite lors de la mise à jour du statut",
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "Une erreur s'est produite lors de la mise à jour du statut",
      life: 3000,
    });
  } finally {
    updating.value = false;
  }
};

const deleteService = async () => {
  try {
    updating.value = true;
    const response = await $fetch(`/api/services/delete`, {
      method: 'DELETE',
      body: {
        id: serviceId,
      },
    });
    if (response.success) {
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: 'Le service a été supprimé avec succès',
        life: 3000,
      });
      setTimeout(
        () =>
          router.push(isOwner.value ? '/services/myoffers' : '/services/list'),
        1500
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
    updating.value = false;
    confirmDelete.value = false;
  }
};

const navigateToEdit = () => {
  router.push(`/services/edit/${serviceId}`);
};
const navigateBack = () => {
  router.push('/services/list');
};
</script>
<template>
  <div class="container mx-auto p-4">
    <Toast />
    <div class="flex items-center mb-6">
      <h1 class="text-2xl font-bold">Détails du service</h1>
    </div>
    <div v-if="loading" class="flex justify-center">
      <ProgressSpinner />
    </div>
    <div v-else-if="!service" class="text-center py-8">
      <p class="text-gray-500">Ce service n'existe pas ou a été supprimé.</p>
    </div>
    <div v-else class="bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <div
        class="h-64 bg-gray-200 flex items-center justify-center rounded-t-lg overflow-hidden"
      >
        <i class="pi pi-box text-6xl text-gray-400" v-if="!service.image"></i>
        <img
          v-else
          :src="service.image"
          :alt="service.title"
          class="h-full w-full object-cover"
        />
      </div>
      <div class="p-6">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-2xl font-bold">{{ service.title }}</h2>
          <Badge
            :value="service.status"
            :severity="
              service.status === 'active'
                ? 'success'
                : service.status === 'pending'
                ? 'warning'
                : service.status === 'completed'
                ? 'info'
                : 'danger'
            "
          />
        </div>
        <div
          class="flex flex-wrap gap-2 mb-4"
          v-if="service.tag && service.tag.length > 0"
        >
          <Chip v-for="(tag, index) in service.tag" :key="index" :label="tag" />
        </div>
        <div class="text-xl font-bold mb-4">{{ service.price }} €</div>
        <div class="border-t border-b py-4 my-4">
          <h3 class="text-lg font-semibold mb-2">Description</h3>
          <p class="whitespace-pre-line">{{ service.description }}</p>
        </div>
        <div v-if="isOwner" class="flex flex-wrap gap-3 mt-4">
          <Button
            label="Modifier"
            icon="pi pi-pencil"
            @click="navigateToEdit"
          />
          <Button
            :label="service.status === 'active' ? 'Désactiver' : 'Activer'"
            :icon="service.status === 'active' ? 'pi pi-times' : 'pi pi-check'"
            :class="
              service.status === 'active'
                ? 'p-button-warning'
                : 'p-button-success'
            "
            @click="
              updateServiceStatus(
                service.status === 'active' ? 'pending' : 'active'
              )
            "
            :loading="updating"
          />
          <Button
            label="Marquer comme terminé"
            icon="pi pi-check-circle"
            class="p-button-info"
            @click="updateServiceStatus('completed')"
            :loading="updating"
            v-if="service.status !== 'completed'"
          />
          <Button
            label="Supprimer"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="confirmDelete = true"
          />
        </div>
        <div v-else class="flex justify-center mt-4">
          <Button
            label="Contacter le vendeur"
            icon="pi pi-envelope"
            class="p-button-success"
          />
        </div>
      </div>
    </div>
    <Dialog
      v-model:visible="confirmDelete"
      modal
      header="Confirmation de suppression"
      :style="{ width: '450px' }"
    >
      <div class="flex flex-column align-items-center">
        <i class="pi pi-exclamation-triangle text-5xl text-yellow-500 mb-3"></i>
        <p>
          Êtes-vous sûr de vouloir supprimer ce service ? Cette action est
          irréversible.
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
          :loading="updating"
        />
      </template>
    </Dialog>
  </div>
</template>
