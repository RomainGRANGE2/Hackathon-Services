import Aura from '@primeuix/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@primevue/nuxt-module',
    'nuxt-auth-utils',
  ],
  primevue: {
    options: {
      theme: {
        preset: {
          ...Aura,
          semantic:{
            ...Aura.semantic,
            primary: {
              '50': '#f5f8f6',
              '100': '#dfe8e3',
              '200': '#bfd0c8',
              '300': '#97b1a5',
              '400': '#6f8d80',
              '500': '#577569',
              '600': '#445d53',
              '700': '#394c44',
              '800': '#313e3a',
              '900': '#2b3632',
              '950': '#161d1b',
            }
          }
        },
        options: {
          darkModeSelector: '.my-app-dark',
        }
      }
    },
  },
})