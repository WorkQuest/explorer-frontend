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
      v-if="totalPages > 1"
      v-model="page"
      :total-pages="totalPages"
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
      limit: 20,
      offset: 0,
      page: 1,
      search: '',
    };
  },
  computed: {
    ...mapGetters({
      blocks: 'blocks/getBlocks',
      blocksCount: 'blocks/getBlocksCount',
    }),
    totalPages() {
      return Math.ceil(this.blocksCount / this.limit);
    },
    tableHeaders() {
      return [
        { key: 'id', label: this.$t('ui.block.blockNumber'), sortable: true },
        { key: 'timestamp', label: this.$t('ui.block.age'), sortable: true },
        { key: 'txsCount', label: this.$t('ui.block.txn'), sortable: true },
        { key: 'gasUsed', label: this.$t('ui.block.gasUsed'), sortable: true },
        { key: 'gasLimit', label: this.$t('ui.block.gasLimit'), sortable: true },
        { key: 'size', label: this.$t('ui.block.reward'), sortable: true },
      ];
    },
    payload() {
      return {
        limit: this.limit,
        offset: this.offset,
      };
    },
  },
  watch: {
    async page() {
      await this.SetLoader(true);
      this.offset = (this.page - 1) * this.limit;
      await this.$store.dispatch('blocks/getBlocks', this.payload);
      await this.SetLoader(false);
    },
  },
  async mounted() {
    await this.SetLoader(true);
    await this.$store.dispatch('blocks/getBlocks', this.payload);
    await this.SetLoader(false);
  },
};
</script>

<style lang="scss" scoped>
.blocks {
  animation: show 1s 1;

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
