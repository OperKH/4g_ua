// Helpers
export const escapeRegExp = str => str.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&')

// Operators
export const opertatorsList3G = ['ks', 'mts', 'life', 'triMob']
export const opertatorsList4G = ['ks', 'mts', 'life']

export const operatorsConfig = {
  ks: { name: 'Київстар' },
  mts: { name: 'Vodafone' },
  life: { name: 'lifecell' },
  triMob: { name: '3Mob' },
}

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
    return regExp.test(s)
  })
