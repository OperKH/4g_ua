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
      <template v-if="props.column.field == 'qty'">
        <template v-if="2600 in props.row.qty">
        <div v-if="1800 in props.row.qty"><b>1800</b><span>: {{props.row.qty[1800]}}</span></div>
        <div v-if="2600 in props.row.qty"><b>2600</b><span>: {{props.row.qty[2600]}}</span></div>
        <div><b>Разом</b><span>: {{props.row.qty.all}}</span></div>
        </template>
        <template v-else>{{props.row.qty.all}}</template>
      </template>
      <template v-else-if="props.column.field == 'brands'">
        <template v-if="2600 in props.row.brands">
        <div v-if="1800 in props.row.brands"><b>1800</b><span>: {{props.row.brands[1800] ? props.row.brands[1800] : '-'}}</span></div>
        <div v-if="2600 in props.row.brands"><b>2600</b><span>: {{props.row.brands[2600] ? props.row.brands[2600] : '-'}}</span></div>
        <div><b>Разом</b><span>: {{props.row.brands.all}}</span></div>
        </template>
        <template v-else>{{props.row.brands.all}}</template>
      </template>
      <template v-else-if="props.column.field == 'date'">
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
import { sortAlphabeticallyFn, filterByAllFieldsFn, formatDateFn } from '@/utils'

export default {
  name: 'OperatorTable',
  props: ['operatorName', 'operatorData', 'type'],
  data() {
    return {
      columnsAll: [
        {
          label: 'Місто',
          field: 'city',
          sortFn: sortAlphabeticallyFn,
          filterOptions: {
            enabled: true,
            placeholder: 'Пошук...',
          },
        },
        {
          label: 'Область',
          field: 'province',
          sortFn: sortAlphabeticallyFn,
          filterOptions: {
            enabled: true,
            placeholder: 'Пошук...',
          },
        },
        {
          label: 'К-ть БС',
          field: 'qty',
          sortFn: (a, b) => a.all - b.all,
          filterOptions: {
            enabled: true,
            placeholder: 'Пошук...',
            filterFn: filterByAllFieldsFn,
          },
        },
        {
          label: 'Постачальник обладнання',
          field: 'brands',
          sortFn: (a, b) => sortAlphabeticallyFn(a.all, b.all),
          filterOptions: {
            enabled: true,
            placeholder: 'Пошук...',
            filterFn: filterByAllFieldsFn,
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

