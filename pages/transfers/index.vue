<template>
  <div
    v-if="!isLoading"
    class="transfer transfer__container"
  >
    <search-filter class="transfer__search" />

    <table-txs
      id="transfers-table"
      class="transfer__table"
      :title="$t('ui.token.token')+' '+$t('ui.token.transfers')"
      :items="allTokenTransfers"
      :fields="tableHeaders"
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

export default {
  name: 'Transfer',
  data() {
    return {
      limit: 20,
      offset: 0,
      page: +this.$route.query?.page || 1,
    };
  },
  computed: {
    ...mapGetters({
      allTokenTransfers: 'tokens/getAllTokenTransfers',
      allTokenTransfersCount: 'tokens/getAllTokenTransfersCount',
      isLoading: 'main/getIsLoading',
    }),
    payload() {
      return {
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
      };
    },
    totalPages() {
      return this.setTotalPages(this.allTokenTransfersCount, this.limit);
    },
    tableHeaders() {
      return [
        { key: 'hash', label: this.$t('ui.tx.transaction'), sortable: true },
        { key: 'age', label: this.$t('ui.block.age'), sortable: true },
        { key: 'from_address_hash.hex', label: this.$t('ui.tx.from'), sortable: true },
        { key: 'to_address_hash.hex', label: this.$t('ui.tx.to'), sortable: true },
        {
          key: 'transfer_amount',
          label: this.$t('ui.tx.value'),
          sortable: true,
          formatter: (value, key, item) => this.ConvertFromDecimals(item.amount, item.tokenContractAddress.token.decimals, 6),
        },
        {
          key: 'tokenContractAddress',
          label: this.$t('ui.token.token'),
          sortable: true,
        },
      ];
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
    await this.getTokenTransfers();
    sessionStorage.setItem('backRoute', this.$route.fullPath);
  },
  beforeDestroy() {
    if (this.$route.name !== 'tx-id') {
      sessionStorage.removeItem('backRoute');
    }
  },
  methods: {
    async getTokenTransfers() {
      await this.SetLoader(true);
      await this.$store.dispatch('tokens/getAllTokensTransfers', this.payload);
      await this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.transfer {
  animation: show 1s 1;
  @include container;

  &__search {
    margin: 25px 0;
  }
}

</style>
