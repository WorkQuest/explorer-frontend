<template>
  <div class="token">
    <div class="token__header">
      <token-image
        :link="iconUrl"
        :symbol="symbol"
        size="big"
      />
      <h4 class="token__title">
        {{ $t('ui.token.token') }}
      </h4>
      <p class="token__token">
        {{ token.name }}
      </p>
    </div>

    <div class="token__info">
      <overview :address="address" />
      <more-info :address="address" />
    </div>

    <div class="token__tables tables">
      <div class="tables__menu">
        <span
          v-for="(tab, index) in tabs"
          :key="index"
          class="tables__tab"
          :class="{tables__tab_active: activeTab === tab}"
          @click="onClick(tab)"
        >{{ $t(`ui.token.${tab}`) }}</span>
      </div>

      <div
        v-if="activeTab === 'transfers'"
        id="transfers"
        class="tables__tf"
      >
        <base-table
          :id="`tokens-${transfersId}-table`"
          class="tables__table"
          :items="tokenTransfers"
          :fields="tableHeadersTransfers"
          :table-busy="tableBusy"
          :type="transfersId"
          :skeleton="{rows: limit, columns: tableHeadersTransfers.length}"
          :sort-by.sync="sortFieldForTable"
          :sort-desc.sync="isSortDesc"
          @table-sort="changeSortParams"
        />
        <paginator
          v-if="totalPagesValue > 1"
          v-model="page"
          class="token__pager"
          :total-pages="totalPagesValue"
        />
      </div>

      <div
        v-if="activeTab === 'holders'"
        id="holders"
        class="tables__holders"
      >
        <base-table
          :id="`tokens-${holdersId}-table`"
          class="tables__table"
          :items="tokenHolders"
          :fields="tableHeadersHolders"
          :type="holdersId"
          :table-busy="tableBusy"
          :skeleton="{rows: limit, columns: tableHeadersHolders.length}"
          :sort-by.sync="sortFieldForTable"
          :sort-desc.sync="isSortDesc"
          @table-sort="changeSortParams"
        />
        <paginator
          v-if="totalPagesValue > 1"
          v-model="page"
          class="token__pager"
          :total-pages="totalPagesValue"
        />
      </div>

      <div
        v-if="activeTab === 'info'"
        id="info"
        class="tables__info token-info"
      >
        <p class="token-info__title">
          {{ $t('ui.token.overview') }}
        </p>
        <p class="token-info__description">
          {{ description }}
        </p>
        <p class="token-info__title">
          {{ $t('ui.token.market') }}
        </p>
        <p class="token-info__description">
          <span class="token-info__subtitle">{{ $t('ui.token.volume') }}</span>
          $ {{ volume }}
        </p>
        <p class="token-info__description">
          <span class="token-info__subtitle">{{ $t('ui.token.capitalization') }}</span>
          $ {{ capitalization }}
        </p>
        <p class="token-info__description">
          <span class="token-info__subtitle">{{ $t('ui.token.supply') }}</span>
          {{ circulatingSupply }} {{ token.symbol }}
        </p>
      </div>

      <div
        v-if="activeTab === 'contract'"
        id="contract"
        class="tables__contract contract"
      >
        <contract-info
          type="token"
          :address="address"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import { isAddress } from 'web3-utils';
import { isSortable, sortDirections, sortTables } from '~/utils';

