<script setup>
definePageMeta({
  layout: "navbar",
});

// Catégories de métiers digitaux
const categories = [
  { icon: '💻', name: 'Développement', color: 'bg-blue-500' },
  { icon: '🎨', name: 'Design', color: 'bg-purple-500' },
  { icon: '📊', name: 'Data', color: 'bg-green-500' },
  { icon: '🔒', name: 'Cybersécurité', color: 'bg-red-500' },
  { icon: '☁️', name: 'Cloud', color: 'bg-indigo-500' },
  { icon: '🤖', name: 'IA/ML', color: 'bg-pink-500' },
  { icon: '📱', name: 'Mobile', color: 'bg-yellow-500' },
  { icon: '🌐', name: 'DevOps', color: 'bg-orange-500' }
]

// FAQ
const faqItems = ref([
  {
    question: "Quels sont les métiers les plus demandés dans le digital ?",
    answer: "Les métiers les plus recherchés actuellement sont : développeur full-stack, data scientist, expert en cybersécurité, DevOps engineer, et UX/UI designer. Ces postes offrent d'excellentes perspectives de carrière et des salaires attractifs.",
    isOpen: false
  },
  {
    question: "Faut-il un diplôme pour travailler dans le digital ?",
    answer: "Bien qu'un diplôme soit souvent apprécié, le secteur du digital privilégie les compétences et l'expérience pratique. De nombreux professionnels sont autodidactes ou ont suivi des formations courtes. Les certifications techniques sont également très valorisées.",
    isOpen: false
  },
  {
    question: "Quel est le salaire moyen dans les métiers du digital ?",
    answer: "Les salaires varient selon l'expérience et la spécialisation. En France, un développeur junior peut gagner 35-45k€, un senior 60-80k€, et un expert 80-120k€. Les data scientists et experts cybersécurité ont souvent des salaires plus élevés.",
    isOpen: false
  },
  {
    question: "Comment se former aux métiers du digital ?",
    answer: "Plusieurs options s'offrent à vous : formations universitaires (Master en informatique), écoles spécialisées (Epitech, 42, etc.), bootcamps intensifs, plateformes en ligne (OpenClassrooms, Udemy), et l'apprentissage autodidacte via des projets personnels.",
    isOpen: false
  },
  {
    question: "Quelles sont les tendances actuelles du secteur ?",
    answer: "L'intelligence artificielle, le cloud computing, la cybersécurité, et le développement mobile sont les tendances majeures. L'IA générative (ChatGPT, etc.) révolutionne de nombreux métiers. La durabilité numérique et l'éthique tech deviennent également importantes.",
    isOpen: false
  }
])

const toggleFaq = (index) => {
  faqItems.value[index].isOpen = !faqItems.value[index].isOpen
}
</script>

