<script setup>
import { ref, onMounted, watch } from "vue";
import { useToast } from "primevue/usetoast";
import { TagIcon } from "@heroicons/vue/24/outline/index.js";
import ProjectAnalysisModal from "~/components/ProjectAnalysisModal.vue";

definePageMeta({
  layout: "navbar",
});

const services = ref([]);
const loading = ref(true);
const toast = useToast();
const searchQuery = ref("");
const showAnalysisModal = ref(false);
const projectAnalysis = ref(null);
const analysisLoading = ref(false);
const analysisError = ref(null);
const simpleSearchQuery = ref("");
const isSimpleSearching = ref(false);

onMounted(async () => {
  try {
    // Récupérer les paramètres de recherche depuis l'URL
    const route = useRoute();
    searchQuery.value = route.query.search || "";
    const searchType = route.query.type || "";

    if (searchQuery.value) {
      // Si c'est une recherche de catégorie, utiliser la recherche simpleeee
      if (searchType === "category") {
        simpleSearchQuery.value = searchQuery.value;
        await performSimpleSearch();
      } else {
        // Sinon, c'est une description de projet complexe
        showAnalysisModal.value = true;
        await analyzeProject();
        // Charger aussi les services normaux en arrière-plan
        await loadServices();
      }
    } else {
      // Sinon, charger la liste normale des services
      await loadServices();
    }
  } catch (error) {
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Une erreur s'est produite lors de la récupération des services",
      life: 3000,
    });
    console.error(error);
  } finally {
    loading.value = false;
  }
});

