<template>
<main>
  <h2 hidden>По містах</h2>
  <div class="tables-content" v-if="cities">
    <section
      class="table-holder"
      :class="'operator-' + operator"
      v-for="(operator, index) in opertatorsList3G"
      :key="index"
    >
      <header class="operator-header">
        <h3 class="operator-name">{{ operatorsConfig[operator].name }}</h3>
        <div class="operator-info">
          БС: <b>{{ cities.operators[operator].total }}</b>;
          Міст: <b>{{ cities.operators[operator].values.length }}</b>
        </div>
      </header>

      <vue-good-table
        class="table table-striped"
        :columns="columns"
        :rows="cities.operators[operator].values"
        :defaultSortBy="defaultSortBy"
        styleClass="vgt-table striped bordered">
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
  <div class="updated" v-if="cities"><b>Оновлено:</b> {{cities.updateDate | formatDate}}</div>
</main>
</template>

<script>
import axios from 'axios'
import { opertatorsList3G, operatorsConfig, sortAlhabeticallyFn, formatDateFn } from '@/utils'

export default {
  name: 'Cities3G',
  data() {
    return {
      opertatorsList3G,
      operatorsConfig,
      cities: null,
      error: null,
      columns: [
        {
          label: 'Місто',
          field: 'city',
          sortFn: sortAlhabeticallyFn,
          filterOptions: {
            enabled: true,
            placeholder: 'Пошук...',
          },
        },
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
          filterOptions: {
            enabled: true,
            placeholder: 'Пошук...',
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
      defaultSortBy: { field: 'city', type: 'asc' },
    }
  },
  async asyncData() {
    const host = process.server ? 'http://localhost:3000' : ''
    try {
      const { data: cities } = await axios.get(`${host}/api/3g-cities.json`)
      return { cities, error: null }
    } catch (error) {
      return { cities: null, error }
    }
  },
}
</script>
