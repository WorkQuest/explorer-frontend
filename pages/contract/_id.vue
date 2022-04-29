<template>
  <div class="contract">
    <div class="contract__header">
      <h4 class="contract__title">
        {{ $t('ui.token.contract') }}
      </h4>
      <p class="contract__contract">
        {{ address }}
        <button-copy
          :value="address"
          icon-color="primary"
        />
      </p>
    </div>
    <div class="contract__info">
      <overview />
      <more-info />
    </div>
    <div class="contract__tables tables">
      <div class="tables__menu">
        <span
          v-for="(tab, i) in tabs"
          :key="i"
          class="tables__tab"
          :class="{tables__tab_active: activeTab === tab}"
          :title="$t(`ui.contract.tabs.${tab}`)"
          @click="onClick(tab)"
        >{{ $t(`ui.contract.tabs.${tab}`) }}</span>
      </div>
      <div
        v-if="activeTab === allTxsId"
        :id="allTxsId"
        class="tables__txs"
      >
        <base-table
          id="contract-transactions-table"
          class="tables__table"
          :items="transactions"
          :fields="tableHeadersTxs"
          :table-busy="tableBusy"
          type="transactions"
          :skeleton="{rows: limit, columns: tableHeadersTxs.length}"
          :sort-by.sync="sortFieldForTable"
          :sort-desc.sync="isSortDesc"
          @table-sort="changeSortParams"
        />
        <paginator
          v-if="totalPages > 1"
          v-model="page"
          class="contract__pager"
          :total-pages="totalPages"
        />
      </div>
      <div
        v-if="activeTab === internalTxsId"
        :id="internalTxsId"
        class="tables__internal"
      >
        <base-table
          id="contract-internal-transactions-table"
          class="tables__table"
          :items="internalTransactions"
          :fields="tableHeadersInternal"
          :table-busy="tableBusy"
          type="transactions"
          :skeleton="{rows: limit, columns: tableHeadersInternal.length}"
          :sort-by.sync="sortFieldForTable"
          :sort-desc.sync="isSortDesc"
          @table-sort="changeSortParams"
        />
        <paginator
          v-if="totalPages > 1"
          v-model="page"
          class="contract__pager"
          :total-pages="totalPages"
        />
      </div>
      <div
        v-if="activeTab === tokensTxsId"
        :id="tokensTxsId"
        class="tables__erc"
      >
        <base-table
          class="tables__table"
          :items="transactionWithTokensList"
          :fields="tableHeadersERC"
          :table-busy="tableBusy"
          type="transactions"
          :skeleton="{rows: limit, columns: tableHeadersERC.length}"
          :sort-by.sync="sortFieldForTable"
          :sort-desc.sync="isSortDesc"
          @table-sort="changeSortParams"
        />
        <paginator
          v-if="totalPages > 1"
          v-model="page"
          class="contract__pager"
          :total-pages="totalPages"
        />
      </div>
      <div
        v-if="activeTab === 'contract'"
        id="contract"
        class="tables__contract"
      >
        <contract-info
          type="contract"
          :address="address"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { isAddress } from 'web3-utils';
import { isSortable, sortDirections, sortTables } from '~/utils';

