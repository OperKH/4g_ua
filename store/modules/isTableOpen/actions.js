export default {
  toggleTableOpen(context, operatorKey) {
    const isActive = context.getters.isTableOpen[operatorKey]
    const payload = { [operatorKey]: !isActive }
    context.commit('toggleTableOpen', payload)
  }
}
