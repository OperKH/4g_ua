<template>
<main>
  <h2 hidden>По містах</h2>
  <div class="tables-content" v-if="cities">
    <OperatorTable
      type="city"
      v-if="cities"
      v-for="operator in opertatorsList4G"
      :key="operator"
      :operatorData="cities.operators[operator]"
      :operatorName="operatorsConfig[operator].name"
      :class="'operator-' + operator"
    />
  </div>
  <div class="updated" v-if="cities"><b>Оновлено:</b> {{cities.updateDate | formatDate}}</div>
</main>
</template>

<script>
import axios from 'axios'
import OperatorTable from '@/components/OperatorTable'
import { opertatorsList4G, operatorsConfig } from '@/utils'

export default {
  name: 'Cities4G',
  components: {
    OperatorTable,
  },
  data() {
    return {
      opertatorsList4G,
      operatorsConfig,
      cities: null,
      error: null,
    }
  },
  async asyncData() {
    const host = process.server ? 'http://localhost:3000' : ''
    try {
      const { data: cities } = await axios.get(`${host}/api/4g-cities.json`)
      return { cities, error: null }
    } catch (error) {
      return { cities: null, error }
    }
  },
}
</script>
