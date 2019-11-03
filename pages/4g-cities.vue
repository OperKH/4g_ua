<template>
  <main>
    <h2 hidden>По містах</h2>
    <div class="tables-content" v-if="cities">
      <OperatorTable
        type="city"
        v-for="operator in operatorsList4G"
        :key="operator"
        :operatorData="cities.operators[operator]"
        :operatorName="operatorsConfig[operator].name"
        :operatorKey="operator"
        :class="'operator-' + operator"
      />
    </div>
    <div class="updated" v-if="cities">
      <b>Оновлено:</b>
      {{cities.updateDate | formatDate}}
    </div>
  </main>
</template>

<script>
import OperatorTable from '@/components/OperatorTable'
import { operatorsList4G, operatorsConfig, requestJsonAsync } from '@/utils'

export default {
  name: 'Cities4G',
  components: {
    OperatorTable,
  },
  data() {
    return {
      operatorsList4G,
      operatorsConfig,
      cities: null,
      error: null,
    }
  },
  async asyncData() {
    try {
      return { cities: await requestJsonAsync('4g-cities.json'), error: null }
    } catch (error) {
      return { cities: null, error }
    }
  },
}
</script>
