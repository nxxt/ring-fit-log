require('dotenv').config()
const { GITHUB_CLIENT, GITHUB_CLIENT_SECRET, GOOGLE_CLIENT } = process.env

const brands = {
  github: '#211F1F',
  facebook: '#3B5998',
  twitter: '#1DA1F2',
  qiita: '#4cb10d',
  google: '#db4a39'
}

const config = {
  serverMiddleware: ['~/api'],

  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s - ' + process.env.npm_package_name,
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxt/typescript-build', '@nuxtjs/vuetify'],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    '@nuxtjs/dotenv',
    '@nuxtjs/auth',
    'cookie-universal-nuxt'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    defaultAssets: { icons: 'fa' },
    theme: {
      themes: {
        light: brands,
        dark: {
          ...brands,
          github: '#fff'
        }
      }
    }
  },
  auth: {
    redirect: {
      login: '/',
      logout: '/',
      callback: '/login',
      home: '/record'
    },
    strategies: {
      github: {
        client_id: GITHUB_CLIENT,
        client_secret: GITHUB_CLIENT_SECRET
      },
      google: {
        client_id: GOOGLE_CLIENT
      }
    },
    vuex: false
  },
  router: {
    middleware: ['auth', 'uid']
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
  }
}

module.exports = config
