<template>
  <div class="blocks">
    <base-table
      :id="`${id}-table`"
      class="blocks__table"
      :title="$tc('ui.blocks')"
      :items="blocks"
      :fields="tableHeaders"
      :table-busy="tableBusy"
      :type="id"
      :skeleton="{rows: limit, columns: tableHeaders.length}"
      :sort-by.sync="sortFieldForTable"
      :sort-desc.sync="isSortDesc"
      @table-sort="changeSortParams"
    />
    <paginator
      v-if="totalPages > 1"
      v-model="page"
      :total-pages="totalPages"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { isSortable, sortDirections, sortTables } from '~/utils';

export default {
  name: 'Blocks',
  data() {
    return {
      limit: 20,
      offset: 0,
      page: +this.$route.query?.page || 1,
      tableBusy: false,
      sortDirection: sortDirections.DESC,
      sortField: sortTables.blocks.blockNumber,
      id: 'blocks',
    };
  },
  computed: {
    ...mapGetters({
      blocks: 'blocks/getBlocks',
      blocksCount: 'blocks/getBlocksCount',
    }),
    totalPages() {
      return this.setTotalPages(this.blocksCount, this.limit);
    },
    tableHeaders() {
      return [
        {
          key: 'blockNumber',
          label: this.$t('ui.block.blockNumber'),
          sortable: isSortable(this.id, 'blockNumber'),
          formatter: (value, key, item) => item.number,
        },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: isSortable(this.id, 'age'),
          formatter: (value, key, item) => this.formatDataFromNow(item.timestamp),
        },
        { key: 'transactionsCount', label: this.$t('ui.block.txn'), sortable: isSortable(this.id, 'transactionsCount') },
        {
          key: 'gasUsed',
          label: this.$t('ui.block.gasUsed'),
          sortable: isSortable(this.id, 'gasUsed'),
          formatter: (value, key, item) => [
            {
              value: +item.gas_used,
              class: '',
            },
            {
              value: `${this.NumberFormat((+item.gas_used / +item.gas_limit) * 100, 4)}%`,
              class: 'grey',
            },
          ],
        },
        {
          key: 'gasLimit',
          label: this.$t('ui.block.gasLimit'),
          sortable: isSortable(this.id, 'gasLimit'),
          formatter: (value, key, item) => this.NumberFormat(item.gas_limit),
        },
      ];
    },
    payload() {
      return {
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
        'sort[field]': this.sortField,
        'sort[type]': this.sortDirection,
      };
    },
    sortFieldForTable() {
      return this.GetSortKeyByValue(this.id, this.sortField);
    },
    sortDirectionForTable() {
      return this.sortDirection.toLowerCase();
    },
    isSortDesc() {
      return this.sortDirectionForTable === 'desc';
    },
  },
  watch: {
    async page(current, previous) {
      if (current !== previous) {
        await this.$router.push({ query: { ...this.$route.query, page: this.page.toString() } });
      }
    },
  },
  async mounted() {
    await this.getBlocks();
    sessionStorage.setItem('backRoute', this.$route.fullPath);
  },
  beforeDestroy() {
    if (this.$route.name !== 'blocks-id') {
      sessionStorage.removeItem('backRoute');
    }
  },
  methods: {
    async getBlocks() {
      this.tableBusy = true;
      await this.$store.dispatch('blocks/getBlocks', this.payload);
      this.tableBusy = false;
    },
    async changeSortParams(params) {
      const { sortBy, sortDesc } = params;
      if (sortBy !== this.sortFieldForTable) {
        this.sortDirection = sortDirections.DESC;
      } else {
        this.sortDirection = this.sortDirection === sortDirections.ASC ? sortDirections.DESC : sortDirections.ASC;
      }
      this.sortField = sortTables[this.id][sortBy];
      if (sortBy) {
        await this.getBlocks();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.blocks {
  @include container;
  animation: show 1s 1;

  &__search {
    margin: 25px 0;
  }
}

</style>
