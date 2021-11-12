<template>
  <div
    v-if="params"
    class="token"
  >
    <search-filter class="token__search" />
    <div class="token__header">
      <img
        v-if="params"
        :src="require(`~/assets/img/tokens/${params}.svg`)"
        width="30"
        class="token__image"
      >
      <h4 class="token__title">
        {{ $t('ui.token.token') }}
      </h4>
      <p
        class="token__token"
      >
        {{ tokens[`${params}`].name }}
      </p>
    </div>
    <div class="token__info">
      <Overview :token="params" />
      <MoreInfo :token="params" />
    </div>
    <div class="token__tables tables">
      <div class="tables__menu">
        <span
          class="tables__tab_transfers"
          :class="{tables__tab_active: activeTab === 'tables__tab_transfers'}"
          @click="onClick"
        >{{ $t('ui.token.transfers') }}</span>
        <span
          class="tables__tab_holders"
          :class="{tables__tab_active: activeTab === 'tables__tab_holders'}"
          @click="onClick"
        >{{ $t('ui.token.holders') }}</span>
        <span
          class="tables__tab_info"
          :class="{tables__tab_active: activeTab === 'tables__tab_info'}"
          @click="onClick"
        >{{ $t('ui.token.info') }}</span>
        <span
          class="tables__tab_contract"
          :class="{tables__tab_active: activeTab === 'tables__tab_contract'}"
          @click="onClick"
        >{{ $t('ui.token.contract') }}</span>
      </div>
      <div
        v-if="activeTab === 'tables__tab_transfers'"
        class="tables__tf"
      >
        <TableTxs
          class="tables__table"
          :is-only="false"
          :items="transfers"
          :fields="[
            {
              key: 'id', label: this.$t('ui.tx.transaction'), sortable: true,
            },
            {
              key: 'method', label: this.$t('ui.token.method'), sortable: true,
            },
            {
              key: 'timestamp', label: this.$t('ui.block.age'), sortable: true,
            },
            {
              key: 'fromAddress', label: this.$t('ui.tx.from'), sortable: true,
            },
            {
              key: 'toAddress', label: this.$t('ui.tx.to'), sortable: true,
            },
            {
              key: 'quantity', label: this.$t('ui.token.quantity'), sortable: true,
            },
          ]"
        />
        <base-pager
          v-if="totalPagesValue > 1"
          v-model="currentPage"
          :total-pages="totalPagesValue"
        />
      </div>
      <div
        v-if="activeTab === 'tables__tab_holders'"
        class="tables__holders"
      >
        <TableTokens
          class="tables__table"
          :is-only="false"
          :items="holders"
          :fields="[
            {
              key: 'id', label: this.$t('ui.token.rank'), sortable: true,
            },
            {
              key: 'address', label: this.$t('ui.token.address'), sortable: true,
            },
            {
              key: 'quantity', label: this.$t('ui.token.quantity'), sortable: true,
            },
            {
              key: 'percentage', label: this.$t('ui.token.percentage'), sortable: true,
            },
            {
              key: 'value', label: this.$t('ui.tx.value'), sortable: true,
            },
          ]"
        />
        <base-pager
          v-if="totalPagesValue > 1"
          v-model="currentPage"
          :total-pages="totalPagesValue"
        />
      </div>
      <div
        v-if="activeTab === 'tables__tab_info'"
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
          <span class="token-info__subtitle">
            {{ $t('ui.token.volume') }}
          </span>
          $ 44 215 188 907,00
        </p>
        <p class="token-info__description">
          <span class="token-info__subtitle">
            {{ $t('ui.token.capitalization') }}
          </span>
          $ 62 059 827 982,00
        </p>
        <p class="token-info__description">
          <span class="token-info__subtitle">
            {{ $t('ui.token.supply') }}
          </span>
          61 992 333 258.00 USDT
        </p>
      </div>
      <div
        v-if="activeTab === 'tables__tab_contract'"
        class="tables__contract contract"
      >
        <div class="contract__wrap">
          <p
            class="name"
            @click="onClickContract"
          >
            1. {{ $t('ui.token.name') }}
            <span
              v-if="activePoint === 'name'"
              class="icon-chevron_up"
            />
            <span
              v-else
              class="icon-chevron_down"
            />
          </p>
          <p
            v-if="activePoint === 'name'"
            class="contract__description"
          >
            some description
          </p>
        </div>
        <div class="contract__wrap">
          <p
            class="deprecated"
            @click="onClickContract"
          >
            2. {{ $t('ui.token.deprecated') }}
            <span
              v-if="activePoint === 'deprecated'"
              class="icon-chevron_up"
            />
            <span
              v-else
              class="icon-chevron_down"
            />
          </p>
          <p
            v-if="activePoint === 'deprecated'"
            class="contract__description"
          >
            False
            <span class="contract__note">bool</span>
          </p>
        </div>
        <div class="contract__wrap">
          <p
            class="balances"
            @click="onClickContract"
          >
            3. {{ $t('ui.token.balances') }}
            <span
              v-if="activePoint === 'balances'"
              class="icon-chevron_up"
            />
            <span
              v-else
              class="icon-chevron_down"
            />
          </p>
          <div
            v-if="activePoint === 'balances'"
            class="contract__description"
          >
            <!-- validation observer -->
            <base-field
              v-model="address"
              :placeholder="$t('ui.token.input')"
              :label="$t('ui.token.input')"
              rules="required"
              mode="white"
              labelcolor="black"
            />
            <base-btn
              class="contract__submit"
              mode="borderless-left"
              :text="$t('ui.token.query')"
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
import TableTxs from '~/components/TableTxs/index.vue';
import TableTokens from '~/components/TableTokens/index.vue';
import Overview from '~/components/Overview.vue';
import MoreInfo from '~/components/MoreInfo.vue';

