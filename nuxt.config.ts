import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // Runtime config from env variables
  runtimeConfig: {
    public: {
      secureCookies: process.env.SECURE_COOKIES === 'true',
    },
    jwtPrivateKey: '-----BEGIN EC PRIVATE KEY-----\n' + process.env.JWT_PRIVATE_KEY + '\n-----END EC PRIVATE KEY-----\n',
    jwtPublicKey: '-----BEGIN PUBLIC KEY-----\n' + process.env.JWT_PUBLIC_KEY + '\n-----END PUBLIC KEY-----\n',
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
  },

  // Vuetify configuration
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
