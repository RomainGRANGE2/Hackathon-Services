import Aura from '@primeuix/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
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
              '50': '#eef1ff',
              '100': '#e0e6ff',
              '200': '#c7d0fe',
              '300': '#a4b0fd',
              '400': '#8086f9',
              '500': '#6562f2',
              '600': '#5545e6',
              '700': '#4837cb',
              '800': '#3b2fa4',
              '900': '#2f2975',
              '950': '#201b4b',
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