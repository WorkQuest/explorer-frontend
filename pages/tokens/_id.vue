<template>
  <div
    v-if="!isLoading && Object.keys(token).length > 0"
    class="token"
  >
    <search-filter class="token__search" />

    <div class="token__header">
      <img
        :src="require(`~/assets/img/tokens/empty-token.svg`)"
        width="30"
        class="token__image"
        :alt="token.name"
      >
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
          id="tokens-transfers-table"
          class="tables__table"
          :items="tokenTransfers"
          :fields="tableHeadersTransfers"
          :table-busy="tableBusy"
          type="transfers"
          :skeleton="{rows: limit, columns: tableHeadersTransfers.length}"
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
          id="tokens-holders-table"
          class="tables__table"
          :items="tokenHolders"
          :fields="tableHeadersHolders"
          type="holders"
          :table-busy="tableBusy"
          :skeleton="{rows: limit, columns: tableHeadersHolders.length}"
        />
        <paginator
          v-if="totalPagesValue > 1"
          v-model="page"
          class="token__pager"
          :total-pages="totalPagesValue"
        />
      </div>
      <!--      TODO update when server response changes    -->
      <div
        v-if="activeTab === 'info'"
        id="info"
        class="tables__info token-info"
      >
        <p class="token-info__title">
          {{ $t('ui.token.overview') }}
        </p>
        <p class="token-info__description">
          {{ $t('ui.token.tether') }}
        </p>
        <p class="token-info__title">
          {{ $t('ui.token.market') }}
        </p>
        <p class="token-info__description">
          <span class="token-info__subtitle">{{ $t('ui.token.volume') }}</span>
          $ 44 215 188 907,00
        </p>
        <p class="token-info__description">
          <span class="token-info__subtitle">{{ $t('ui.token.capitalization') }}</span>
          $ 62 059 827 982,00
        </p>
        <p class="token-info__description">
          <span class="token-info__subtitle">{{ $t('ui.token.supply') }}</span>
          61 992 333 258.00 USDT
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
      tabs: ['transfers', 'holders', 'info', 'contract'],
      tableBusy: false,
    };
  },
  computed: {
    ...mapGetters({
      token: 'tokens/getCurrentToken',
      tokenTransfers: 'tokens/getCurrentTokenTransfers',
      tokenTransfersCount: 'tokens/getCurrentTokenTransfersCount',
      tokenHolders: 'tokens/getCurrentTokenHolders',
      tokenHoldersCount: 'tokens/getCurrentTokenHoldersCount',
      isLoading: 'main/getIsLoading',
    }),
    address() {
      return this.$route.params.id;
    },
    totalPagesValue() {
      if (this.activeTab === 'transfers') return this.setTotalPages(this.tokenTransfersCount, this.limit);
      if (this.activeTab === 'holders') return this.setTotalPages(this.tokenHoldersCount, this.limit);
      return 1;
    },
    payload() {
      return {
        address: this.address,
        limit: this.limit,
        offset: this.offset,
      };
    },
    tableHeadersTransfers() {
      return [
        {
          key: 'hash',
          label: this.$t('ui.tx.transaction'),
          sortable: true,
          formatter: (value, key, item) => item.transaction_hash,
        },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: true,
          formatter: (value, key, item) => this.formatDataFromNow(item.block.timestamp),
        },
        {
          key: 'method',
          label: this.$t('ui.token.method'),
          sortable: true,
          formatter: () => this.$t('ui.token.transfer'),
        },
        {
          key: 'addressFrom',
          label: this.$t('ui.tx.from'),
          sortable: true,
          formatter: (value, key, item) => item.from_address_hash.bech32,
        },
        {
          key: 'addressTo',
          label: this.$t('ui.tx.to'),
          sortable: true,
          formatter: (value, key, item) => item.to_address_hash.bech32,
        },
        {
          key: 'amount',
          label: this.$t('ui.token.quantity'),
          sortable: true,
          formatter: (value, key, item) => this.ConvertFromDecimals(item.amount, this.token.decimals),
        },
      ];
    },
    tableHeadersHolders() {
      return [
        {
          key: 'index',
          label: this.$t('ui.token.rank'),
          sortable: true,
          formatter: () => this.offset + 1,
        },
        {
          key: 'address',
          label: this.$t('ui.token.address'),
          sortable: true,
          formatter: (value, key, item) => item.address_hash.bech32,
        },
        {
          key: 'value',
          label: this.$t('ui.token.quantity'),
          sortable: true,
          formatter: (value) => this.NumberFormat(this.ConvertFromDecimals(value, this.token.decimals), 4),
        },
        {
          key: 'percentage',
          label: this.$t('ui.token.percentage'),
          sortable: true,
          formatter: (
            (value, key, item) => new BigNumber(item.value)
              .dividedBy(this.token.total_supply)
              .multipliedBy(100)
              .decimalPlaces(4)
          ),
        },
        { key: 'value', label: this.$t('ui.tx.value'), sortable: true },
      ];
    },
    hash() {
      return this.$route.hash;
    },
  },
  watch: {
    async page() {
      this.offset = (this.page - 1) * this.limit;

      if (this.activeTab === 'transfers') {
        this.tableBusy = true;
        await this.$store.dispatch('tokens/getTokenTransfers', this.payload);
        this.tableBusy = false;
      }

      if (this.activeTab === 'holders') {
        this.tableBusy = true;
        await this.$store.dispatch('tokens/getTokenHolders', this.payload);
        this.tableBusy = false;
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
