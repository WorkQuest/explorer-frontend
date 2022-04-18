<template>
  <div class="transactions">
    <base-table
      :id="`${id}-table`"
      class="transactions__table"
      :title="query ? '' : $tc('ui.txs')"
      :items="txsTable"
      :fields="tableHeaders"
      :table-busy="tableBusy"
      :type="id"
      :skeleton="{rows: limit, columns: tableHeaders.length}"
      :sort-by.sync="sortFieldForTable"
      :sort-desc.sync="isSortDesc"
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
      sortDirection: sortDirections.DESC,
      sortField: sortTables.transactions.age,
      id: 'transactions',
      sessionKey: 'transactionsPagination',
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
        {
          key: 'hash',
          label: this.$t('ui.tx.transaction'),
          sortable: isSortable(this.id, 'hash'),
        },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: isSortable(this.id, 'age'),
          formatter: (value, key, item) => this.formatDataFromNow(item.block.timestamp),
        },
        {
          key: 'blockNumber',
          label: this.$t('ui.block.blockNumber'),
          sortable: isSortable(this.id, 'blockNumber'),
          formatter: (value, key, item) => item.block_number,
        },
        {
          key: 'addressFrom',
          label: this.$t('ui.tx.from'),
          sortable: isSortable(this.id, 'addressFrom'),
          formatter: (value, key, item) => item.from_address_hash?.bech32 || '',
        },
        {
          key: 'addressTo',
          label: this.$t('ui.tx.to'),
          sortable: isSortable(this.id, 'addressTo'),
          formatter: (value, key, item) => item.to_address_hash?.bech32 || '',
        },
        {
          key: 'value',
          label: this.$t('ui.tx.value'),
          sortable: isSortable(this.id, 'value'),
          formatter: (value) => `${this.ConvertFromDecimals(value, this.WUSDDecimal, 4)} ${this.WUSDSymbol}`,
        },
        {
          key: 'gasUsed',
          label: this.$t('ui.tx.fee'),
          sortable: isSortable(this.id, 'gasUsed'),
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
        this.SaveToStorage(this.sessionKey, this.payload);
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
    this.updateFromSessionStorage();
    await this.getTransactions();
    sessionStorage.setItem('backRoute', this.$route.fullPath);
  },
  beforeDestroy() {
    this.$store.commit('blocks/resetBlockTransactions');
    this.$store.commit('tx/resetTxs');
    if (this.$route.name !== 'tx-id') {
      sessionStorage.removeItem('backRoute');
    }
    if (this.$route.name !== 'tx') {
      this.DeleteFromStorage(this.sessionKey);
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
      if (sortBy !== this.sortFieldForTable) {
        this.sortDirection = sortDirections.DESC;
      } else {
        this.sortDirection = this.sortDirection === sortDirections.ASC ? sortDirections.DESC : sortDirections.ASC;
      }
      this.sortField = sortTables[this.id][sortBy];
      if (sortBy) {
        this.SaveToStorage(this.sessionKey, this.payload);
        await this.getTransactions();
      }
    },
    updateFromSessionStorage() {
      if (this.IsStorageHaveKey(this.sessionKey)) {
        const payload = { ...this.GetFromStorage(this.sessionKey) };
        this.sortField = payload['sort[field]'];
        this.sortDirection = payload['sort[type]'];
      }
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
