import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

console.log('NODE_ENV:', process.env.NODE_ENV);

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  
  // Workaround for the weird appManifest bug
  experimental: { appManifest: false },

  runtimeConfig: process.env.NODE_ENV === 'development' ?
  // Development config (uses hardcoded values)
  {
    
    secureCookies: false, // Not using HTTPS in development
    jwtPrivateKey: '-----BEGIN EC PRIVATE KEY-----\n' + 'MIHcAgEBBEIAXKgaCxrAc0CzikikbNlP+W7510PS6CEqrFvEmK9amkG3rcKsGgWIRET9t6XpSSwhz4umFs2Ld3ojZxph4hFz4/ugBwYFK4EEACOhgYkDgYYABADatsU8dTRK2ODyVke3SGB7tcKWCm7UmhdfPjhCSMjJ2Ga8Z6PtHCZw1lV6EOmiSwLdMgmySh6eG2Q/SXevXOAxBgA28u4JrfA0u/MKWuoZvQcGCViMH+Cx2MJHt7WWj/ADdHA/1aKNu3KuShtcP0wijSwiXfVt5GeoNSveCWCiw3EAQQ==' + '\n-----END EC PRIVATE KEY-----\n',
    jwtPublicKey: '-----BEGIN PUBLIC KEY-----\n' + 'MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQA2rbFPHU0Stjg8lZHt0hge7XClgpu1JoXXz44QkjIydhmvGej7RwmcNZVehDpoksC3TIJskoenhtkP0l3r1zgMQYANvLuCa3wNLvzClrqGb0HBglYjB/gsdjCR7e1lo/wA3RwP9WijbtyrkobXD9MIo0sIl31beRnqDUr3glgosNxAEE=' + '\n-----END PUBLIC KEY-----\n',
    refreshPrivateKey: '-----BEGIN EC PRIVATE KEY-----\n' + 'MIHcAgEBBEIAmFvnGPg2cVmFMLSVLOOsVA/UlOqoOKz2GhC0oD6zVnfcLuIj4QVgwfOhiPfSwwSTy84YziBsIu1I2sjYh6hEh76gBwYFK4EEACOhgYkDgYYABABaFpEsTJ5XaxWQ8nghP20fz+Qd0DiJKImGcnZn7F7wgoZokZSF9L77sDD6quhgLMSPQEKNDLL8gjtwAzsobLi7YABMQdBWg5TVeAe0xeqG2TxiuI0DQDDkWrdnB1mUKOG0tUeUfZ+Unj3L9YCVGskLel1WusF0gYDJJ461VE7K0O+ZPQ==' + '\n-----END EC PRIVATE KEY-----\n',
    refreshPublicKey: '-----BEGIN PUBLIC KEY-----\n' + 'MIGbMBAGByqGSM49AgEGBSuBBAAjA4GGAAQAWhaRLEyeV2sVkPJ4IT9tH8/kHdA4iSiJhnJ2Z+xe8IKGaJGUhfS++7Aw+qroYCzEj0BCjQyy/II7cAM7KGy4u2AATEHQVoOU1XgHtMXqhtk8YriNA0Aw5Fq3ZwdZlCjhtLVHlH2flJ49y/WAlRrJC3pdVrrBdIGAySeOtVROytDvmT0=' + '\n-----END PUBLIC KEY-----\n',
    jwtExpirationTime: '60', // Low value for testing
    refreshExpirationTime: '3600',
    registrationKey: '123', // Simple key for testing
  }
  // Production config (uses environment variables)
  : {
    secureCookies: process.env.SECURE_COOKIES === 'true',
    jwtPrivateKey: '-----BEGIN EC PRIVATE KEY-----\n' + process.env.JWT_PRIVATE_KEY + '\n-----END EC PRIVATE KEY-----\n',
    jwtPublicKey: '-----BEGIN PUBLIC KEY-----\n' + process.env.JWT_PUBLIC_KEY + '\n-----END PUBLIC KEY-----\n',
    refreshPrivateKey: '-----BEGIN EC PRIVATE KEY-----\n' + process.env.REFRESH_PRIVATE_KEY + '\n-----END EC PRIVATE KEY-----\n',
    refreshPublicKey: '-----BEGIN PUBLIC KEY-----\n' + process.env.REFRESH_PUBLIC_KEY + '\n-----END PUBLIC KEY-----\n',
    jwtExpirationTime: process.env.JWT_EXPIRATION_TIME,
    refreshExpirationTime: process.env.REFRESH_EXPIRATION_TIME,
    registrationKey: process.env.REGISTRATION_KEY,
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