export default {
  name: 'Token',
  components: {
    Overview,
    MoreInfo,
    TableTxs,
    TableTokens,
  },
  data: () => ({
    params: '',
    address: '',
    activeTab: 'tables__tab_transfers',
    activePoint: '',
    currentPage: 1,
    tokens: {
      USDT: {
        name: 'Tether USD',
        description: 'Tether gives you the joint benefits of open blockchain technology and traditional currency by converting your cash into a stable digital currency equivalent.',
      },
      BUSD: {
        name: 'Binance USD',
        description: 'Binance USD (BUSD) is a dollar-backed stablecoin issued and custodied by Paxos Trust Company, and regulated by the New York State Department of Financial Services. BUSD is available directly for sale 1:1 with USD on Paxos.com and will be listed for trading on Binance.',
      },
    },
    transfers: [
      {
        id: '0xdd3be9a7b1c18bd28188c51f8734b907264cd7de7aa4b68d8ba6e823da46e778',
        method: 'Transfer',
        timestamp: '25 secs ago',
        fromAddress: '0x2cba9372edb012769d67d45b62ddd63ac654910a',
        toAddress: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
        quantity: 1092.814502,
      },
      {
        id: '0xdd3be9a7b1c18bd28188c51f8734b907264cd7de7aa4b68d8ba6e823da46e778',
        method: 'Approve',
        timestamp: '35 secs ago',
        fromAddress: '0x2cba9372edb012769d67d45b62ddd63ac654910a',
        toAddress: '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
        quantity: 1092.814503,
      },
    ],
    holders: [
      {
        id: '1',
        address: '0xa929022c9107643515f5c777ce9a910f0d1e490c',
        quantity: 1092.814502,
        percentage: '6.1728%',
        value: '$ 1 908 040 490,00',
      },
      {
        id: '2',
        address: '0xa929022c9107643515f5c777ce9a910f0d1e490c',
        quantity: 1092.814502,
        percentage: '6.1728%',
        value: '$ 1 908 040 490,00',
      },
    ],
  }),
  computed: {
    totalPagesValue() {
      if (this.activeTab === 'tables__tab_transfers') {
        return this.setTotalPages(this.transfers.length, 20);
      } if (this.activeTab === 'tables__tab_holders') {
        return this.setTotalPages(this.holders.length, 20);
      }
      return 1;
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.params = this.$route.params.id;
    this.SetLoader(false);
  },
  methods: {
    onClick(event) {
      this.activeTab = event.target.className;
    },
    onClickContract(event) {
      if (this.activePoint !== '') {
        this.activePoint = '';
      } else if (event.target.className === ('icon-chevron_down' || 'icon-chevron_up')) {
        this.activePoint = event.path[1].className;
      } else {
        this.activePoint = event.target.className;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.token {
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
  &__title {
    @include text-simple;
    @include normal-font-size;
    font-weight: 600;
    font-size: 28px;
  }
  &__info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 25px;
    margin-bottom: 25px;
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
    &_transfers, &_holders, &_info, &_contract {
    @include text-simple;
    margin-right: 20px;
    padding-bottom: 12px;
    color: $black500;
    cursor: pointer;
    }
    &_active {
        @include text-simple;
        border-bottom: 2px solid $blue;
    }
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
</style>
