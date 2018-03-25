module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    htmlAttrs: {
      lang: 'uk',
    },
    title: '4G/3G БС України',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'keywords', content: '4G та 3G базові станціхї України' },
      { hid: 'description', name: 'description', content: '4G/3G БС України' },
      { name: 'theme-color', content: '#80cbc4' },
    ],
    link: [
      { rel: 'icon', type: 'image/png', href: '/img/icons/4g-512x512.png' },
      { rel: 'manifest', href: 'manifest.json' },
    ],
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#009688' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
    vendor: ['axios'],
  },
  plugins: [{ src: '~/plugins/vue-good-table' }, { src: '~/plugins/filters' }],
  modules: [
    [
      '@nuxtjs/google-analytics',
      {
        id: 'UA-114730066-1',
      },
    ],
  ],
}
