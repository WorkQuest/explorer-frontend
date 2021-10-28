<template>
  <div class="blocks">
    <search-filter class="blocks__header" />
    <base-table
      class="blocks__container"
      :title="$t('ui.latestTxs')"
      :items="testTxs"
      :fields="[
        {
          key: 'hash', label: this.$t('ui.tx.hash'), sortable: true,
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
</template>

<script>
export default {
  name: 'Blocks',
  data: () => ({
    blocks: [],
  }),
  async mounted() {
    this.SetLoader(true);
    const blocksRes = await this.$axios.get('/v1/blocks');
    this.blocks = blocksRes.data.result.blocks;
    this.SetLoader(false);
    console.log(this.blocks);
  },
};
</script>

<style lang="scss" scoped>
.blocks {
    &__container {
        @include container;
    }
}
</style>
