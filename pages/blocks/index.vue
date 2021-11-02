<template>
  <div class="blocks blocks__container">
    <search-filter class="blocks__header" />
    <table-blocks
      class="blocks__table"
      :title="$t('ui.blocks')"
      :items="blocks"
      :fields="[
        {
          key: 'id', label: this.$t('ui.block.blockNumber'), sortable: true,
        },
        {
          key: 'timestamp', label: this.$t('ui.block.age'), sortable: true,
        },
        {
          key: 'txsCount', label: this.$t('ui.block.txn'), sortable: true,
        },
        {
          key: 'gasUsed', label: this.$t('ui.block.gasUsed'), sortable: true,
        },
        {
          key: 'gasLimit', label: this.$t('ui.block.gasLimit'), sortable: true,
        },
        {
          key: 'size', label: this.$t('ui.block.reward'), sortable: true,
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
export default {
  name: 'Blocks',
  data: () => ({
    blocks: [],
    currentPage: 1,
  }),
  computed: {
    totalPagesValue() {
      return this.setTotalPages(this.blocks.length, 20);
    },
  },
  async mounted() {
    this.SetLoader(true);
    const blocksRes = await this.$axios.get('/v1/blocks');
    this.blocks = blocksRes.data.result.blocks;
    this.SetLoader(false);
  },
};
</script>

<style lang="scss" scoped>
.blocks {
    &__container {
        @include container;
    }
    &__header {
      margin-top: 30px;
    }
    // &__table {
    //    margin: 25px 0;
    // }
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
