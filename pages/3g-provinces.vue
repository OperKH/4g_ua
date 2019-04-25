<template>
  <main>
    <h2 hidden>По областях</h2>
    <div class="tables-content" v-if="provinces">
      <OperatorTable
        type="province"
        v-for="operator in opertatorsList3G"
        :key="operator"
        :operatorData="provinces.operators[operator]"
        :operatorName="operatorsConfig[operator].name"
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
import { opertatorsList3G, operatorsConfig, requestJsonAsync } from '@/utils'

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
    try {
      return { provinces: await requestJsonAsync('3g-provinces.json'), error: null }
    } catch (error) {
      return { provinces: null, error }
    }
  },
}
</script>
