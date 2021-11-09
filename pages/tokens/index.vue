<template>
  <div class="tokens">
    TOKENS
    <TableTokens
      :title="$t('ui.token.tracker')"
      :items="tracker"
      :fields="[
        {
          key: 'number', label: '#', sortable: true,
        },
        {
          key: 'token', label: this.$t('ui.token.token'), sortable: true,
        },
        {
          key: 'volume', label: this.$t('ui.block.age'), sortable: true,
        },
        {
          key: 'holders', label: this.$t('ui.tx.from'), sortable: true,
        },
      ]"
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
  data: () => ({
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
    ],
    tokens: {
      USDT: {
        name: 'Tether USD',
        symbol: '',
        description: 'Tether gives you the joint benefits of open blockchain technology and traditional currency by converting your cash into a stable digital currency equivalent.',
      },
      BUSD: {
        name: 'Binance USD',
        symbol: '',
        description: 'Binance USD (BUSD) is a dollar-backed stablecoin issued and custodied by Paxos Trust Company, and regulated by the New York State Department of Financial Services. BUSD is available directly for sale 1:1 with USD on Paxos.com and will be listed for trading on Binance.',
      },
    },
  }),
  computed: {
    totalPagesValue() {
      return this.setTotalPages(this.tokens.length, 20);
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
};
</script>
