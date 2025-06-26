<script setup>
definePageMeta({
  layout: "navbar",
});

const formData = ref({
  nom: '',
  email: '',
  sujet: '',
  message: ''
});

const isSubmitting = ref(false);
const submitSuccess = ref(false);

const sujets = [
  'Demande de devis',
  'Question générale',
  'Support technique',
  'Partenariat',
  'Autre'
];

const submitForm = async () => {
  isSubmitting.value = true;
  
  // Simulation d'envoi
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  isSubmitting.value = false;
  submitSuccess.value = true;
  
  // Reset form
  formData.value = {
    nom: '',
    email: '',
    sujet: '',
    message: ''
  };
  
  // Reset success message after 5 seconds
  setTimeout(() => {
    submitSuccess.value = false;
  }, 5000);
};
</script>

<template>
  <div class="container">
    <!-- Bannière de contact -->
    <div class="relative text-white py-24 px-6 rounded-xl mb-12 mt-8 overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 z-0"></div>
      <div class="relative z-10 max-w-4xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">
          Contactez-nous
        </h1>
        <p class="text-xl text-blue-100">
          Nous sommes là pour vous aider. N'hésitez pas à nous contacter !
        </p>
      </div>
    </div>

    <!-- Section principale -->
    <div class="max-w-6xl mx-auto px-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Informations de contact -->
        <div class="space-y-8">
          <div>
            <h2 class="text-3xl font-bold text-gray-800 mb-6">
              Parlons de votre projet
            </h2>
            <p class="text-lg text-gray-600 leading-relaxed">
              Que vous ayez une question, besoin d'un devis ou simplement envie d'échanger, 
              notre équipe est là pour vous accompagner dans vos projets digitaux.
            </p>
          </div>

          <!-- Informations de contact -->
          <div class="space-y-6">
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">Email</h3>
                <p class="text-gray-600">contact@freelancehub.com</p>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">Téléphone</h3>
                <p class="text-gray-600">+33 1 23 45 67 89</p>
              </div>
            </div>

            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <div>
                <h3 class="font-semibold text-gray-800">Adresse</h3>
                <p class="text-gray-600">123 Rue de la Tech<br>75001 Paris, France</p>
              </div>
            </div>
          </div>

          <!-- Horaires -->
          <div class="bg-gray-50 rounded-xl p-6">
            <h3 class="font-semibold text-gray-800 mb-4">Horaires d'ouverture</h3>
            <div class="space-y-2 text-gray-600">
              <div class="flex justify-between">
                <span>Lundi - Vendredi</span>
                <span>9h - 18h</span>
              </div>
              <div class="flex justify-between">
                <span>Samedi</span>
                <span>10h - 16h</span>
              </div>
              <div class="flex justify-between">
                <span>Dimanche</span>
                <span>Fermé</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Formulaire de contact -->
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-800 mb-6">Envoyez-nous un message</h2>
          
          <!-- Message de succès -->
          <div v-if="submitSuccess" class="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            <p class="font-semibold">Message envoyé avec succès !</p>
            <p class="text-sm">Nous vous répondrons dans les plus brefs délais.</p>
          </div>

          <form @submit.prevent="submitForm" class="space-y-6">
            <!-- Nom -->
            <div>
              <label for="nom" class="block text-sm font-medium text-gray-700 mb-2">
                Nom complet *
              </label>
              <input
                id="nom"
                v-model="formData.nom"
                type="text"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Votre nom complet"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                id="email"
                v-model="formData.email"
                type="email"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            <!-- Sujet -->
            <div>
              <label for="sujet" class="block text-sm font-medium text-gray-700 mb-2">
                Sujet *
              </label>
              <select
                id="sujet"
                v-model="formData.sujet"
                required
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="">Sélectionnez un sujet</option>
                <option v-for="sujet in sujets" :key="sujet" :value="sujet">
                  {{ sujet }}
                </option>
              </select>
            </div>

            <!-- Message -->
            <div>
              <label for="message" class="block text-sm font-medium text-gray-700 mb-2">
                Message *
              </label>
              <textarea
                id="message"
                v-model="formData.message"
                required
                rows="6"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                placeholder="Décrivez votre projet ou votre demande..."
              ></textarea>
            </div>

            <!-- Bouton d'envoi -->
            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="isSubmitting" class="flex items-center justify-center">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Envoi en cours...
              </span>
              <span v-else>Envoyer le message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template> 