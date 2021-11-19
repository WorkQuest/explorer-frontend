<template>
  <div class="tokens">
    <search-filter class="tokens__search" />
    <TableTokens
      class="tokens__table"
      :title="$t('ui.token.tracker')"
      :items="tracker"
      :tokens="tokens"
      :fields="tableHeaders"
    />
  </div>
</template>

<script>
import TableTokens from '~/components/TableTokens/index.vue';

export default {
  name: 'TokensTracker',
  components: {
    TableTokens,
  },
  data() {
    return {
      currentPage: 1,
      tracker: [
        {
          number: 1,
          token: 'USDT',
          volume: 43369072176.00,
          holders: 3320602,
        },
        {
          number: 2,
          token: 'BUSD',
          volume: 43369072177.00,
          holders: 3320603,
        },
        {
          number: 3,
          token: 'GHST',
          volume: 43369072179.00,
          holders: 3320600,
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
    };
  },
  computed: {
    totalPagesValue() {
      return this.setTotalPages(this.tokens.length, 20);
    },
    tableHeaders() {
      return [
        {
          key: 'number', label: '#', sortable: true,
        },
        {
          key: 'token', label: this.$t('ui.token.token'), sortable: true,
        },
        {
          key: 'volume', label: this.$t('ui.token.volume'), sortable: true,
        },
        {
          key: 'holders', label: this.$t('ui.token.holders'), sortable: true,
        },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
};
</script>

<style lang="scss" scoped>
.tokens {
  &__search {
    margin: 25px 0;
  }
  &__table {
    @include container;
  }
}
</style>
