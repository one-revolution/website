// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@vueuse/nuxt',
    '@nuxt/image',
    '@pinia/nuxt',
    '@nuxtjs/mdc'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      DEFAULT_RELAY_URLS: [
        'wss://relay.damus.io',
        'wss://relay.primal.net',
        'wss://relay.threenine.services',
        'wss://relay.snort.social'
      ]
    }
  },

  routeRules: {
    '/api/**': {
      cors: true
    }
  },

  compatibilityDate: '2024-07-11',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },
  image: {
    provider: 'cloudinary',
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/threenine-co-uk/image/upload/'
    }
  }
})