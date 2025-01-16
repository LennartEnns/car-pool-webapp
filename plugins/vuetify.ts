import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { md3 } from 'vuetify/blueprints'

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    blueprint: md3,
    theme: {
      defaultTheme: 'light',
    },
    // ... your configuration
  })
  app.vueApp.use(vuetify)
})