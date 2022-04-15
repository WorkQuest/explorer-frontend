<template>
  <div class="transactions">
    <base-table
      id="transactions-table"
      class="transactions__table"
      :title="query ? '' : $tc('ui.txs')"
      :items="txsTable"
      :fields="tableHeaders"
      :table-busy="tableBusy"
      type="transactions"
      :skeleton="{rows: limit, columns: tableHeaders.length}"
      :sort-direction.sync="sortDirectionForTable"
      :sort-by.sync="sortFieldForTable"
      :sort-desc.sync="sortDescForTable"
      @table-sort="changeSortParams"
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
              :to="`/blocks/${query}`"
            >
              {{ query }}
            </nuxt-link>
          </p>
        </div>
      </template>
    </base-table>

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
import { isSortable, sortDirections, sortTables } from '~/utils';

export default {
  name: 'Transactions',
  data() {
    return {
      limit: 20,
      offset: 0,
      page: +this.$route.query?.page || 1,
      tableBusy: false,
      sortDirection: 'DESC',
      sortField: 'block.timestamp',
    };
  },
  computed: {
    ...mapGetters({
      txs: 'tx/getTxs',
      txsCount: 'tx/getTxsCount',
      WUSDSymbol: 'tokens/getWUSDTokenSymbol',
      WUSDDecimal: 'tokens/getWUSDTokenDecimals',
      currentBlock: 'blocks/getCurrentBlock',
      currentBlockTransactions: 'blocks/getCurrentBlockTransactions',
      currentBlockTransactionsCount: 'blocks/getCurrentBlockTransactionsCount',
    }),
    query() {
      return this.$route.query.block;
    },
    txsTable() {
      return this.query && this.currentBlockTransactionsCount > 0
        ? this.currentBlockTransactions
        : this.txs;
    },
    payload() {
      return {
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
        'sort[field]': this.sortField,
        'sort[type]': this.sortDirection,
      };
    },
    totalPages() {
      return this.query && this.currentBlockTransactionsCount > 0
        ? this.setTotalPages(this.currentBlockTransactionsCount, this.limit)
        : this.setTotalPages(this.txsCount, this.limit);
    },
    tableHeaders() {
      return [
        { key: 'hash', label: this.$t('ui.tx.transaction'), sortable: isSortable('transactions', 'hash') },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: isSortable('transactions', 'age'),
          formatter: (value, key, item) => this.formatDataFromNow(item.block.timestamp),
        },
        {
          key: 'blockNumber',
          label: this.$t('ui.block.blockNumber'),
          sortable: isSortable('transactions', 'blockNumber'),
          formatter: (value, key, item) => item.block_number,
        },
        {
          key: 'addressFrom',
          label: this.$t('ui.tx.from'),
          sortable: isSortable('transactions', 'addressFrom'),
          formatter: (value, key, item) => item.from_address_hash?.bech32 || '',
        },
        {
          key: 'addressTo',
          label: this.$t('ui.tx.to'),
          sortable: isSortable('transactions', 'addressTo'),
          formatter: (value, key, item) => item.to_address_hash?.bech32 || '',
        },
        {
          key: 'value',
          label: this.$t('ui.tx.value'),
          sortable: isSortable('transactions', 'value'),
          formatter: (value) => `${this.ConvertFromDecimals(value, this.WUSDDecimal, 4)} ${this.WUSDSymbol}`,
        },
        {
          key: 'gasUsed',
          label: this.$t('ui.tx.fee'),
          sortable: isSortable('transactions', 'gasUsed'),
          formatter: (value, key, item) => [
            {
              value: this.FormatSmallNumber(this.ConvertFromDecimals(item.gas_used * item.gas_price, this.WUSDDecimal)),
              class: 'grey',
            },
          ],
        },
      ];
    },
    sortFieldForTable() {
      return this.GetSortKeyByValue('transactions', this.sortField);
    },
    sortDirectionForTable() {
      return this.sortDirection.toLowerCase();
    },
    sortDescForTable() {
      return this.sortDirectionForTable === 'desc';
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
      this.tableBusy = true;
      if (this.query) {
        await this.$store.dispatch('blocks/getBlockTransactions', { blockId: this.query, ...this.payload });
      } else {
        await this.$store.dispatch('tx/getTxs', this.payload);
      }
      this.tableBusy = false;
    },
    async changeSortParams(params) {
      const { sortBy, sortDesc } = params;
      console.log('params: ', params, sortBy, sortDesc);
      if (sortBy !== this.sortDirectionForTable) {
        this.sortDirection = sortDirections.DESC;
      } else {
        this.sortDirection = this.sortDirection === sortDirections.ASC;
      }
      // this.sortDirection = sortDesc ? sortDirections.DESC : sortDirections.ASC;
      console.log('sortDirection: ', this.sortDirection);
      this.sortField = sortTables.transactions[sortBy];
      if (sortBy) {
        console.log('payload: ', this.payload);
        await this.getTransactions();
        this.refreshTable();
      }
    },
    refreshTable() {
      this.$root.$emit('bv::table::refresh', 'transactions-table');
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
    padding: 8px 20px;
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