export default {
  name: 'Contract',
  data() {
    return {
      activeTab: 'allTxs',
      page: 1,
      limit: 10,
      offset: 0,
      tabs: ['allTxs', 'internalTxs', 'tokensTxs', 'contract'],
      txs: [],
      tableBusy: false,
      allTxsId: 'allTxs',
      internalTxsId: 'internalTxs',
      tokensTxsId: 'tokensTxs',
      allTxsSortDirection: sortDirections.DESC,
      allTxsSortField: sortTables.transactions.blockNumber,
      internalTxsSortDirection: sortDirections.DESC,
      internalTxsSortField: sortTables.transfers.age,
      tokensTxsSortDirection: sortDirections.DESC,
      tokensTxsSortField: sortTables.transactions.age,
    };
  },
  computed: {
    ...mapGetters({
      WUSDSymbol: 'tokens/getWUSDTokenSymbol',
      WUSDDecimal: 'tokens/getWUSDTokenDecimals',
      transactions: 'account/getTransactions',
      transactionsCount: 'account/getTransactionsCount',
      internalTransactions: 'account/getInternalTransactions',
      internalTransactionsCount: 'account/getInternalTransactionsCount',
      transactionWithTokensList: 'account/getTransactionWithTokensList',
      transactionWithTokensListCount: 'account/getTransactionWithTokensListCount',
    }),
    totalPages() {
      if (this.activeTab === this.allTxsId) return this.setTotalPages(this.transactionsCount, this.limit);
      if (this.activeTab === this.internalTxsId) return this.setTotalPages(this.internalTransactionsCount, this.limit);
      if (this.activeTab === this.tokensTxsId) return this.setTotalPages(this.transactionWithTokensListCount, this.limit);
      return 1;
    },
    tableHeadersTxs() {
      return [
        {
          key: 'hash',
          label: this.$t('ui.tx.transaction'),
          sortable: isSortable('transactions', 'hash'),
        },
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
    tableHeadersInternal() {
      return [
        {
          key: 'blockNumber',
          label: this.$t('ui.block.blockNumber'),
          sortable: isSortable('transactions', 'blockNumber'),
          formatter: (value, key, item) => item.block_number,
        },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: isSortable('transactions', 'age'),
          formatter: (value, key, item) => this.formatDataFromNow(item.block.timestamp),
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
      ];
    },
    tableHeadersERC() {
      return [
        {
          key: 'hash',
          label: this.$t('ui.tx.transaction'),
          sortable: isSortable('transactions', 'hash'),
        },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: isSortable('transactions', 'age'),
          formatter: (value, key, item) => this.formatDataFromNow(item.block.timestamp),
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
          formatter: (value, key, item) => {
            const { decimals } = item.tokenTransfers[0].tokenContractAddress.token;
            const rawValue = item.value || '';
            return this.ConvertFromDecimals(rawValue, decimals);
          },
        },
        {
          key: 'token',
          label: this.$t('ui.token.token'),
          sortable: isSortable('transactions', 'token'),
          formatter: (value, key, item) => {
            const { name, symbol } = item.tokenTransfers[0]?.tokenContractAddress?.token || '';
            const link = item.tokenTransfers[0]?.tokenContractAddress?.hash?.bech32 || '';
            return {
              name,
              symbol,
              link,
            };
          },
        },
      ];
    },
    address() {
      return this.$route.params.id;
    },
    hash() {
      return this.$route.hash;
    },
    payload() {
      return {
        address: this.address,
        query: {
          limit: this.limit,
          offset: this.offset,
          'sort[field]': this[`${this.activeTab}SortField`],
          'sort[type]': this[`${this.activeTab}SortDirection`],
        },
      };
    },
    sortFieldForTable() {
      return this.GetSortKeyByValue('transactions', this[`${this.activeTab}SortField`]);
    },
    sortDirectionForTable() {
      return this[`${this.activeTab}SortDirection`].toLowerCase();
    },
    isSortDesc() {
      return this.sortDirectionForTable === 'desc';
    },
  },
  watch: {
    async page() {
      this.offset = (this.page - 1) * this.limit;
      await this.getPage();
    },
    async hash(current, previous) {
      if (current !== previous) {
        await this.hashNavigation();
      }
    },
  },
  async mounted() {
    await this.SetLoader(false);
    if (this.IsValidBech32Address(this.address) || isAddress(this.address)) {
      await this.getContractData();
      await this.hashNavigation();
    } else {
      await this.$router.push('/');
    }
  },
  methods: {
    onClick(tab) {
      this.activeTab = tab;
      this.page = 1;
      this.$router.push({ hash: `#${tab}` });
    },
    async getContractData() {
      this.tableBusy = true;
      await this.$store.dispatch('account/getAccountByAddress', { address: this.address, commonLimit: this.limit });
      this.tableBusy = false;
    },
    async getPage() {
      this.tableBusy = true;
      if (this.activeTab === this.allTxsId) {
        await this.$store.dispatch('account/getAccountTransactions', this.payload);
      }
      if (this.activeTab === this.internalTxsId) {
        await this.$store.dispatch('account/getAccountInternalTransactions', this.payload);
      }
      if (this.activeTab === this.tokensTxsId) {
        // TODO Уточнить у Ильи какой запрос возвращает пагинацию
        await this.$store.dispatch('account/getTransactionWithTokensList', this.payload);
      }
      this.tableBusy = false;
    },
    async hashNavigation() {
      if (this.hash) {
        await this.$router.push({ hash: this.hash });
        const replacedHash = this.hash ? this.hash.replace('#', '') : '';
        this.activeTab = this.tabs.includes(replacedHash) ? replacedHash : this.tabs[0];
      }
    },
    async changeSortParams(params, table) {
      const { sortBy, sortDesc } = params;
      if (sortBy !== this.sortFieldForTable) {
        this[`${this.activeTab}SortDirection`] = sortDirections.DESC;
      } else {
        this[`${this.activeTab}SortDirection`] = this[`${this.activeTab}SortDirection`] === sortDirections.ASC ? sortDirections.DESC : sortDirections.ASC;
      }
      this[`${this.activeTab}SortField`] = sortTables[table][sortBy];
      if (sortBy && table) {
        await this.getPage();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  &__copy {
    height: 35px;
    width: 35px;
    align-items: center;
    justify-items: center;
    border: 1px solid $black0;
    padding: 5px;
    border-radius: 6px;
    transition: .5s;

    &:hover {
      background: $black100;
    }
  }
}

.contract {
  animation: show 1s 1;
  @include container;

  &__search {
    margin: 25px 0;
  }

  &__header {
    display: flex;
    grid-gap: 10px;
    align-items: center;
    margin-bottom: 25px;
  }

  &__info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 25px;
    margin-bottom: 25px;
    border-radius: 6px;
  }

  &__title, &__contract {
    margin-bottom: 0;
  }
}

.tables {
  border-radius: 6px;
  min-height: 450px;

  &__menu {
    padding: 20px;
    background: $white;
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
  }

  &__tab {
    @include text-simple;
    margin-right: 20px;
    padding-bottom: 12px;
    color: $black500;
    cursor: pointer;

    &_active {
      @include text-simple;
      border-bottom: 2px solid $blue;
    }
  }

  &__transaction {
    display: none;
  }

  &__contract {
    background-color: $white;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
}

.icon-copy {
  color: $blue;
  font-size: 20px;
  cursor: pointer;
}

@include _767 {
  .contract {
    &__header {
      display: grid;
      margin: 0 0 25px 15px;
    }

    &__contract {
      word-wrap: break-word;
      max-width: 700px;
    }

    &__info {
      grid-template-columns: 1fr;
      grid-gap: 0;
    }
  }
  .tables {
    &__menu {
      margin: 0;
      display: flex;
      gap: 5px;
      flex-wrap: wrap;
    }

    &__tab {
      margin-right: 3px;
      word-spacing: unset;
      max-width: 25%;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 16px;
      word-break: unset;
      white-space: nowrap;
    }
  }
}

@include _575 {
  .contract {
    &__contract {
      max-width: 500px;
    }
  }
}

@include _480 {
  .contract {
    &__contract {
      max-width: 450px;
    }
  }
}

@include _380 {
  .contract {
    &__contract {
      max-width: 300px;
    }
  }
}
</style>
