// import createPersistedState from 'vuex-persistedstate'

const plugins = [
  // createPersistedState()
]

const devPlugins = [...plugins]

export default process.env.NODE_ENV !== 'production'
  ? plugins
  : devPlugins