const loadServices = async () => {
  const response = await $fetch("/api/services/list");
  if (response.success) {
    services.value = response.services.map((service) => {
      if (service.tag && typeof service.tag === "string") {
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
      severity: "error",
      summary: "Erreur",
      detail: "Impossible de récupérer la liste des services",
      life: 3000,
    });
  }
};

const analyzeProject = async () => {
  analysisLoading.value = true;
  analysisError.value = null;

  try {
    const response = await $fetch("/api/services/search", {
      method: "POST",
      body: { query: searchQuery.value },
    });

    if (response.success) {
      projectAnalysis.value = response.projectAnalysis;
    } else {
      analysisError.value =
        "Impossible d'analyser votre projet. Veuillez réessayer.";
    }
  } catch (error) {
    console.error("Erreur analyse projet:", error);
    analysisError.value =
      "Une erreur est survenue lors de l'analyse. Vérifiez votre connexion et réessayez.";
  } finally {
    analysisLoading.value = false;
  }
};

// Fonction de recherche simple par mots-clés
const performSimpleSearch = async (searchTerm = "") => {
  isSimpleSearching.value = true;
  try {
    const response = await $fetch(
      `/api/services/simple-search?q=${encodeURIComponent(searchTerm)}`
    );
    if (response.success) {
      services.value = response.services.map((service) => {
        if (service.tag && typeof service.tag === "string") {
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
        severity: "error",
        summary: "Erreur",
        detail: "Impossible de rechercher les services",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Erreur recherche simple:", error);
    toast.add({
      severity: "error",
      summary: "Erreur",
      detail: "Erreur lors de la recherche",
      life: 3000,
    });
  } finally {
    isSimpleSearching.value = false;
  }
};

// Fonction appelée quand l'utilisateur tape dans la barre de recherche
const handleSimpleSearch = () => {
  performSimpleSearch(simpleSearchQuery.value);
};

// Fonction pour effacer la recherche
const clearSimpleSearch = () => {
  simpleSearchQuery.value = "";
  loadServices();
};

const closeAnalysisModal = () => {
  showAnalysisModal.value = false;
  projectAnalysis.value = null;
  analysisError.value = null;
  // Retourner à la liste normale des services
  navigateTo("/services");
};

const modifySearch = () => {
  showAnalysisModal.value = false;
  projectAnalysis.value = null;
  analysisError.value = null;
  // Retourner à la page d'accueil pour une nouvelle recherche
  navigateTo("/");
};

const retryAnalysis = () => {
  analysisError.value = null;
  analyzeProject();
};

const navigateToDetails = (id) => {
  navigateTo(`/services/${id}`);
};

const navigateToAiService = (id) => {
  navigateTo(`/ai-service/${id}`);
};

// Watcher pour recherche en temps réel avec debounce
let searchTimeout;
watch(simpleSearchQuery, (newValue) => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSimpleSearch(newValue);
  }, 300); // Attendre 300ms après que l'utilisateur arrête de taper
});
</script>

<template>
  <div class="container mx-auto p-4">
    <Toast />

    <!-- Modal d'analyse de projet -->
    <ProjectAnalysisModal
      :visible="showAnalysisModal"
      :analysis="projectAnalysis"
      :loading="analysisLoading"
      :error="analysisError"
      @close="closeAnalysisModal"
      @modify-search="modifySearch"
      @retry="retryAnalysis"
    />

    <!-- Barre de recherche simple -->
    <div class="mb-6">
      <div class="max-w-md">
        <div class="flex items-center mb-2">
          <h3 class="text-sm font-medium text-gray-700">
            Recherche intelligente
          </h3>
        </div>
        <div class="relative">
          <input
            v-model="simpleSearchQuery"
            type="text"
            placeholder="Recherchez"
            class="w-full px-4 py-2 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div
            class="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1"
          >
            <Button
              v-if="simpleSearchQuery"
              icon="pi pi-times"
              text
              size="small"
              class="p-1"
              @click="clearSimpleSearch"
            />
            <Button
              icon="pi pi-search"
              text
              size="small"
              class="p-1"
              :loading="isSimpleSearching"
              disabled
            />
          </div>
        </div>
        <p v-if="simpleSearchQuery" class="text-sm text-gray-500 mt-1">
          {{ services.length }} service(s) trouvé(s) pour "{{
            simpleSearchQuery
          }}"
        </p>
      </div>
    </div>
    <div v-if="loading" class="flex justify-center">
      <ProgressSpinner />
    </div>
    <div v-else>
      <div v-if="services.length === 0" class="text-center py-8">
        <p class="text-gray-500">Vous n'avez pas encore de services</p>
        <Button
          label="Créer un service"
          icon="pi pi-plus"
          class="mt-4"
          @click="navigateTo('/services/new')"
        />
      </div>
      <div v-else>
        <div
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <div v-for="(service, i) in services" :key="service.id" class="p-2">
            <Card class="h-full shadow-md rounded-xl overflow-hidden">
              <template #header>
                <div class="h-40 bg-gray-200 flex items-center justify-center">
                  <img
                    :src="`https://picsum.photos/500/500?random=${service.id}`"
                    :alt="service.title"
                    class="h-full w-full object-cover"
                  />
                </div>
              </template>
              <template #title>
                <div class="flex items-center justify-between">
                  <span>{{ service.title || "Sans titre" }}</span>
                  <div class="flex items-center">
                    <span v-if="service.service_type === 'ai'" class="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                      🤖 IA
                    </span>
                    <span v-else class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      👤 Humain
                    </span>
                  </div>
                </div>
              </template>
              <template #subtitle>
                <div
                  class="flex items-center gap-2 mb-2"
                  v-if="service.tag && service.tag.length > 0"
                >
                  <TagIcon class="h-5 w-5" />
                  <span>{{
                    Array.isArray(service.tag)
                      ? service.tag.join(", ")
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
                  {{ service.description || "Pas de description" }}
                </p>
                <div class="flex justify-between items-center mt-4">
                  <span class="font-bold text-lg"
                    >{{ service.price || "0" }} €</span
                  >
                </div>
              </template>
              <template #footer>
                <div class="flex justify-center">
                  <Button
                    v-if="service.service_type === 'ai'"
                    label="Utiliser l'IA"
                    icon="pi pi-bolt"
                    class="w-full bg-purple-600 hover:bg-purple-700"
                    @click="navigateToAiService(service.id)"
                  />
                  <Button
                    v-else
                    label="Voir détails"
                    icon="pi pi-search"
                    class="w-full"
                    @click="navigateToDetails(service.id)"
                  />
                </div>
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
