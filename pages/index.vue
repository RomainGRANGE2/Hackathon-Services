<script setup>
const { clear } = useUserSession()

definePageMeta({
  middleware: ["auth"],
});

const logout = async function (){
  await clear()
  navigateTo("/auth")
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
</script>

<template>
  <div class="container">
    <p class="cursor-pointer" @click="logout">Logout</p>
    
    <!-- Rangée de cartes de catégories -->
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
  </div>
</template>