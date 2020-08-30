<template>
<section
  class="table-holder"
>
  <header class="operator-header" :class="{ open: isActive }" @click="headerClickHandler">
    <h3 class="operator-name">{{ operatorName }}</h3>
    <div class="operator-info">
      БС: <b>{{ operatorData.total }}</b><template v-if="operatorData.diffTotal"> (<span :title="operatorData.diffDate | formatDate"><template v-if="operatorData.diffTotal > 0">+</template>{{ operatorData.diffTotal }}</span>)</template>;
      {{ type === 'city' ? 'Міст' : 'Областей' }} : <b>{{ operatorData.values.length }}</b>
    </div>
  </header>

  <slide-up-down :active="isActive" :duration="500">
    <vue-good-table
      class="table table-striped"
      :columns="columns"
      :rows="operatorData.values"
      :sort-options="sortOptions"
      :pagination-options="paginationOptions"
      styleClass="vgt-table striped bordered"
      @on-column-filter="onColumnFilter"
      ref="table"
    >
      <template #table-row="{ column, row, formattedRow }">
        <template v-if="column.field === 'brands'">
          <template v-if="2600 in row.brands">
            <div>
              <b>900</b><template v-if="row.brands[900].indexOf(',') !== -1">({{row.qty[900]}})</template>: {{row.brands[900] || '&ndash;'}}
              <DiffQty :diffDate="operatorData.diffDate" :diffQty="row.diffQty" freq="900" v-if="row.diffQty"/>
            </div>
            <div>
              <b>1800</b><template v-if="row.brands[1800].indexOf(',') !== -1">({{row.qty[1800]}})</template>: {{row.brands[1800] || '&ndash;'}}
              <DiffQty :diffDate="operatorData.diffDate" :diffQty="row.diffQty" freq="1800" v-if="row.diffQty"/>
            </div>
            <div>
              <b>2600</b><template v-if="row.brands[2600].indexOf(',') !== -1">({{row.qty[2600]}})</template>: {{row.brands[2600] || '&ndash;'}}
              <DiffQty :diffDate="operatorData.diffDate" :diffQty="row.diffQty" freq="2600" v-if="row.diffQty"/>
            </div>
            <div>
              <b>Разом</b><template v-if="row.brands.all.indexOf(',') !== -1">({{row.qty.all}})</template>: {{row.brands.all}}
              <DiffQty :diffDate="operatorData.diffDate" :diffQty="row.diffQty" freq="all" v-if="row.diffQty"/>
            </div>
          </template>
          <template v-else>
            <div>{{row.brands.all}}</div>
            <div>
              <b>Разом</b>: {{row.qty.all}}
              <DiffQty :diffDate="operatorData.diffDate" :diffQty="row.diffQty" freq="all" v-if="row.diffQty"/>
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
  </slide-up-down>
</section>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
      required: true,
    },
    operatorData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    operatorKey: {
      type: String,
      required: true,
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
          sortFn: (a, b) => new Date(a) - new Date(b),
          filterOptions: {
            enabled: true,
            placeholder: 'Пошук...',
          },
        },
      ],
    }
  },
  computed: {
    ...mapGetters(['isTableOpen', 'columnFilters']),
    isActive() {
      return this.isTableOpen[this.operatorKey]
    },
    isCity() {
      return this.type === 'city'
    },
    columns() {
      return this.isCity ? this.columnsAll : this.columnsAll.slice(1)
    },
    sortOptions() {
      return {
        enabled: true,
        initialSortBy: { field: this.type, type: 'asc' },
      }
    },
    paginationOptions() {
      return {
        enabled: this.isCity,
        mode: 'pages',
        perPage: 10,
        perPageDropdown: [10, 25, 50, 100, 200],
        nextLabel: 'далі',
        prevLabel: 'назад',
        rowsPerPageLabel: 'Рядків на сторінці',
        ofLabel: 'з',
        pageLabel: 'сторінка',
        allLabel: 'Усі',
      }
    }
  },
  methods: {
    ...mapActions(['toggleTableOpen', 'columnFiltersChange']),
    headerClickHandler() {
      this.toggleTableOpen(this.operatorKey)
    },
    onColumnFilter({ columnFilters }) {
      this.columnFiltersChange(columnFilters)
    },
    applyFilters(columnFilters) {
      this.$refs.table.$refs['table-header-primary'].$refs['filter-row'].columnFilters = { ...columnFilters }
      this.$refs.table.filterRows({ ...columnFilters }, false)
    },
  },
  mounted() {
    this.applyFilters(this.columnFilters)
  },
  watch: {
    columnFilters: {
      handler(columnFilters) {
        this.applyFilters(columnFilters)
      },
      deep: true,
    },
  },
}
</script>

