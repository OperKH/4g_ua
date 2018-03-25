<template>
<section>
  <h2>По областях</h2>
  <div><b>Оновлено:</b> {{provinces.updateDate | formatDate}}</div>
  <div class="content" v-if="provinces">
    <section
      class="table-holder"
      v-for="(operator, index) in opertatorsList3G"
      :key="index"
    >
      <header class="operator-header">
        <h3 class="operator-name">{{ operatorsConfig[operator].name }}</h3>
        <div>
          БС: <b>{{ provinces.operators[operator].total }}</b>;
          Областей: <b>{{ provinces.operators[operator].values.length }}</b>
        </div>
      </header>

      <vue-good-table
        :columns="columns"
        :rows="provinces.operators[operator].values"
        :defaultSortBy="defaultSortBy"
      >
        <template slot="table-row" slot-scope="props">
          <template v-if="props.column.field == 'date'">
            <time :datetime="props.row.date">{{ props.formattedRow.date }}</time>
          </template>
          <template v-else>
            {{props.formattedRow[props.column.field]}}
          </template>
        </template>
      </vue-good-table>
    </section>
  </div>
</section>
</template>

<script>
import axios from 'axios'
import { opertatorsList3G, operatorsConfig, sortAlhabeticallyFn, formatBrandsFn, formatDateFn } from '@/utils'

export default {
  name: 'provinces-3g',
  data() {
    return {
      opertatorsList3G,
      operatorsConfig,
      provinces: null,
      error: null,
      columns: [
        {
          label: 'Область',
          field: 'province',
          sortFn: sortAlhabeticallyFn,
          filterOptions: {
            enabled: true,
            placeholder: 'Пошук...',
          },
        },
        {
          label: 'К-ть БС',
          field: 'quantity',
          type: 'number',
          filterOptions: {
            enabled: true,
            placeholder: 'Пошук...',
          },
        },
        {
          label: 'Постачальник обладнання',
          field: 'brands',
          sortable: false,
          formatFn: formatBrandsFn,
          filterOptions: {
            enabled: false,
          },
        },
        {
          label: 'Останнє додавання',
          field: 'date',
          formatFn: formatDateFn,
          filterOptions: {
            enabled: true,
            placeholder: 'Пошук...',
          },
        },
      ],
      defaultSortBy: { field: 'province', type: 'asc' },
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
