<template>
  <div class="home__body">
    <div class="home__blocks_table">
      <base-table
        :title="$t('ui.blocks') + ` (${blocksCount})`"
        :items="blocks"
        :fields="[
          {
            key: 'id', label: this.$t('ui.block.height'), sortable: false,
          },
          {
            key: 'timestamp', label: this.$t('ui.block.timestamp'), sortable: false,
          },
          {
            key: 'txsCount', label: this.$t('ui.block.txsCount'), sortable: false,
          }
        ]"
      />
    </div>
    <div class="home__txs_table">
      <base-table
        :title="$t('ui.txs') + ` (${txsCount})`"
        :items="txs"
        :fields="[
          {
            key: 'id', label: this.$t('ui.tx.hash'), sortable: false,
          },
          {
            key: 'fromAddress', label: this.$t('ui.tx.from'), sortable: false,
          },
          {
            key: 'toAddress', label: this.$t('ui.tx.to'), sortable: false,
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
  data: () => ({
    blocksCount: 0,
    txsCount: 0,
    blocks: [],
    txs: [],
  }),
  created() {
    // this.$router.push('/');
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
  &__body {
    //width: 100%;
    display: grid;
    max-width: 100vw;
    padding: 50px;
  }

  &__blocks_table {
    max-width: 100vw;
    width: 100%;
    //max-width: 1180px;
    //padding-right: 25px;
  }

  &__txs_table {
    width: 100%;
    max-width: 100vw;

    //max-width: 1180px;
    //padding-left: 25px;
  }
}
</style>
