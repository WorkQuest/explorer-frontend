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
    <div class="home__tables">
      <div class="home__table">
        <table-blocks
          id="home-blocks"
          :items="blocks"
          :fields="tableHeadersBlocks"
        >
          <template v-slot:table-caption>
            <div class="table__titles">
              <span class="table__title">{{ $tc('ui.latestBlocks') }}</span>
              <nuxt-link
                class="table__link"
                to="/blocks"
              >
                {{ $t('ui.allBlocks') }}
              </nuxt-link>
            </div>
          </template>
        </table-blocks>
      </div>
      <div class="home__table">
        <table-txs
          id="home-transactions"
          :items="txs"
          :fields="tableHeadersTxs"
        >
          <template #table-caption>
            <div class="table__titles">
              <span class="table__title">{{ $tc('ui.latestTxs') }}</span>
              <nuxt-link
                class="table__link"
                to="/tx"
              >
                {{ $t('ui.allTxs') }}
              </nuxt-link>
            </div>
          </template>
        </table-txs>
      </div>
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
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      blocks: 'blocks/getBlocks',
      txs: 'tx/getTxs',
    }),
    payload() {
      return {
        limit: this.limit,
        offset: this.offset,
      };
    },
    tableHeadersBlocks() {
      return [
        {
          key: 'number', label: this.$t('ui.block.blockNumber'), sortable: true,
        },
        {
          key: 'timestamp', label: this.$t('ui.block.age'), sortable: true,
        },
        {
          key: 'transactionsCount', label: this.$t('ui.block.txsCount'), sortable: true,
        },
        {
          key: 'reward', label: this.$t('ui.block.reward'), sortable: true,
        },
      ];
    },
    tableHeadersTxs() {
      return [
        {
          key: 'hash', label: this.$t('ui.tx.transaction'), sortable: true,
        },
        {
          key: 'from_address_hash.hex', label: this.$t('ui.tx.from'), sortable: true,
        },
        {
          key: 'to_address_hash.hex', label: this.$t('ui.tx.to'), sortable: true,
        },
        {
          key: 'value', label: this.$t('ui.tx.amount'), sortable: true,
        },
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
    this.$store.commit('blocks/resetBlocksInfo');
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
  }

  &__tables {
    @include container
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
}

.table__link {
  text-align: right;
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
  }
}
</style>
