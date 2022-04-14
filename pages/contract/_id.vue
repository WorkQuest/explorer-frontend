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
          :title="$t(`ui.token.${tab}`)"
          @click="onClick(tab)"
        >{{ $t(`ui.token.${tab}`) }}</span>
      </div>
      <div
        v-if="activeTab === 'txs'"
        id="txs"
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
        />
        <paginator
          v-if="totalPages > 1"
          v-model="page"
          class="contract__pager"
          :total-pages="totalPages"
        />
      </div>
      <div
        v-if="activeTab === 'internal'"
        id="internal"
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
        />
        <paginator
          v-if="totalPages > 1"
          v-model="page"
          class="contract__pager"
          :total-pages="totalPages"
        />
      </div>
      <div
        v-if="activeTab === 'tokensTxns'"
        id="tokensTxns"
        class="tables__erc"
      >
        <base-table
          class="tables__table"
          :items="transactionWithTokensList"
          :fields="tableHeadersERC"
          :table-busy="tableBusy"
          type="transactions"
          :skeleton="{rows: limit, columns: tableHeadersERC.length}"
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

export default {
  name: 'Contract',
  data() {
    return {
      activeTab: 'txs',
      page: 1,
      limit: 10,
      offset: 0,
      tabs: ['txs', 'internal', 'tokensTxns', 'contract'],
      txs: [],
      tableBusy: false,
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
      if (this.activeTab === 'txs') return this.setTotalPages(this.transactionsCount, this.limit);
      if (this.activeTab === 'internal') return this.setTotalPages(this.internalTransactionsCount, this.limit);
      if (this.activeTab === 'tokensTxns') return this.setTotalPages(this.transactionWithTokensListCount, this.limit);
      return 1;
    },
    tableHeadersTxs() {
      return [
        { key: 'hash', label: this.$t('ui.tx.transaction'), sortable: true },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: true,
          formatter: (value, key, item) => this.formatDataFromNow(item.block.timestamp),
        },
        {
          key: 'blockNumber',
          label: this.$t('ui.block.blockNumber'),
          sortable: true,
          formatter: (value, key, item) => item.block_number,
        },
        {
          key: 'addressFrom',
          label: this.$t('ui.tx.from'),
          sortable: true,
          formatter: (value, key, item) => item.from_address_hash?.hex || '',
        },
        {
          key: 'addressTo',
          label: this.$t('ui.tx.to'),
          sortable: true,
          formatter: (value, key, item) => item.to_address_hash?.hex || '',
        },
        {
          key: 'value',
          label: this.$t('ui.tx.value'),
          sortable: true,
          formatter: (value) => `${this.ConvertFromDecimals(value, this.WUSDDecimal, 4)} ${this.WUSDSymbol}`,
        },
        {
          key: 'gasUsed',
          label: this.$t('ui.tx.fee'),
          sortable: true,
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
          sortable: true,
          formatter: (value, key, item) => item.block_number,
        },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: true,
          formatter: (value, key, item) => this.formatDataFromNow(item.block.timestamp),
        },
        {
          key: 'addressFrom',
          label: this.$t('ui.tx.from'),
          sortable: true,
          formatter: (value, key, item) => item.from_address_hash?.hex || '',
        },
        {
          key: 'addressTo',
          label: this.$t('ui.tx.to'),
          sortable: true,
          formatter: (value, key, item) => item.to_address_hash?.hex || '',
        },
        {
          key: 'value',
          label: this.$t('ui.tx.value'),
          sortable: true,
          formatter: (value) => `${this.ConvertFromDecimals(value, this.WUSDDecimal, 4)} ${this.WUSDSymbol}`,
        },
      ];
    },
    tableHeadersERC() {
      return [
        { key: 'hash', label: this.$t('ui.tx.transaction'), sortable: true },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: true,
          formatter: (value, key, item) => this.formatDataFromNow(item.block.timestamp),
        },
        {
          key: 'addressFrom',
          label: this.$t('ui.tx.from'),
          sortable: true,
          formatter: (value, key, item) => item.from_address_hash?.hex || '',
        },
        {
          key: 'addressTo',
          label: this.$t('ui.tx.to'),
          sortable: true,
          formatter: (value, key, item) => item.to_address_hash?.hex || '',
        },
        {
          key: 'value',
          label: this.$t('ui.tx.value'),
          sortable: true,
          formatter: (value, key, item) => {
            const { decimals } = item.tokenTransfers[0].tokenContractAddress.token;
            const rawValue = item.value || '';
            return this.ConvertFromDecimals(rawValue, decimals);
          },
        },
        {
          key: 'token',
          label: this.$t('ui.token.token'),
          sortable: true,
          formatter: (value, key, item) => {
            const { name, symbol } = item.tokenTransfers[0]?.tokenContractAddress?.token || '';
            const link = item.tokenTransfers[0]?.tokenContractAddress?.hash?.hex || '';
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
    if (isAddress(this.address)) {
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
      const { address, limit, offset } = this;
      this.tableBusy = true;
      if (this.activeTab === 'txs') {
        await this.$store.dispatch('account/getAccountTransactions', { address, limit, offset });
      }
      if (this.activeTab === 'internal') {
        await this.$store.dispatch('account/getAccountInternalTransactions', { address, limit, offset });
      }
      if (this.activeTab === 'tokensTxns') {
        await this.$store.dispatch('account/getTransactionWithTokensList', { address, limit, offset });
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
