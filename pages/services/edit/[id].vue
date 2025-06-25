<script setup>
import { ref, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRoute, useRouter } from 'vue-router';
import {
  ArrowLeftIcon,
  TagIcon,
  CubeIcon,
  CurrencyEuroIcon,
} from '@heroicons/vue/24/outline';

definePageMeta({
  middleware: ['auth'],
  layout: 'navbar',
});

const route = useRoute();
const router = useRouter();
const toast = useToast();
const serviceId = route.params.id;
const loading = ref(true);
const submitting = ref(false);
const isOwner = ref(false);

const serviceForm = reactive({
  title: '',
  description: '',
  price: 0,
  tag: [],
  image: null,
});

// Récupérer les données au lieu d'utiliser onMounted
const response = await $fetch(`/api/services/list/${serviceId}`);
if (response.success) {
  isOwner.value = response.isOwner;

  if (!isOwner.value) {
    toast.add({
      severity: 'error',
      summary: 'Non autorisé',
      detail: "Vous n'êtes pas autorisé à modifier ce service",
      life: 3000,
    });
  } else {
    const service = response.service;

    // Traiter les tags s'ils sont stockés sous forme de string JSON
    if (service.tag && typeof service.tag === 'string') {
      try {
        service.tag = JSON.parse(service.tag);
      } catch (e) {
        service.tag = [];
      }
    } else if (!service.tag) {
      service.tag = [];
    }

    // Remplir le formulaire avec les données du service
    serviceForm.title = service.title || '';
    serviceForm.description = service.description || '';
    serviceForm.price = service.price || 0;
    serviceForm.tag = service.tag || [];
    serviceForm.image = service.image || null;
  }
} else {
  toast.add({
    severity: 'error',
    summary: 'Erreur',
    detail: 'Impossible de récupérer les détails du service',
    life: 3000,
  });
}
loading.value = false;

const updateService = async () => {
  try {
    submitting.value = true;

    if (
      !serviceForm.title ||
      !serviceForm.description ||
      serviceForm.price < 0
    ) {
      toast.add({
        severity: 'warn',
        summary: 'Formulaire incomplet',
        detail: 'Veuillez remplir tous les champs obligatoires',
        life: 3000,
      });
      submitting.value = false;
      return;
    }

    const response = await $fetch('/api/services/update', {
      method: 'PUT',
      body: {
        id: serviceId,
        title: serviceForm.title,
        description: serviceForm.description,
        price: serviceForm.price,
        tag: serviceForm.tag,
        image: serviceForm.image,
      },
    });

    if (response.success) {
      navigateTo('/services/myoffers')
    } else {
      toast.add({
        severity: 'error',
        summary: 'Erreur',
        detail:
          response.error ||
          "Une erreur s'est produite lors de la mise à jour du service",
        life: 3000,
      });
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du service:', error);
    toast.add({
      severity: 'error',
      summary: 'Erreur',
      detail: "Une erreur s'est produite lors de la mise à jour du service",
      life: 3000,
    });
  } finally {
    submitting.value = false;
  }
};

const addTag = (event) => {
  if (event.key === 'Enter' && event.target.value) {
    const tag = event.target.value.trim();
    if (tag && !serviceForm.tag.includes(tag)) {
      serviceForm.tag.push(tag);
    }
    event.target.value = '';
    event.preventDefault();
  }
};

const removeTag = (index) => {
  serviceForm.tag.splice(index, 1);
};

const navigateBack = () => {
  router.push('/services/myoffers');
};
</script>

<template>
  <div class="container mx-auto p-4">
    <Toast />
    <div class="flex items-center mb-6">
      <button
        @click="navigateBack"
        class="p-2 mr-3 rounded-full hover:bg-gray-100"
      >
        <ArrowLeftIcon class="h-6 w-6" />
      </button>
      <h1 class="text-2xl font-bold">Modifier le service</h1>
    </div>

    <div v-if="loading" class="flex justify-center">
      <ProgressSpinner />
    </div>
    <div v-else-if="!isOwner" class="text-center py-8">
      <p class="text-gray-500">
        Vous n'êtes pas autorisé à modifier ce service.
      </p>
    </div>
    <div v-else class="max-w-2xl mx-auto">
      <form @submit.prevent="updateService" class="space-y-6">
        <div class="p-field">
          <label
            for="title"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Titre *</label
          >
          <InputText
            id="title"
            v-model="serviceForm.title"
            class="w-full"
            placeholder="Titre du service"
            required
          />
        </div>

        <div class="p-field">
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Description *</label
          >
          <Textarea
            id="description"
            v-model="serviceForm.description"
            class="w-full"
            rows="5"
            placeholder="Description du service"
            required
          />
        </div>

        <div class="p-field">
          <label
            for="price"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Prix (€) *</label
          >
          <div class="relative">
            <InputNumber
              id="price"
              v-model="serviceForm.price"
              class="w-full"
              min="0"
              placeholder="0"
            />
          </div>
        </div>

        <div class="p-field">
          <label class="block text-sm font-medium text-gray-700 mb-1"
            >Tags</label
          >
          <div class="flex flex-wrap gap-2 mb-2">
            <Chip
              v-for="(tag, index) in serviceForm.tag"
              :key="index"
              :label="tag"
              removable
              @remove="removeTag(index)"
            />
          </div>
          <InputText
            class="w-full"
            placeholder="Ajouter un tag (Entrée pour valider)"
            @keydown="addTag"
          />
        </div>

        <div class="flex justify-end pt-4">
          <Button type="button" class="p-button-text mr-2" @click="navigateBack"
            >Annuler</Button
          >
          <Button type="submit" :loading="submitting"
            >Enregistrer les modifications</Button
          >
        </div>
      </form>
    </div>
  </div>
</template>
