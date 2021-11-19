<template>
  <div class="blocks blocks__container">
    <search-filter class="blocks__search" />
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
    <base-field
      v-model="search"
      class="blocks__search_mobile"
      :is-search="true"
      :is-hide-error="true"
      :placeholder="$t('ui.forms.searchPlaceholder')"
    />
    <div class="blocks__items items">
      <p class="items__title">
        {{ $t('ui.blocks') }}
      </p>
      <Block
        v-for="(item, i) in blocks"
        :key="i"
        class="items__block"
        :block="item"
        :is-last="blocks[i] === blocks[blocks.length - 1]"
      />
    </div>
    <base-pager
      v-if="totalPagesValue > 1"
      v-model="currentPage"
      class="blocks__pager"
      :total-pages="totalPagesValue"
    />
  </div>
</template>

<script>
import Block from '~/components/mobile/block.vue';

export default {
  name: 'Blocks',
  components: { Block },
  data: () => ({
    blocks: [],
    currentPage: 1,
    search: '',
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
    &__search {
      margin: 25px 0;
      &_mobile {
        display: none;
      }
    }
    &__grey {
    color: $black500;
    }
}
@include _767 {
  .blocks {
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
    &__table {
      display: none;
    }
    &__pager {
      margin: 16px;
    }
  }
  .items {
    background: $white;
    padding: 16px;
  }
}

</style>
