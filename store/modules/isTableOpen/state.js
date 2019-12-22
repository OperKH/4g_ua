import { operatorsList } from '@/utils'

const state = operatorsList.reduce((acc, operatorName) => {
  acc[operatorName] = true
  return acc
}, {})
export default () => ({
  ...state
})