export default {
  name: 'Token',
  data() {
    return {
      params: '',
      activeTab: 'transfers',
      activePoint: [],
      search: '',
      page: 1,
      limit: 10,
      offset: 0,
      tableBusy: false,
      transfersSortDirection: sortDirections.DESC,
      transfersSortField: sortTables.transfers.age,
      holdersSortDirection: sortDirections.DESC,
      holdersSortField: sortTables.holders.value,
      transfersId: 'transfers',
      holdersId: 'holders',
    };
  },
  computed: {
    ...mapGetters({
      accountInfo: 'account/getAccountInfo',
      token: 'tokens/getCurrentToken',
      tokenTransfers: 'tokens/getCurrentTokenTransfers',
      tokenTransfersCount: 'tokens/getCurrentTokenTransfersCount',
      tokenHolders: 'tokens/getCurrentTokenHolders',
      tokenHoldersCount: 'tokens/getCurrentTokenHoldersCount',
      getTokenPrice: 'tokens/getTokenPrice',
    }),
    tabs() {
      return [
        'transfers',
        'holders',
        'info',
        ...(this.showContractInfo ? ['contract'] : []),
      ];
    },
    address() {
      return this.$route.params.id;
    },
    totalPagesValue() {
      if (this.activeTab === this.transfersId) return this.setTotalPages(this.tokenTransfersCount, this.limit);
      if (this.activeTab === this.holdersId) return this.setTotalPages(this.tokenHoldersCount, this.limit);
      return 1;
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
      return this.GetSortKeyByValue(this.activeTab, this[`${this.activeTab}SortField`]);
    },
    sortDirectionForTable() {
      return this[`${this.activeTab}SortDirection`].toLowerCase();
    },
    isSortDesc() {
      return this.sortDirectionForTable === 'desc';
    },
    tableHeadersTransfers() {
      return [
        {
          key: 'hash',
          label: this.$t('ui.tx.transaction'),
          sortable: isSortable(this.transfersId, 'hash'),
          formatter: (value, key, item) => item.transaction_hash,
        },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: isSortable(this.transfersId, 'age'),
          formatter: (value, key, item) => this.formatDataFromNow(item.block.timestamp),
        },
        {
          key: 'method',
          label: this.$t('ui.token.method'),
          sortable: isSortable(this.transfersId, 'method'),
          formatter: () => this.$t('ui.token.transfer'),
        },
        {
          key: 'addressFrom',
          label: this.$t('ui.tx.from'),
          sortable: isSortable(this.transfersId, 'addressFrom'),
          formatter: (value, key, item) => item.from_address_hash.bech32,
        },
        {
          key: 'addressTo',
          label: this.$t('ui.tx.to'),
          sortable: isSortable(this.transfersId, 'addressTo'),
          formatter: (value, key, item) => item.to_address_hash.bech32,
        },
        {
          key: 'amount',
          label: this.$t('ui.token.quantity'),
          sortable: isSortable(this.transfersId, 'amount'),
          formatter: (value, key, item) => this.ConvertFromDecimals(item.amount, this.token.decimals, 4),
        },
      ];
    },
    tableHeadersHolders() {
      return [
        {
          key: 'index',
          label: this.$t('ui.token.rank'),
          sortable: isSortable(this.holdersId, 'index'),
          formatter: () => this.offset + 1,
        },
        {
          key: 'address',
          label: this.$t('ui.token.address'),
          sortable: isSortable(this.holdersId, 'address'),
          formatter: (value, key, item) => item.address_hash.bech32,
        },
        {
          key: 'quantity',
          label: this.$t('ui.token.quantity'),
          sortable: isSortable(this.holdersId, 'quantity'),
          formatter: (value, key, item) => this.NumberFormat(new BigNumber(item.value).shiftedBy(-this.token.decimals).dp(0, 1)),
        },
        {
          key: 'percentage',
          label: this.$t('ui.token.percentage'),
          sortable: isSortable(this.holdersId, 'percentage'),
          formatter: (
            (value, key, item) => new BigNumber(item.value)
              .dividedBy(this.token.total_supply)
              .multipliedBy(100)
              .decimalPlaces(4)
          ),
        },
        {
          key: 'value',
          label: this.$t('ui.tx.value'),
          sortable: isSortable(this.holdersId, 'value'),
          formatter: (value, key, item) => {
            const price = new BigNumber(this.tokenPrice).shiftedBy(-this.token.decimals);
            const valueFromBN = new BigNumber(item.value).shiftedBy(-this.token.decimals);
            return `$${this.NumberFormat(price.multipliedBy(valueFromBN).decimalPlaces(2))}`;
          },
        },
      ];
    },
    hash() {
      return this.$route.hash;
    },
    tokenPrice() {
      const price = this.getTokenPrice(this.token.symbol) || 0;
      return new BigNumber(price).toString();
    },
    volume() {
      const price = new BigNumber(this.tokenPrice || 0).shiftedBy(-this.token?.decimals || 0);
      const valueFromBN = new BigNumber(this.token?.volume || 0).shiftedBy(-this.token?.decimals || 0);
      return this.NumberFormat(price.multipliedBy(valueFromBN).dp(2, 1));
    },
    circulatingSupply() {
      return this.NumberFormat(new BigNumber(this.token.circulatingSupply).shiftedBy(-this.token.decimals).toString());
    },
    capitalization() {
      const price = new BigNumber(this.tokenPrice).shiftedBy(-this.token.decimals);
      const valueFromBN = new BigNumber(this.token.circulatingSupply).shiftedBy(-this.token.decimals);
      return this.NumberFormat(price.multipliedBy(valueFromBN).decimalPlaces(2).toString());
    },
    description() {
      return this.token.metadata?.description || '';
    },
    iconUrl() {
      return this.token.metadata?.iconUrl || '';
    },
    symbol() {
      return this.token?.symbol || '';
    },
    showContractInfo() {
      return this.accountInfo?.smartContract;
    },
  },
  watch: {
    async page() {
      this.offset = (this.page - 1) * this.limit;
      if (this.activeTab === this.transfersId) {
        await this.getTokensTransfers();
      }
      if (this.activeTab === this.holdersId) {
        await this.getTokensHolders();
      }
    },
    async hash(current, previous) {
      if (current !== previous) {
        await this.hashNavigation();
      }
    },
  },
  async mounted() {
    if (this.IsValidBech32Address(this.address) || isAddress(this.address)) {
      await this.getTokenData();
      await this.hashNavigation();
    } else {
      await this.$router.push('/');
    }
  },
  beforeDestroy() {
    this.$store.commit('tokens/resetCurrentToken');
  },
  methods: {
    onClick(tab) {
      this.activeTab = tab;
      this.page = 1;
      this.$router.push({ hash: `#${tab}` });
    },
    async getTokensTransfers() {
      this.tableBusy = true;
      await this.$store.dispatch('tokens/getTokenTransfers', this.payload);
      this.tableBusy = false;
    },
    async getTokensHolders() {
      this.tableBusy = true;
      await this.$store.dispatch('tokens/getTokenHolders', this.payload);
      this.tableBusy = false;
    },
    async getTokenData() {
      await this.SetLoader(true);
      await this.$store.dispatch('tokens/getToken', { address: this.address, commonLimit: this.limit });
      await this.$store.dispatch('account/getAccountByAddress', { address: this.address, commonLimit: this.limit });
      await this.SetLoader(false);
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
      if (sortBy && table === this.transfersId) {
        await this.getTokensTransfers();
      }
      if (sortBy && table === this.holdersId) {
        await this.getTokensHolders();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.token {
  animation: show 1s 1;
  @include container;

  &__search {
    margin: 25px 0;
  }

  &__header {
    display: flex;
    grid-gap: 10px;
    align-items: flex-end;
    margin-bottom: 25px;
  }

  &__title {
    @include text-simple;
    @include normal-font-size;
    font-weight: 600;
    font-size: 28px;
    margin-bottom: 0;
    line-height: 100%;
  }

  &__info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 25px;
    margin-bottom: 25px;
  }

  &__image {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    overflow: hidden;
    object-fit: cover;
  }

  &__token {
    margin-bottom: 2px;
    line-height: 100%;
  }
}

.tables {
  border-radius: 6px;
  display: flex;
  flex-direction: column;

  &__menu {
    display: flex;
    flex-wrap: wrap;
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

  &__item {
    display: none;
  }

  &__table {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
}

.token-info {
  padding: 0 20px 20px 20px;
  background-color: $white;

  &__title {
    @include text-simple;
    @include normal-font-size;
    font-weight: 600;
    font-size: 18px;
    margin: 10px 0;
  }

  &__subtitle {
    @include text-simple;
    @include normal-font-size;
    font-weight: 500;
  }

  &__description {
    @include text-simple;
    @include normal-font-size;
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
  }
}

.tables__contract {
  background-color: $white;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
}

@include _767 {
  .token {
    &__info {
      grid-template-columns: 1fr;
      grid-gap: 0;
    }

    &__header {
      margin: 0 0 25px 16px;
    }
  }

  .tables {
    &__tab {
      margin-right: 10px;
    }

    &__menu {
      padding: 20px;
    }

    &__item {
      display: block;
    }
  }
  .contract {
    &__submit {
      margin: 20px 0;
    }
  }
}
</style>
