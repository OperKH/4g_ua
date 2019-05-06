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
      <template v-if="props.column.field === 'brands'">
        <template v-if="2600 in props.row.brands">
          <div><b>1800<span v-if="props.row.brands[1800].indexOf(',') !== -1">({{props.row.qty[1800]}})</span></b>: {{props.row.brands[1800] || '-'}}</div>
          <div><b>2600<span v-if="props.row.brands[2600].indexOf(',') !== -1">({{props.row.qty[2600]}})</span></b>: {{props.row.brands[2600] || '-'}}</div>
          <div><b>Разом<span v-if="props.row.brands.all.indexOf(',') !== -1">({{props.row.qty.all}})</span></b>: {{props.row.brands.all}}</div>
        </template>
        <template v-else>
          <div>{{props.row.brands.all}}</div>
          <div><b>Разом</b>: {{props.row.qty.all}}</div>
        </template>
      </template>
      <template v-else-if="props.column.field === 'date'">
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
import { parseQtyFromBrands, sortAlphabeticallyFn, filterByAllFieldsFn, formatDateFn } from '@/utils'

export default {
  name: 'OperatorTable',
  props: {
    operatorName: {
      type: String,
      required: true
    },
    operatorData: {
      type: Object,
      required: true
    },
    type: {
      type: String,
      required: true
    },
  },
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
          field: 'brands',
          sortFn: (a, b) => parseQtyFromBrands(a.all) - parseQtyFromBrands(b.all),
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

