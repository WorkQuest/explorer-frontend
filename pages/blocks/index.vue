<template>
  <div
    v-if="!isLoading"
    class="blocks blocks__container"
  >
    <search-filter class="blocks__search" />
    <table-blocks
      class="blocks__table"
      :title="$tc('ui.blocks')"
      :items="blocks"
      :fields="tableHeaders"
    />
    <div class="blocks__items items">
      <p class="items__title">
        {{ $t('ui.blocks') }}
      </p>
      <block
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
import TableBlocks from '~/components/TableBlocks';

export default {
  name: 'Blocks',
  components: { TableBlocks },
  data() {
    return {
      limit: 20,
      offset: 0,
      page: +this.$route.query?.page || 1,
    };
  },
  computed: {
    ...mapGetters({
      blocks: 'blocks/getBlocks',
      blocksCount: 'blocks/getBlocksCount',
      isLoading: 'main/getIsLoading',
    }),
    totalPages() {
      return this.setTotalPages(this.blocksCount, this.limit);
    },
    tableHeaders() {
      return [
        { key: 'number', label: this.$t('ui.block.blockNumber'), sortable: true },
        { key: 'timestamp', label: this.$t('ui.block.age'), sortable: true },
        { key: 'transactionsCount', label: this.$t('ui.block.txn'), sortable: true },
        { key: 'gas_used', label: this.$t('ui.block.gasUsed'), sortable: true },
        { key: 'gas_limit', label: this.$t('ui.block.gasLimit'), sortable: true },
        { key: 'reward', label: this.$t('ui.block.reward'), sortable: true },
      ];
    },
    payload() {
      return {
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
      };
    },
  },
  watch: {
    async page(current, previous) {
      if (current !== previous) {
        await this.$router.push({ query: { ...this.$route.query, page: this.page.toString() } });
      }
    },
  },
  async mounted() {
    await this.getBlocks();
    sessionStorage.setItem('backRoute', this.$route.fullPath);
  },
  methods: {
    async getBlocks() {
      await this.SetLoader(true);
      await this.$store.dispatch('blocks/getBlocks', this.payload);
      await this.SetLoader(false);
    },
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
