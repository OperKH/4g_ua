import axios from 'axios'

const regDigit = /\d+/g

// Helpers
export const escapeRegExp = str => str.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')
export const parseQtyFromBrands = brand => (brand.match(regDigit) || []).reduce((acc, str) => acc + parseInt(str), 0)

// Operators
export const operatorsConfig = {
  ks: { name: 'Київстар' },
  mts: { name: 'Vodafone' },
  life: { name: 'lifecell' },
  triMob: { name: '3Mob' },
}
export const operatorsList3G = ['ks', 'mts', 'life', 'triMob']
export const operatorsList4G = ['ks', 'mts', 'life']
export const operatorsList = Object.keys(operatorsConfig)

// Sort
export const sortAlphabeticallyFn = (a, b) => a.localeCompare(b)

// Format
export const formatDateFn = dateISO => {
  const d = new Date(dateISO)
  const year = d.getFullYear()
  const mon = d.getMonth() + 1
  const day = d.getDate()
  return `${day < 10 ? '0' + day : day}.${mon < 10 ? '0' + mon : mon}.${year}`
}

// Filter
export const filterByAllFieldsFn = (data, filterString) =>
  !!Object.values(data).find(s => {
    const regExp = new RegExp(escapeRegExp(filterString), 'i')
    return regExp.test(s) || regExp.test(parseQtyFromBrands(s) || null)
  })

export const readFileAsync = (...args) => {
  return new Promise((resolve, reject) => {
    const fs = require('fs')
    fs.readFile(...args, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const requestJsonAsync = async file => {
  if (process.server) {
    const data = await readFileAsync(`static/api/${file}`, 'utf8')
    return JSON.parse(data)
  } else {
    const { data } = await axios.get(`/api/${file}`)
    return data
  }
}
