<template>
  <div class="home">
    <div class="home__header">
      <div class="home__content">
        <h3 class="home__title">
          {{ $t('home.title') }}
        </h3>
        <search-filter class="home__search" />
        <base-field
          v-model="search"
          class="home__search_mobile"
          :is-search="true"
          :is-hide-error="true"
          :placeholder="$t('ui.forms.searchPlaceholder')"
        />
      </div>
    </div>
    <div class="home__content home__content_mobile">
      <base-table
        :title="$t('ui.latestBlocks')"
        :headerlink="$t('ui.allBlocks')"
        type="blocks"
        class="home__table"
        :items="blocks"
        :fields="tableHeadersBlocks"
      />
      <div class="home__blocks blocks">
        <p class="blocks__title">
          {{ $t('ui.latestBlocks') }}
        </p>
        <base-btn
          class="blocks__link"
          @click="toAllBlocks"
        >
          {{ $t('ui.allBlocks') }}
        </base-btn>
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
        :title="$t('ui.latestTxs')"
        :items="txs"
        :headerlink="$t('ui.allTxs')"
        type="transactions"
        class="home__table"
        :fields="tableHeadersTxs"
      />
      <div class="home__blocks blocks">
        <p class="blocks__title">
          {{ $t('ui.latestTxs') }}
        </p>
        <base-btn
          class="blocks__link"
          @click="toAllTxs"
        >
          {{ $t('ui.allTxs') }}
        </base-btn>
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
      limit: 2,
      offset: 0,
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
        { key: 'id', label: this.$t('ui.block.blockNumber'), sortable: true },
        { key: 'timestamp', label: this.$t('ui.block.age'), sortable: true },
        { key: 'txsCount', label: this.$t('ui.block.txsCount'), sortable: true },
        { key: 'reward', label: this.$t('ui.block.reward'), sortable: true },
      ];
    },
    tableHeadersTxs() {
      return [
        { key: 'hash', label: this.$t('ui.tx.transaction'), sortable: true },
        { key: 'fromAddress', label: this.$t('ui.tx.from'), sortable: true },
        { key: 'toAddress', label: this.$t('ui.tx.to'), sortable: true },
        { key: 'value', label: this.$t('ui.tx.amount'), sortable: true },
      ];
    },
  },
  async mounted() {
    await this.SetLoader(true);
    this.$route.fullPath.slice(0, 1);
    await this.$store.dispatch('blocks/getBlocks', this.payload);
    await this.$store.dispatch('tx/getTxs', this.payload);
    await this.SetLoader(false);
  },
  methods: {
    async toAllBlocks() {
      await this.$router.replace({ path: '/' });
      await this.$router.push({ path: '/blocks/' });
    },
    async toAllTxs() {
      await this.$router.replace({ path: '/' });
      await this.$router.push({ path: '/transactions/' });
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  animation: show 1s 1;

  &__search_mobile {
    display: none;
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
    color: $white;
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
    &__search {
      display: none;
    }

    &__search_mobile {
      display: block;
      background: $white;
      border-radius: 6px;
      padding: 10px 14px;
      margin: 0 16px;
    }

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
