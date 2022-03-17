<template>
  <div
    v-if="!isLoading"
    class="contract"
  >
    <search-filter class="contract__search" />

    <div class="contract__header">
      <h4 class="contract__title">
        {{ $t('ui.token.contract') }}
      </h4>
      <p class="contract__contract">
        <!--        TODO: Вывести адрес контракта-->
        0x7811B8604c64D62D02dc7e5a8c47185B1b59E0b3
        <button
          v-clipboard:copy="0x7811B8604c64D62D02dc7e5a8c47185B1b59E0b3"
          v-clipboard:success="ClipboardSuccessHandler"
          v-clipboard:error="ClipboardErrorHandler"
          class="btn__copy"
          type="button"
        >
          <span class="icon-copy" />
        </button>
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
          @click="onClick(tab)"
        >{{ $t(`ui.token.${tab}`) }}</span>
      </div>
      <div
        v-if="activeTab === 'txs'"
        class="tables__txs"
      >
        <table-txs
          class="tables__table"
          :title="$tc('ui.txs')"
          :is-only="false"
          :items="transactions"
          :fields="tableHeadersTxs"
        />
        <transaction
          v-for="(item, i) in transactions"
          :key="i"
          class="tables__transaction"
          :transaction="item"
          :is-last="transactions[i] === transactions[transactions.length - 1]"
        />
        <base-pager
          v-if="totalPages > 1"
          v-model="page"
          class="contract__pager"
          :total-pages="totalPages"
        />
      </div>
      <div
        v-if="activeTab === 'internal'"
        class="tables__internal"
      >
        <table-txs
          class="tables__table"
          :is-only="false"
          :items="internalTransactions"
          :fields="tableHeadersInternal"
        />
        <transaction
          v-for="(item, i) in internalTransactions"
          :key="i"
          class="tables__transaction"
          :transaction="item"
          :is-last="internalTransactions[i] === internalTransactions[internalTransactions.length - 1]"
          :internal="true"
        />
        <base-pager
          v-if="totalPages > 1"
          v-model="page"
          class="contract__pager"
          :total-pages="totalPages"
        />
      </div>
      <div
        v-if="activeTab === 'tokensTxns'"
        class="tables__erc"
      >
        <table-txs
          class="tables__table"
          :is-only="false"
          :items="tokenTransfers"
          :fields="tableHeadersERC"
        />
        <transaction
          v-for="(item, i) in tokenTransfers"
          :key="i"
          class="tables__transaction"
          :transaction="item"
          :is-last="tokenTransfers[i] === tokenTransfers[tokenTransfers.length - 1]"
          :is-home="true"
          :tokens="tokens"
          :is-token="true"
        />
        <base-pager
          v-if="totalPages > 1"
          v-model="page"
          class="contract__pager"
          :total-pages="totalPages"
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
      tabs: ['txs', 'internal', 'tokensTxns'],
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
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      transactions: 'account/getTransactions',
      transactionsCount: 'account/getTransactionsCount',
      internalTransactions: 'account/getInternalTransactions',
      internalTransactionsCount: 'account/getInternalTransactionsCount',
      tokenTransfers: 'account/getTokenTransfers',
      tokenTransfersCount: 'account/getTokenTransfersCount',
    }),
    totalPages() {
      if (this.activeTab === 'txs') return this.setTotalPages(this.transactionsCount, this.limit);
      if (this.activeTab === 'internal') return this.setTotalPages(this.internalTransactionsCount, this.limit);
      if (this.activeTab === 'tokensTxns') return this.setTotalPages(this.tokenTransfersCount, this.limit);
      return 1;
    },
    tableHeadersTxs() {
      return [
        { key: 'hash', label: this.$t('ui.tx.transaction'), sortable: true },
        { key: 'block_number', label: this.$t('ui.block.blockNumber'), sortable: true },
        { key: 'age', label: this.$t('ui.block.age'), sortable: true },
        { key: 'from_address_hash.hex', label: this.$t('ui.tx.from'), sortable: true },
        { key: 'to_address_hash.hex', label: this.$t('ui.tx.to'), sortable: true },
        { key: 'value', label: this.$t('ui.tx.value'), sortable: true },
        { key: 'gas_used', label: this.$t('ui.tx.fee'), sortable: true },
      ];
    },
    tableHeadersInternal() {
      return [
        { key: 'block_number', label: this.$t('ui.block.blockNumber'), sortable: true },
        { key: 'age', label: this.$t('ui.block.age'), sortable: true },
        { key: 'from_address_hash.hex', label: this.$t('ui.tx.from'), sortable: true },
        { key: 'to_address_hash.hex', label: this.$t('ui.tx.to'), sortable: true },
        { key: 'value', label: this.$t('ui.tx.value'), sortable: true },
      ];
    },
    tableHeadersERC() {
      return [
        { key: 'transaction_hash', label: this.$t('ui.tx.transaction'), sortable: true },
        { key: 'age', label: this.$t('ui.block.age'), sortable: true },
        { key: 'from_address_hash.hex', label: this.$t('ui.tx.from'), sortable: true },
        { key: 'to_address_hash.hex', label: this.$t('ui.tx.to'), sortable: true },
        { key: 'amount', label: this.$t('ui.tx.value'), sortable: true },
        { key: 'token', label: this.$t('ui.token.token'), sortable: true },
      ];
    },
    address() {
      return this.$route.params.id;
    },
  },
  async mounted() {
    // await this.SetLoader(true);
    // TODO: Переписать
    console.log('mounted');
    // const txsRes = await this.$axios.get('txs');
    // this.txs = txsRes.data.result.txs;
    // await this.SetLoader(false);
    await this.getContractData();
  },
  methods: {
    onClick(tab) {
      this.activeTab = tab;
    },
    async getContractData() {
      if (isAddress(this.address)) {
        await this.SetLoader(true);
        await this.$store.dispatch('account/getAccountByAddress', this.address);
        await this.SetLoader(false);
      } else {
        console.log('no address');
        await this.$router.push('/');
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
    background: $white;
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

    &__pager {
      margin: 16px;
    }
  }
  .tables {
    padding: 20px 15px 15px 15px;

    &__menu {
      margin: 0;
      display: flex;
      gap: 5px;
    }

    &__tab {
      margin-right: 3px;
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
