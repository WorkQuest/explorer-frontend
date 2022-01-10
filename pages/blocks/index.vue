<template>
  <div class="blocks blocks__container">
    <search-filter class="blocks__search" />
    <base-field
      v-model="search"
      class="blocks__search_mobile"
      :is-search="true"
      :is-hide-error="true"
      :placeholder="$t('ui.forms.searchPlaceholder')"
    />
    <table-blocks
      class="blocks__table"
      :title="$t('ui.blocks')"
      :items="blocks"
      :fields="tableHeaders"
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
      :total-pages="totalPagesValue"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Block from '~/components/mobile/block.vue';

export default {
  name: 'Blocks',
  components: { Block },
  data() {
    return {
      currentPage: 1,
      search: '',
    };
  },
  computed: {
    ...mapGetters({
      blocks: 'blocks/getBlocks',
      blocksCount: 'blocks/getBlocksCount',
    }),
    totalPagesValue() {
      return this.setTotalPages(this.blocks.length, 20);
    },
    tableHeaders() {
      return [
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
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    await this.getAllBlocks();
    this.SetLoader(false);
  },
  methods: {
    async getAllBlocks() {
      await this.$store.dispatch('blocks/getBlocks');
    },
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
.items {
  display: none;
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
    display: block;
    background: $white;
    padding: 16px;
  }
}

</style>
