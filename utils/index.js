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
export const formatDateFn = dateISO =>
  dateISO
    .split('T')[0]
    .split('-')
    .reverse()
    .join('.')

// Filter
