<template>
  <div
    v-if="!isLoading"
    class="home"
  >
    <div class="home__header">
      <div class="home__content">
        <h3 class="home__title">
          {{ $t('home.title') }}
        </h3>
        <search-filter
          :include-filter="false"
          class="home__search"
        />
      </div>
    </div>
    <div class="home__content home__content_mobile">
      <base-table
        :title="$tc('ui.latestBlocks')"
        :headerlink="$tc('ui.allBlocks')"
        type="blocks"
        class="home__table"
        :items="blocks"
        :fields="tableHeadersBlocks"
      />
      <div class="home__blocks blocks">
        <p class="blocks__title">
          {{ $t('ui.latestBlocks') }}
        </p>
        <nuxt-link
          class="blocks__link"
          :to="'blocks'"
        >
          {{ $t('ui.allBlocks') }}
        </nuxt-link>
      </div>
      <block
        v-for="(item, i) in blocks"
        :key="i"
        class="home__block"
        :block="item"
        :is-last="blocks[i] === blocks[blocks.length - 1]"
      />
    </div>
    <div class="home__content home__content_mobile">
      <base-table
        :title="$tc('ui.latestTxs')"
        :items="txs"
        :headerlink="$tc('ui.allTxs')"
        type="transactions"
        class="home__table"
        :fields="tableHeadersTxs"
      />
      <div class="home__blocks blocks">
        <p class="blocks__title">
          {{ $t('ui.latestTxs') }}
        </p>
        <nuxt-link
          class="blocks__link"
          :to="'transactions'"
        >
          {{ $t('ui.allTxs') }}
        </nuxt-link>
      </div>
      <transaction
        v-for="(item, i) in txs"
        :key="i"
        class="home__block"
        :transaction="item"
        :is-home="true"
        :is-last="txs[i] === txs[txs.length - 1]"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Home',
  layout: 'default',
  data() {
    return {
      search: '',
      limit: 5,
      offset: 0,
      type: '',
      types: {},
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      blocks: 'blocks/getBlocks',
      blocksCount: 'blocks/getBlocksCount',
      txs: 'tx/getTxs',
      txsCount: 'tx/getTxsCount',
    }),
    payload() {
      return {
        limit: this.limit,
        offset: this.offset,
      };
    },
    tableHeadersBlocks() {
      return [
        { key: 'number', label: this.$t('ui.block.blockNumber'), sortable: true },
        { key: 'timestamp', label: this.$t('ui.block.age'), sortable: true },
        { key: 'transactionsCount', label: this.$t('ui.block.txsCount'), sortable: true },
        { key: 'reward', label: this.$t('ui.block.reward'), sortable: true },
      ];
    },
    tableHeadersTxs() {
      return [
        { key: 'hash', label: this.$t('ui.tx.transaction'), sortable: true },
        { key: 'from_address_hash.hex', label: this.$t('ui.tx.from'), sortable: true },
        { key: 'to_address_hash.hex', label: this.$t('ui.tx.to'), sortable: true },
        { key: 'value', label: this.$t('ui.tx.amount'), sortable: true },
      ];
    },
  },
  async mounted() {
    await this.SetLoader(true);
    await this.$store.dispatch('blocks/getBlocks', this.payload);
    await this.$store.dispatch('tx/getTxs', this.payload);
    await this.SetLoader(false);
  },
  beforeDestroy() {
    this.$store.commit('tx/resetTxs');
  },
};
</script>
<style lang="scss" scoped>
.home {
  animation: show 1s 1;

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
    color: $white;
    font-family: 'Inter', sans-serif;
  }

  &__header-button {
    width: 46px;
    height: 63px;
    margin-left: 10px;
    display: none;
  }

  &__block {
    display: none;
  }
}

.blocks {
  display: none;
}

@include _767 {
  .home {
    &__header {
      height: 228px;
    }

    &__title {
      font-size: 28px;
      max-width: 200px;
      margin-left: 16px;
    }

    &__table {
      display: none;
    }

    &__content_mobile {
      padding: 16px 21px 0 21px;
      background: $white;
      margin-bottom: 25px;
    }

    &__block {
      display: grid;
    }
  }
  .blocks {
    display: flex;
    justify-content: space-between;

    &__link {
      @include link;
    }
  }
}
</style>
