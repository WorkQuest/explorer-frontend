<template>
  <div class="contract">
    <search-filter class="contract__search" />
    <base-field
      v-model="search"
      class="contract__search_mobile"
      :is-search="true"
      :is-hide-error="true"
      :placeholder="$t('ui.forms.searchPlaceholder')"
    />
    <div class="contract__header">
      <h4 class="contract__title">
        {{ $t('ui.token.contract') }}
      </h4>
      <p
        class="contract__contract"
      >
        0x7811B8604c64D62D02dc7e5a8c47185B1b59E0b3
        <span class="icon-copy" />
      </p>
    </div>
    <div class="contract__info">
      <Overview />
      <!-- TODO: fix more info links -->
      <MoreInfo />
    </div>
    <div class="contract__tables tables">
      <div class="tables__menu">
        <span
          class="tables__tab_txs"
          :class="{tables__tab_active: activeTab === 'tables__tab_txs'}"
          @click="onClick"
        >{{ $t('ui.txs') }}</span>
        <span
          class="tables__tab_internal"
          :class="{tables__tab_active: activeTab === 'tables__tab_internal'}"
          @click="onClick"
        >{{ $t('ui.token.internal') }}</span>
        <span
          class="tables__tab_erc"
          :class="{tables__tab_active: activeTab === 'tables__tab_erc'}"
          @click="onClick"
        >ERC-20 {{ $t('ui.token.tokensTxns') }}</span>
      </div>
      <div
        v-if="activeTab === 'tables__tab_txs'"
        class="tables__txs"
      >
        <TableTxs
          class="tables__table"
          :title="$t('ui.txs')"
          :is-only="false"
          :items="txs"
          :fields="tableHeadersTxs"
        />
        <Transaction
          v-for="(item, i) in txs"
          :key="i"
          class="tables__transaction"
          :transaction="item"
          :is-last="txs[i] === txs[txs.length - 1]"
        />
        <base-pager
          v-if="totalPagesValue > 1"
          v-model="currentPage"
          class="contract__pager"
          :total-pages="totalPagesValue"
        />
      </div>
      <div
        v-if="activeTab === 'tables__tab_internal'"
        class="tables__internal"
      >
        <TableTxs
          class="tables__table"
          :is-only="false"
          :items="internal"
          :fields="tableHeadersInternal"
        />
        <Transaction
          v-for="(item, i) in internal"
          :key="i"
          class="tables__transaction"
          :transaction="item"
          :is-last="internal[i] === internal[internal.length - 1]"
          :internal="true"
        />
        <base-pager
          v-if="totalPagesValue > 1"
          v-model="currentPage"
          class="contract__pager"
          :total-pages="totalPagesValue"
        />
      </div>
      <div
        v-if="activeTab === 'tables__tab_erc'"
        class="tables__erc"
      >
        <TableTxs
          class="tables__table"
          :is-only="false"
          :items="erc"
          :fields="tableHeadersERC"
          :tokens="tokens"
        />
        <Transaction
          v-for="(item, i) in erc"
          :key="i"
          class="tables__transaction"
          :transaction="item"
          :is-last="txs[i] === txs[txs.length - 1]"
          :is-home="true"
          :tokens="tokens"
          :is-token="true"
        />
        <base-pager
          v-if="totalPagesValue > 1"
          v-model="currentPage"
          class="contract__pager"
          :total-pages="totalPagesValue"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Overview from '~/components/Overview.vue';
import MoreInfo from '~/components/MoreInfo.vue';
import Transaction from '~/components/mobile/transaction.vue';

export default {
  name: 'Contract',
  components: {
    Overview,
    MoreInfo,
    Transaction,
  },
  data() {
    return {
      activeTab: 'tables__tab_txs',
      currentPage: 1,
      search: '',
      tokens: {
        USDT: {
          name: 'Tether USD',
          description: 'Tether gives you the joint benefits of open blockchain technology and traditional currency by converting your cash into a stable digital currency equivalent.',
        },
        BUSD: {
          name: 'Binance USD',
          description: 'Binance USD (BUSD) is a dollar-backed stablecoin issued and custodied by Paxos Trust Company, and regulated by the New York State Department of Financial Services. BUSD is available directly for sale 1:1 with USD on Paxos.com and will be listed for trading on Binance.',
        },
        GHST: {
          name: 'Aavegotchi Ghost Token',
          description: 'Aavegotchis are crypto-collectibles living on the Ethereum blockchain, backed by the ERC721 standard used in popular blockchain games. $GHST is the official utility token of the Aavegotchi ecosystem and can be used to purchase portals, wearables, and consumables.',
        },
      },
      txs: [],
      internal: [
        {
          blockNumber: 17102304,
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
        },
        {
          blockNumber: 17102305,
          timestamp: '35 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664700000000000000,
        },
        {
          blockNumber: 17102306,
          timestamp: '45 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664800000000000000,
        },
      ],
      erc: [
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '25 secs ago',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
      ],
    };
  },
  computed: {
    totalPagesValue() {
      if (this.activeTab === 'tables__tab_txs') {
        return this.setTotalPages(this.txs.length, 20);
      } if (this.activeTab === 'tables__tab_internal') {
        return this.setTotalPages(this.internal.length, 20);
      } if (this.activeTab === 'tables__tab_erc') {
        return this.setTotalPages(this.erc.length, 20);
      }
      return 1;
    },
    tableHeadersTxs() {
      return [
        {
          key: 'id', label: this.$t('ui.tx.transaction'), sortable: true,
        },
        {
          key: 'blockNumber', label: this.$t('ui.block.blockNumber'), sortable: true,
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
          key: 'value', label: this.$t('ui.tx.value'), sortable: true,
        },
        {
          key: 'gasUsed', label: this.$t('ui.tx.fee'), sortable: true,
        },
      ];
    },
    tableHeadersInternal() {
      return [
        {
          key: 'blockNumber', label: this.$t('ui.block.blockNumber'), sortable: true,
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
          key: 'value', label: this.$t('ui.tx.value'), sortable: true,
        },
      ];
    },
    tableHeadersERC() {
      return [
        {
          key: 'id', label: this.$t('ui.tx.transaction'), sortable: true,
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
          key: 'value', label: this.$t('ui.tx.value'), sortable: true,
        },
        {
          key: 'token', label: this.$t('ui.token.token'), sortable: true,
        },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    const txsRes = await this.$axios.get('/v1/txs');
    this.txs = txsRes.data.result.txs;
    this.SetLoader(false);
  },
  methods: {
    onClick(event) {
      this.activeTab = event.target.className;
    },
  },
};
</script>

<style lang="scss" scoped>
.contract {
  @include container;
  &__search {
    margin: 25px 0;
    &_mobile {
      display: none;
    }
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
  }
}
.tables {
  background: $white;
  border-radius: 6px;
  padding-top: 20px;
  min-height: 450px;
  &__menu {
    margin: 0 0 27px 20px
  }
  &__tab {
    &_txs, &_erc, &_internal {
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
  &__transaction {
    display: none;
  }
}
.icon-copy::before {
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
    &__search {
      display: none;
      &_mobile {
        display: block;
        background: $white;
        border-radius: 6px;
        padding: 10px 14px;
        margin: 25px 16px;
      }
    }
    &__pager {
      margin: 16px;
    }
  }
  .tables {
    padding: 20px 15px 15px 15px;
    &__menu {
      margin: 0;
    }
    &__tab {
      &_txs, &_erc, &_internal {
      margin-right: 3px;
      }
    }
    &__table {
      display: none;
    }
    &__transaction {
      display: block;
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
