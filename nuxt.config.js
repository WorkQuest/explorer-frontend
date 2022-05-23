import shrinkRay from 'shrink-ray-current';
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
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/style-resources',
    'bootstrap-vue/nuxt',
    'nuxt-i18n',
  ],
  bootstrapVue: {
    componentPlugins: ['ToastPlugin'],
    components: ['b-table', 'b-skeleton', 'b-collapse', 'b-skeleton-table'],
  },
  build: {
    productionGzip: true,
    productionGzipExtensions: ['js', 'css', 'svg', 'scss', 'vue', 'html'],
    extend(config, { isClient }) {
      config.node = { fs: 'empty' };
      if (isClient) {
        config.optimization.splitChunks.maxSize = 100000;
      }
    },
    babel: {
      compact: false,
    },
    loaders: {
      scss: { sourceMap: false },
    },
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        removeComments: true,
        preserveLineBreaks: false,
        collapseWhitespace: true,
      },
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
    PRODUCTION: process.env.PRODUCTION,
    BASE_URL: process.env.BASE_URL,
    WQ_PROVIDER: process.env.WQ_PROVIDER,
    WQ_ORACLE_URL: process.env.WQ_ORACLE_URL,
  },
  render: {
    compressor: shrinkRay(),
  },
};
