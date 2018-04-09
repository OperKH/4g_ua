<template>
<main>
  <h2 hidden>По областях</h2>
  <div class="tables-content" v-if="provinces">
    <OperatorTable
      type="province"
      v-if="provinces"
      v-for="operator in opertatorsList4G"
      :key="operator"
      :operatorData="provinces.operators[operator]"
      :operatorName="operatorsConfig[operator].name"
      :class="'operator-' + operator"
    />
  </div>
  <div class="updated" v-if="provinces"><b>Оновлено:</b> {{provinces.updateDate | formatDate}}</div>
</main>
</template>

<script>
import axios from 'axios'
import OperatorTable from '@/components/OperatorTable'
import { opertatorsList4G, operatorsConfig } from '@/utils'

export default {
  name: 'Provinces4G',
  components: {
    OperatorTable,
  },
  data() {
    return {
      opertatorsList4G,
      operatorsConfig,
      provinces: null,
      error: null,
    }
  },
  async asyncData() {
    const host = process.server ? 'http://localhost:3000' : ''
    try {
      const { data: provinces } = await axios.get(`${host}/api/4g-provinces.json`)
      return { provinces }
    } catch (error) {
      return { error }
    }
  },
}
</script>
