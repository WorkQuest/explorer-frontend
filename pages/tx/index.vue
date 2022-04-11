<template>
  <div
    v-if="!isLoading"
    class="transactions"
  >
    <search-filter class="transactions__search" />

    <table-txs
      id="transactions-table"
      class="transactions__table"
      :is-only="false"
      :items="txsTable"
      :fields="tableHeaders"
      :title="query ? '' : $tc('ui.txs')"
    >
      <template
        v-if="query"
        v-slot:table-caption
      >
        <div class="transactions__header">
          <h5 class="transactions__title">
            {{ $t('ui.tx.total') }} {{ currentBlockTransactionsCount }} {{ $t('ui.tx.found') }}
          </h5>
          <p class="transactions__block">
            {{ $t('ui.tx.forBlock') }}
            <nuxt-link
              class="transactions__link"
              :to="`/blocks/`+query"
            >
              {{ query }}
            </nuxt-link>
          </p>
        </div>
      </template>
    </table-txs>

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
  name: 'Transactions',
  data() {
    return {
      limit: 20,
      offset: 0,
      page: +this.$route.query?.page || 1,
    };
  },
  computed: {
    ...mapGetters({
      txs: 'tx/getTxs',
      txsCount: 'tx/getTxsCount',
      currentBlock: 'blocks/getCurrentBlock',
      currentBlockTransactions: 'blocks/getCurrentBlockTransactions',
      currentBlockTransactionsCount: 'blocks/getCurrentBlockTransactionsCount',
      isLoading: 'main/getIsLoading',
    }),
    query() {
      return this.$route.query.block;
    },
    txsTable() {
      return this.query && this.currentBlockTransactionsCount > 0
        ? this.currentBlockTransactions || []
        : this.txs;
    },
    payload() {
      return {
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
      };
    },
    totalPages() {
      return this.query && this.currentBlockTransactionsCount > 0
        ? this.setTotalPages(this.currentBlockTransactionsCount, this.limit)
        : this.setTotalPages(this.txsCount, this.limit);
    },
    tableHeaders() {
      return [
        { key: 'hash', label: this.$t('ui.tx.transaction'), sortable: true },
        { key: 'block.timestamp', label: this.$t('ui.block.age'), sortable: true },
        { key: 'block_number', label: this.$t('ui.block.blockNumber'), sortable: true },
        { key: 'from_address_hash.hex', label: this.$t('ui.tx.from'), sortable: true },
        { key: 'to_address_hash.hex', label: this.$t('ui.tx.to'), sortable: true },
        { key: 'value', label: this.$t('ui.tx.value'), sortable: true },
        { key: 'gas_used', label: this.$t('ui.tx.fee'), sortable: true },
      ];
    },
  },
  watch: {
    async page(current, previous) {
      if (current !== previous) {
        await this.$router.push({ query: { ...this.$route.query, page: this.page.toString() } });
      }
    },
    async query(current, previous) {
      if (!current && current !== previous) {
        await this.getTransactions();
      }
    },
  },
  async mounted() {
    await this.getTransactions();
    sessionStorage.setItem('backRoute', this.$route.fullPath);
  },
  beforeDestroy() {
    this.$store.commit('blocks/resetBlockTransactions');
    this.$store.commit('tx/resetTxs');
    if (this.$route.name !== 'tx-id') {
      sessionStorage.removeItem('backRoute');
    }
  },
  methods: {
    async getTransactions() {
      await this.SetLoader(true);
      if (this.query) {
        await this.$store.dispatch('blocks/getBlockTransactions', { blockId: this.query, ...this.payload });
      } else {
        await this.$store.dispatch('tx/getTxs', this.payload);
      }
      await this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.transactions {
  animation: show 1s 1;
  @include container;

  &__search {
    margin: 25px 0;
  }

  &__header {
    padding: 20px;
  }

  &__title {
    @include text-simple;
    @include normal-font-size;
  }

  &__block {
    @include text-simple;
    @include normal-font-size;
    color: $black300;
    font-size: 14px;
  }

  &__link {
    @include link;
  }
}

@include _767 {
  .transactions {
    &__header {
      padding: 0 20px;
    }
  }
}
</style>
