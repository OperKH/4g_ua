<template>
<section
  class="table-holder"
>
  <header class="operator-header">
    <h3 class="operator-name">{{ operatorName }}</h3>
    <div class="operator-info">
      БС: <b>{{ operatorData.total }}</b><template v-if="operatorData.diffTotal"> (<template v-if="operatorData.diffTotal > 0">+</template>{{ operatorData.diffTotal }})</template>;
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
    <template #table-row="{ column, row, formattedRow }">
      <template v-if="column.field === 'brands'">
        <template v-if="2600 in row.brands">
          <div>
            <b>1800</b><template v-if="row.brands[1800].indexOf(',') !== -1">({{row.qty[1800]}})</template>: {{row.brands[1800] || '&ndash;'}}
            <DiffQty :diffQty="row.diffQty" freq="1800" v-if="row.diffQty"/>
          </div>
          <div>
            <b>2600</b><template v-if="row.brands[2600].indexOf(',') !== -1">({{row.qty[2600]}})</template>: {{row.brands[2600] || '&ndash;'}}
            <DiffQty :diffQty="row.diffQty" freq="2600" v-if="row.diffQty"/>
          </div>
          <div>
            <b>Разом</b><template v-if="row.brands.all.indexOf(',') !== -1">({{row.qty.all}})</template>: {{row.brands.all}}
            <DiffQty :diffQty="row.diffQty" freq="all" v-if="row.diffQty"/>
          </div>
        </template>
        <template v-else>
          <div>{{row.brands.all}}</div>
          <div>
            <b>Разом</b>: {{row.qty.all}}
            <DiffQty :diffQty="row.diffQty" freq="all" v-if="row.diffQty"/>
          </div>
        </template>
      </template>
      <template v-else-if="column.field === 'date'">
        <time :datetime="row.date">{{ formattedRow.date }}</time>
      </template>
      <template v-else>
        {{ formattedRow[column.field] }}
      </template>
    </template>
  </vue-good-table>
</section>
</template>

<script>
import DiffQty from './DiffQty'
import { parseQtyFromBrands, sortAlphabeticallyFn, filterByAllFieldsFn, formatDateFn } from '@/utils'

export default {
  name: 'OperatorTable',
  components: {
    DiffQty,
  },
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

