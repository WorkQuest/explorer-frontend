<template>
  <div
    v-if="!isLoading"
    class="blocks"
  >
    <search-filter class="blocks__search" />

    <base-table
      id="blocks-table"
      class="blocks__table"
      :title="$tc('ui.blocks')"
      :items="blocks"
      :fields="tableHeaders"
      type="blocks"
      :table-busy="tableBusy"
    />

    <paginator
      v-if="totalPages > 1"
      v-model="page"
      class="transactions__pager"
      :total-pages="totalPages"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Blocks',
  data() {
    return {
      limit: 20,
      offset: 0,
      page: +this.$route.query?.page || 1,
      tableBusy: false,
    };
  },
  computed: {
    ...mapGetters({
      blocks: 'blocks/getBlocks',
      blocksCount: 'blocks/getBlocksCount',
      isLoading: 'main/getIsLoading',
    }),
    totalPages() {
      return this.setTotalPages(this.blocksCount, this.limit);
    },
    tableHeaders() {
      return [
        {
          key: 'blockNumber',
          label: this.$t('ui.block.blockNumber'),
          sortable: true,
          formatter: (value, key, item) => item.number,
        },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: true,
          formatter: (value, key, item) => this.formatDataFromNow(item.timestamp),
        },
        { key: 'transactionsCount', label: this.$t('ui.block.txn'), sortable: true },
        {
          key: 'gasUsed',
          label: this.$t('ui.block.gasUsed'),
          sortable: true,
          formatter: (value, key, item) => `${this.NumberFormat((+item.gas_used / +item.gas_limit) * 100, 4)}%`,
        },
        {
          key: 'gasLimit',
          label: this.$t('ui.block.gasLimit'),
          sortable: true,
          formatter: (value, key, item) => this.NumberFormat(item.gas_limit),
        },
      ];
    },
    payload() {
      return {
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
      };
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
    await this.SetLoader(false);
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
