import localeEn from './locales/en.json';
import localeRu from './locales/ru.json';

require('dotenv').config();

export default {
  ssr: false,
  target: 'static',
  head: {
    title: 'WorkQuest',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'Decentralized marketplace for work. Where employers can look for performers for different tasks, and workers perform. Work in any field with different deadlines, interactions occur through smart contracts.',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/img/app/favicon.svg' },
    ],
  },
  css: [
    '@/assets/scss/main.scss',
  ],
  plugins: [
    { src: '@plugins/axios.js' },
    { src: '@plugins/main.js' },
    { src: '@plugins/vee-validate.js' },
    { src: '@plugins/clipboard.js' },
    { src: '@plugins/injectComponents.js' },
  ],
  components: true,
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/dotenv',
    '@nuxtjs/color-mode',
    '@nuxtjs/moment',
  ],
  styleResources: {
    scss: ['./assets/scss/resources.scss'],
  },
  serverMiddleware: [
    '~/middleware/redirects.js',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    'bootstrap-vue/nuxt',
    'nuxt-i18n',
    'cookie-universal-nuxt',
  ],
  build: {
    transpile: [
      'vee-validate/dist/rules',
    ],
    babel: {
      compact: false,
    },
  },
  axios: {
    baseURL: process.env.BASE_URL,
  },
  i18n: {
    locales: ['en', 'ru'],
    fallbackLocale: 'en',
    defaultLocale: 'en',
    strategy: 'no_prefix',
    vueI18n: {
      messages: {
        en: localeEn,
        ru: localeRu,
      },
      silentFallbackWarn: true,
    },
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
    },
  },
  moment: {
    defaultLocale: 'en',
    locales: ['ru'],
  },
  env: {
    BASE_URL: process.env.BASE_URL,
  },
};
