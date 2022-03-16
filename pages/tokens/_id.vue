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
        class="tables__tf"
      >
        <table-txs
          class="tables__table"
          :is-only="false"
          :items="tokenTransfers"
          :fields="tableHeadersTransfers"
        />
        <transaction
          v-for="(item, i) in tokenTransfers"
          :key="i"
          class="tables__item"
          :transaction="item"
          :is-last="tokenTransfers[i] === tokenTransfers[tokenTransfers.length - 1]"
        />
        <base-pager
          v-if="totalPagesValue > 1"
          v-model="page"
          class="token__pager"
          :total-pages="totalPagesValue"
        />
      </div>

      <div
        v-if="activeTab === 'holders'"
        class="tables__holders"
      >
        <table-tokens
          class="tables__table"
          :is-only="false"
          :items="tokenHolders"
          :fields="tableHeadersHolders"
        />
        <holder
          v-for="(item, i) in tokenHolders"
          :key="i"
          class="tables__item"
          :holder="item"
          :is-last="tokenHolders[i] === tokenHolders[tokenHolders.length - 1]"
        />
        <base-pager
          v-if="totalPagesValue > 1"
          v-model="page"
          class="token__pager"
          :total-pages="totalPagesValue"
        />
      </div>
      <!--      TODO update when server response changes    -->
      <div
        v-if="activeTab === 'info'"
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
        class="tables__contract contract"
      >
        <div class="contract__wrap">
          <p
            class="name"
            @click="onClickContract('name')"
          >
            1. {{ $t('ui.token.name') }}
            <span
              v-if="activePoint.includes('name')"
              class="icon-chevron_up"
            />
            <span
              v-else
              class="icon-chevron_down"
            />
          </p>
          <p
            v-if="activePoint.includes('name')"
            class="contract__description"
          >
            some description
          </p>
        </div>
        <div class="contract__wrap">
          <p
            class="deprecated"
            @click="onClickContract('deprecated')"
          >
            2. {{ $t('ui.token.deprecated') }}
            <span
              v-if="activePoint.includes('deprecated')"
              class="icon-chevron_up"
            />
            <span
              v-else
              class="icon-chevron_down"
            />
          </p>
          <p
            v-if="activePoint.includes('deprecated')"
            class="contract__description"
          >
            False
            <span class="contract__note">bool</span>
          </p>
        </div>
        <div class="contract__wrap">
          <p
            class="balances"
            @click="onClickContract('balances')"
          >
            3. {{ $t('ui.token.balances') }}
            <span
              v-if="activePoint.includes('balances')"
              class="icon-chevron_up"
            />
            <span
              v-else
              class="icon-chevron_down"
            />
          </p>
          <div
            v-if="activePoint.includes('balances')"
            class="contract__description"
          >
            <!-- validation observer -->
            <base-field
              v-model="address"
              :placeholder="$tc('ui.token.input')"
              :label="$tc('ui.token.input')"
              :is-hide-error="true"
              mode="white"
              labelcolor="black"
            />
            <base-btn
              class="contract__submit"
              mode="borderless-left"
              :text="$tc('ui.token.query')"
            />
            <!-- /validation observer -->
            <span class="contract__note">uint256</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';

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
      if (this.activeTab === 'transfers') return this.setTotalPages(this.tokenTransfersCount, 20);
      if (this.activeTab === 'holders') return this.setTotalPages(this.tokenHoldersCount, 20);
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
        { key: 'hash', label: this.$t('ui.tx.transaction'), sortable: true },
        { key: 'method', label: this.$t('ui.token.method'), sortable: true },
        { key: 'age', label: this.$t('ui.block.age'), sortable: true },
        { key: 'from_address_hash.hex', label: this.$t('ui.tx.from'), sortable: true },
        { key: 'to_address_hash.hex', label: this.$t('ui.tx.to'), sortable: true },
        { key: 'amount', label: this.$t('ui.token.quantity'), sortable: true },
      ];
    },
    tableHeadersHolders() {
      return [
        'rank',
        { key: 'address_hash.hex', label: this.$t('ui.token.address'), sortable: true },
        {
          key: 'value',
          label: this.$t('ui.token.quantity'),
          sortable: true,
          formatter: (value) => this.NumberFormat(this.ConvertFromDecimals(value, this.token.decimals)),
        },
        {
          key: 'percentage',
          label: this.$t('ui.token.percentage'),
          sortable: true,
          formatter: (
            (value, key, item) => new BigNumber(item.value).dividedBy(this.token.total_supply).multipliedBy(100).decimalPlaces(4)
          ),
        },
        { key: 'value', label: this.$t('ui.tx.value'), sortable: true },
      ];
    },
  },
  watch: {
    async page() {
      this.offset = (this.page - 1) * this.limit;

      if (this.activeTab === 'transfers') {
        await this.$store.dispatch('tokens/getTokenTransfers', this.payload);
      }

      if (this.activeTab === 'holders') {
        await this.$store.dispatch('tokens/getTokenHolders', this.payload);
      }
    },
  },
  async mounted() {
    await this.SetLoader(true);
    await this.$store.dispatch('tokens/getToken', { address: this.address, commonLimit: this.limit });
    await this.SetLoader(false);
  },
  beforeDestroy() {
    this.$store.commit('tokens/resetCurrentToken');
  },
  methods: {
    onClick(tab) {
      this.activeTab = tab;
      this.page = 1;
    },
    onClickContract(elem) {
      if (this.activePoint.includes(elem)) {
        const index = this.activePoint.indexOf(elem);
        this.activePoint.splice(index, 1);
      } else {
        this.activePoint.push(elem);
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
  background: $white;
  border-radius: 6px;
  padding-top: 20px;

  &__menu {
    margin: 0 0 27px 20px
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
  padding: 0 0 10px 20px;

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

.contract {
  padding: 0 20px 20px 20px;
  display: grid;
  grid-gap: 15px;

  &__wrap {
    background: $black0;
    border-radius: 5px;
    padding: 20px;
  }

  &__description {
    margin-top: 20px;
  }

  &__note {
    color: $black500;
  }

  &__submit {
    width: 120px;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
}

.name, .deprecated, .balances {
  cursor: pointer;
}

.icon-chevron_up::before, .icon-chevron_down::before {
  color: $blue;
  float: right;
}

@include _767 {
  .token {
    &__info {
      grid-template-columns: 1fr;
      grid-gap: 0;
    }

    &__pager {
      margin: 16px;
    }

    &__header {
      margin: 0 0 25px 16px;
    }
  }
  .table {
    display: none;
  }
  .tables {
    padding: 16px;

    &__menu {
      margin: 0 0 15px 0;
    }

    &__info, &__contract {
      padding: 0;
      margin-top: 30px;
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
