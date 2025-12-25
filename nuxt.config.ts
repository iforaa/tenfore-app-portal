// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-12-26',
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  app: {
    head: {
      title: 'TenFore App Portal',
      meta: [
        { name: 'description', content: 'Track TenFore mobile apps across App Store and Google Play' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' }
      ]
    }
  },

  // Enable server-side rendering
  ssr: true,

  // Runtime config for environment variables
  runtimeConfig: {
    // Private keys (server-side only)
    // Add any API keys here if needed in the future

    // Public keys (exposed to client)
    public: {
      appName: 'TenFore App Portal'
    }
  },

  // Nitro server configuration
  nitro: {
    // Allow reading/writing to data directory
    storage: {
      data: {
        driver: 'fs',
        base: './data'
      }
    }
  }
});
