module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'frontend',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Frontend для API CRM' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/veevalidate',
    '@/plugins/filters',
    '@/plugins/vueqr',
    { src: '@/plugins/mavon-editor', srr: false }
  ],
  css: ['~/assets/style/app.styl'],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  router: {
    middleware: ['auth'],
    extendRoutes (routes, resolve) {
      routes.push({
        name: 'recovery-success',
        path: '/user/password-recovery/success',
        component: resolve(__dirname, 'pages/user/password-recovery-success.vue')
      })
    }
  },
  auth: {
    redirect: {
      login: '/user/login',
      logout: '/user/login',
      callback: false,
      home: '/'
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/auth/sign_in', method: 'post', propertyName: 'token' },
          logout: { url: '/auth/sign_out', method: 'delete' },
          user: { url: '/auth/current', method: 'get', propertyName: 'user' }
        }
      }
    }
  },
  axios: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000'
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    extractCSS: true,
    extend (config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
