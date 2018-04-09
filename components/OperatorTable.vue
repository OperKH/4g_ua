<template>
<section
  class="table-holder"
>
  <header class="operator-header">
    <h3 class="operator-name">{{ operatorName }}</h3>
    <div class="operator-info">
      БС: <b>{{ operatorData.total }}</b>;
      {{ type === 'city' ? 'Міст' : 'Областей' }} : <b>{{ operatorData.values.length }}</b>
    </div>
  </header>

  <vue-good-table
    class="table table-striped"
    :columns="columns"
    :rows="operatorData.values"
    :sort-options="sortOptions"
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
</template>

<script>
import { sortAlhabeticallyFn, formatDateFn } from '@/utils'

export default {
  name: 'OperatorTable',
  props: ['operatorName', 'operatorData', 'type'],
  data() {
    return {
      columnsAll: [
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
    }
  },
  computed: {
    columns() {
      return this.type === 'city' ? this.columnsAll : this.columnsAll.slice(1)
    },
    sortOptions() {
      return {
        enabled: true,
        initialSortBy: { field: this.type, type: 'asc' },
      }
    },
  },
}
</script>

