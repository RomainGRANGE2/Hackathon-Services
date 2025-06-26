<script setup>
definePageMeta({
  layout: "navbar",
});

// Variable pour stocker la recherche
const searchQuery = ref('')

// Fonction pour gérer la recherche
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo(`/services?search=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

// Fonction pour gérer la soumission avec Entrée
const handleKeyPress = (event) => {
  if (event.key === 'Enter') {
    handleSearch()
  }
}

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
          Trouvez le <span class="bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent drop-shadow-lg">freelance</span> idéal pour votre projet
        </h1>
        <p class="text-xl mb-8 text-blue-100">
          Connectez-vous avec des experts qualifiés dans tous les domaines du digital
        </p>

        <div class="max-w-2xl mx-auto">
          <div class="relative">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Rechercher un métier, une compétence ou une technologie..."
              class="w-full px-6 py-3 text-gray-800 rounded-full text-lg focus:outline-none focus:ring-4 focus:ring-white/20 shadow-lg"
              @keypress="handleKeyPress"
            />
            <button 
              @click="handleSearch"
              class="absolute right-2 top-1.5 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition-colors"
            >
              🔍
            </button>
          </div>
          <p class="text-sm text-blue-200 mt-3 text-center">
            💡 Plus vous êtes précis, plus notre analyse sera personnalisée !
          </p>
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
</template>