<template>
  <div class="container">
    <!-- Bannière avec titre et recherche -->
    <div class="relative text-white py-24 px-6 rounded-xl mb-8 mt-8 overflow-hidden">
      <video 
        autoplay 
        muted 
        loop 
        class="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/assets/animated-banner.mp4" type="video/mp4">
      </video>
      <div class="absolute inset-0 bg-black/40 z-10"></div>

      <div class="relative z-20 max-w-5xl mx-auto text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">
          Trouvez le freelance idéal pour votre projet
        </h1>
        <p class="text-xl mb-8 text-blue-100">
          Connectez-vous avec des experts qualifiés dans tous les domaines du digital
        </p>

        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <input
              type="text"
              placeholder="Rechercher un métier, une compétence ou une technologie..."
              class="w-full px-6 py-3 text-gray-800 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white/20 shadow-lg"
            />
            <button class="absolute right-2 top-1.5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors">
              🔍
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Section Présentation des Services -->
    <div class="py-16 px-6">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Contenu texte à gauche -->
          <div class="space-y-6">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-800">
              Une plateforme complète pour vos projets digitaux
            </h2>
            <p class="text-lg text-gray-600 leading-relaxed">
              Notre plateforme connecte entreprises et freelances qualifiés dans tous les domaines du digital. 
              Développement web, design, marketing, data science... Trouvez l'expert qu'il vous faut en quelques clics.
            </p>
            <div class="space-y-4">
              <div class="flex items-center space-x-3">
                <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm">✓</span>
                </div>
                <span class="text-gray-700">Profils vérifiés et compétences validées</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm">✓</span>
                </div>
                <span class="text-gray-700">Paiement sécurisé et protection des projets</span>
              </div>
              <div class="flex items-center space-x-3">
                <div class="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span class="text-white text-sm">✓</span>
                </div>
                <span class="text-gray-700">Support client disponible 24/7</span>
              </div>
            </div>
            <button class="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Découvrir nos services
            </button>
          </div>
          
          <!-- Image à droite -->
          <div class="relative">
            <div class="bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl p-8 shadow-lg">
              <img 
                src="/assets/img/man-work.png" 
                alt="Services digitaux" 
                class="w-full h-80 object-cover rounded-xl shadow-md"
                onerror="this.src='https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'"
              />
            </div>
            <!-- Éléments décoratifs -->
            <div class="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20"></div>
            <div class="absolute -bottom-4 -left-4 w-16 h-16 bg-blue-400 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8 mt-8">
      <div 
        v-for="category in categories" 
        :key="category.name"
        class="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
      >
        <div class="p-4 text-center">
          <div 
            :class="`${category.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`"
          >
            <span class="text-2xl">{{ category.icon }}</span>
          </div>
          <h3 class="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">
            {{ category.name }}
          </h3>
        </div>
      </div>
    </div>

    <div class="mt-12 mb-8">
      <h2 class="text-2xl font-bold text-gray-800 mb-6 text-center">Questions Fréquentes</h2>
      
      <div class="max-w-3xl mx-auto space-y-4">
        <div 
          v-for="(item, index) in faqItems" 
          :key="index"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <button
            @click="toggleFaq(index)"
            class="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
          >
            <span class="font-semibold text-gray-800">{{ item.question }}</span>
            <span 
              class="text-primary text-xl transition-transform duration-300"
              :class="{ 'rotate-45': item.isOpen }"
            >
              +
            </span>
          </button>
          
          <div 
            v-show="item.isOpen"
            class="px-6 pb-4 text-gray-600 border-t border-gray-100"
          >
            <p class="pt-4 leading-relaxed">{{ item.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <footer class="bg-gray-100 text-gray-800 mt-20 w-full">
    <div class="w-full px-6 py-16">
      <!-- Section principale du footer -->
      <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        <!-- Logo et description -->
        <div class="lg:col-span-1">
          <div class="flex items-center mb-4">
            <img src="/assets/img/logo.png" alt="Logo" class="h-8 w-auto mr-3" />
            <span class="text-xl font-bold text-gray-900">FreelanceHub</span>
          </div>
          <p class="text-gray-600 mb-6 leading-relaxed">
            La plateforme qui connecte entreprises et freelances qualifiés dans tous les domaines du digital.
          </p>
          <div class="flex space-x-4">
            <a href="#" class="text-gray-500 hover:text-gray-800 transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-500 hover:text-gray-800 transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
              </svg>
            </a>
            <a href="#" class="text-gray-500 hover:text-gray-800 transition-colors">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
          </div>
        </div>

        <!-- Services -->
        <div>
          <h3 class="text-lg font-semibold mb-6 text-gray-900">Services</h3>
          <ul class="space-y-3">
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Développement Web</a></li>
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Design & UX</a></li>
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Marketing Digital</a></li>
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Data Science</a></li>
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Cybersécurité</a></li>
          </ul>
        </div>

        <!-- Entreprise -->
        <div>
          <h3 class="text-lg font-semibold mb-6 text-gray-900">Entreprise</h3>
          <ul class="space-y-3">
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">À propos</a></li>
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Carrières</a></li>
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Blog</a></li>
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Presse</a></li>
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Contact</a></li>
          </ul>
        </div>

        <!-- Support -->
        <div>
          <h3 class="text-lg font-semibold mb-6 text-gray-900">Support</h3>
          <ul class="space-y-3">
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Centre d'aide</a></li>
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Sécurité</a></li>
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Confidentialité</a></li>
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Conditions</a></li>
            <li><a href="#" class="text-gray-600 hover:text-gray-900 transition-colors">Cookies</a></li>
          </ul>
        </div>
      </div>

      <!-- Ligne de séparation -->
      <div class="w-full border-t border-gray-300 pt-8">
        <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-500 text-sm">
            © 2024 FreelanceHub. Tous droits réservés.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-500 hover:text-gray-900 text-sm transition-colors">Mentions légales</a>
            <a href="#" class="text-gray-500 hover:text-gray-900 text-sm transition-colors">Politique de confidentialité</a>
            <a href="#" class="text-gray-500 hover:text-gray-900 text-sm transition-colors">CGU</a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
