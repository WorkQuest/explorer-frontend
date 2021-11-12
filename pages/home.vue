<template>
  <div class="home">
    <div
      class="home__header"
    >
      <div class="home__content">
        <h3
          class="home__title"
        >
          {{ $t('home.title') }}
        </h3>
        <search-filter />
      </div>
    </div>
    <div class="home__table home__content">
      <base-table
        :title="$t('ui.latestBlocks')"
        :headerlink="$t('ui.allBlocks')"
        type="blocks"
        :items="testBlocks"
        :fields="[
          {
            key: 'id', label: this.$t('ui.block.blockNumber'), sortable: true
          },
          {
            key: 'timestamp', label: this.$t('ui.block.age'), sortable: true
          },
          {
            key: 'txsCount', label: this.$t('ui.block.txsCount'), sortable: true
          },
          {
            key: 'reward', label: this.$t('ui.block.reward'), sortable: true
          }
        ]"
      />
    </div>
    <div class="home__table home__content">
      <base-table
        :title="$t('ui.latestTxs')"
        :items="testTxs"
        :headerlink="$t('ui.allTxs')"
        type="transactions"
        :fields="[
          {
            key: 'hash', label: this.$t('ui.tx.transaction'), sortable: true,
          },
          {
            key: 'fromAddress', label: this.$t('ui.tx.from'), sortable: true,
          },
          {
            key: 'toAddress', label: this.$t('ui.tx.to'), sortable: true,
          },
          {
            key: 'value', label: this.$t('ui.tx.amount'), sortable: true,
          }
        ]"
      />
    </div>
  </div>
</template>
<script>
export default {
  name: 'Home',
  layout: 'default',
  components: {},
  data: () => ({
    blocksCount: 0,
    txsCount: 0,
    blocks: [],
    txs: [],
    testBlocks: [
      {
        id: 17102304,
        timestamp: '25 secs ago',
        txsCount: 209,
        reward: 0.06646,
        symbol: 'BUSD',
      },
      {
        id: 17102305,
        timestamp: '25 secs ago',
        txsCount: 209,
        reward: 0.06646,
        symbol: 'WUSD',
      },
    ],
    testTxs: [
      {
        hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b8158',
        fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
        toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
        value: 0.06646,
        symbol: 'BUSD',
        timestamp: '10 secs ago',
      },
      {
        hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
        fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
        toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
        value: 0.07746,
        symbol: 'WUSD',
        timestamp: '10 secs ago',
      },
    ],
  }),
  created() {
  },
  async mounted() {
    this.SetLoader(true);
    const [blocksRes, txsRes] = await Promise.all([
      this.$axios.get('/v1/blocks'),
      this.$axios.get('/v1/txs'),
    ]);
    this.blocks = blocksRes.data.result.blocks;
    this.blocksCount = blocksRes.data.result.count;
    this.txs = txsRes.data.result.txs;
    this.txsCount = txsRes.data.result.count;
    this.SetLoader(false);
  },
};
</script>
<style lang="scss" scoped>
.home {
  &__table {
  }
  &__header {
    background: $darkblue;
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }
  &__content {
    @include container;
    margin: 0 auto;
  }
  &__title {
    @include text-simple;
    @include normal-font-size;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 34px;
    color:  $white;
  }
  &__header-button {
    width: 46px;
    height: 63px;
    margin-left: 10px;
    display: none;
  }
}
</style>
