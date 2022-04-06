<template>
  <div
    v-if="!isLoading"
    class="blocks"
  >
    <search-filter class="blocks__search" />

    <table-blocks
      id="blocks-table"
      class="blocks__table"
      :title="$tc('ui.blocks')"
      :items="blocks"
      :fields="tableHeaders"
    />

    <base-pager
      v-if="totalPages > 1"
      v-model="page"
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
        { key: 'number', label: this.$t('ui.block.blockNumber'), sortable: true },
        { key: 'timestamp', label: this.$t('ui.block.age'), sortable: true },
        { key: 'transactionsCount', label: this.$t('ui.block.txn'), sortable: true },
        { key: 'gas_used', label: this.$t('ui.block.gasUsed'), sortable: true },
        { key: 'gas_limit', label: this.$t('ui.block.gasLimit'), sortable: true },
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
    await this.getBlocks();
    sessionStorage.setItem('backRoute', this.$route.fullPath);
  },
  methods: {
    async getBlocks() {
      await this.SetLoader(true);
      await this.$store.dispatch('blocks/getBlocks', this.payload);
      await this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.blocks {
  @include container;

  &__search {
    margin: 25px 0;
  }
}

</style>
