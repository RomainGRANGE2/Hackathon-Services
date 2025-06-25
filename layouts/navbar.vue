<template>
  <div class="container">
    <div class="card">
      <Menubar :model="items" :pt="ptMenuBar" class="pt-5">
        <template #start>
          <a href="/" class="flex items-center gap-1">
            <img src="../assets/img/logo.png" alt="logo" class="h-10 w-auto rounded-md" />
            <img src="../assets/img/title.png" alt="logo" class="h-8 w-auto rounded-md pr-3" />
          </a>
        </template>
        <template #item="{ item, props, hasSubmenu, root }">
          <a v-ripple class="flex items-center" v-bind="props.action" :href="item.href || '#'" :class="{ 'cursor-pointer': item.href }">
            <span>{{ item.label }}</span>
            <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
            <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
            <i v-if="hasSubmenu" :class="['pi pi-angle-down ml-auto', { 'pi-angle-down': root, 'pi-angle-right': !root }]"></i>
          </a>
        </template>
        <template #end>
          <div class="flex items-center gap-4">
            <Button v-if="!session?.user" class="cursor-pointer p-2 rounded-lg px-4" @click="goToLogin()">Se connecter</Button>
            <Button v-if="session?.user" class="cursor-pointer text-prime-vue-error bg-red-100 border-0 hover:!bg-red-500 active:!bg-red-800 hover:!border-0 p-2 rounded-lg px-4" @click="logout">Logout</Button>
          </div>
        </template>
      </Menubar>
    </div>
  </div>
  <slot />
  
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

<script setup>
import { ref } from "vue";

const { clear, session } = useUserSession()

const ptMenuBar = {
  root:"!border-0"
}

const items = ref([
  {
    label: 'Services',
    href: '/services',
    icon: 'pi pi-search',
  },
  {
    label: 'Mes offres',
    href: '/services/myoffers',
    icon: 'pi pi-search',
  }
]);

const logout = async function (){
  await clear()
}

const goToLogin = async function (){
  navigateTo('/auth')
}
</script>
