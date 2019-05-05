import Vue from 'vue'

Vue.filter('formatDate', value => {
  const date = new Date(value)
  if (!isFinite(date)) return value
  const year = date.getFullYear()
  const mon = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  return `${day < 10 ? '0' + day : day}.${mon < 10 ? '0' + mon : mon}.${year} ${hours < 10 ? '0' + hours : hours}:${
    minutes < 10 ? '0' + minutes : minutes
  }:${seconds < 10 ? '0' + seconds : seconds}`
})
