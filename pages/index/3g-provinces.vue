<template>
<main>
  <h2 hidden>По областях</h2>
  <div class="tables-content" v-if="provinces">
    <OperatorTable
      type="province"
      v-if="provinces"
      v-for="operator in opertatorsList3G"
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
import { opertatorsList3G, operatorsConfig } from '@/utils'

export default {
  name: 'Provinces3G',
  components: {
    OperatorTable,
  },
  data() {
    return {
      opertatorsList3G,
      operatorsConfig,
      provinces: null,
      error: null,
    }
  },
  async asyncData() {
    const host = process.server ? 'http://localhost:3000' : ''
    try {
      const { data: provinces } = await axios.get(`${host}/api/3g-provinces.json`)
      return { provinces, error: null }
    } catch (error) {
      return { provinces: null, error }
    }
  },
}
</script>
