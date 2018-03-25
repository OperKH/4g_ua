// Operators
export const opertatorsList3G = ['ks', 'mts', 'life', 'triMob']

export const operatorsConfig = {
  ks: { name: 'Київстар' },
  mts: { name: 'Vodafone' },
  life: { name: 'lifecell' },
  triMob: { name: '3Mob' },
}

// Sort
export const sortAlhabeticallyFn = (a, b) => a.localeCompare(b)

// Format
export const formatBrandsFn = brands =>
  brands
    .slice()
    .sort((a, b) => sortAlhabeticallyFn(a.name, b.name))
    .map(brand => `${brand.name}(${brand.quantity})`)
    .join(', ')
export const formatDateFn = dateISO =>
  dateISO
    .split('T')[0]
    .split('-')
    .reverse()
    .join('.')

// Filter
