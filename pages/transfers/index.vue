<template>
  <div class="transfer transfer__container">
    <search-filter class="transfer__header" />
    <TableTxs
      class="transfer__table"
      :title="$t('ui.token.token')+' '+$t('ui.token.transfers')"
      :items="transfers"
      :tokens="tokens"
      :fields="[
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
      ]"
    />
    <base-pager
      v-if="totalPagesValue > 1"
      v-model="currentPage"
      :total-pages="totalPagesValue"
    />
  </div>
</template>
<script>
import TableTxs from '~/components/TableTxs/index.vue';

export default {
  name: 'Transfer',
  components: {
    TableTxs,
  },
  data: () => ({
    currentPage: 1,
    transfers: [
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
  }),
  computed: {
    totalPagesValue() {
      return this.setTotalPages(this.transfers.length, 20);
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
};
</script>

<style lang="scss" scoped>
.transfer {
    &__container {
        @include container;
    }
    &__header {
      margin-top: 30px;
    }
    &__table {
       margin: 25px 0;
    }
    &__grey {
    color: $black500;
    }
}
.page {
  &__active {
    color: $blue;
  }
  &__common {
    color: $black600;
  }
}
</style>
