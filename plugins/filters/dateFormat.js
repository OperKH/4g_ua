import Vue from 'vue'

Vue.filter('formatDate', value => {
  const date = new Date(value)
  if (!isFinite(date)) return value
  return date.toLocaleString('ua-UA').replace(',', '')
})
