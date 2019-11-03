<template>
  <main>
    <h2 hidden>По областях</h2>
    <div class="tables-content" v-if="provinces">
      <OperatorTable
        type="province"
        v-for="operator in operatorsList4G"
        :key="operator"
        :operatorData="provinces.operators[operator]"
        :operatorName="operatorsConfig[operator].name"
        :operatorKey="operator"
        :class="'operator-' + operator"
      />
    </div>
    <div class="updated" v-if="provinces">
      <b>Оновлено:</b>
      {{provinces.updateDate | formatDate}}
    </div>
  </main>
</template>

<script>
import OperatorTable from '@/components/OperatorTable'
import { operatorsList4G, operatorsConfig, requestJsonAsync } from '@/utils'

export default {
  name: 'Provinces4G',
  components: {
    OperatorTable,
  },
  data() {
    return {
      operatorsList4G,
      operatorsConfig,
      provinces: null,
      error: null,
    }
  },
  async asyncData() {
    try {
      return { provinces: await requestJsonAsync('4g-provinces.json'), error: null }
    } catch (error) {
      return { provinces: null, error }
    }
  },
}
</script>
