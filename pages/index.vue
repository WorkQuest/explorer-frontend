<template>
  <div class="home">
    <div class="home__header">
      <div class="home__content">
        <h3 class="home__title">
          {{ $t('home.title') }}
        </h3>
        <search-filter
          :include-filter="true"
          class="home__search"
        />
      </div>
    </div>
    <div class="home__tables">
      <div class="home__table">
        <base-table
          :id="`home-${blocksId}`"
          :items="blocks"
          :fields="tableHeadersBlocks"
          :table-busy="blocksTableBusy"
          :type="blocksId"
          :skeleton="{rows: limit, columns: tableHeadersBlocks.length}"
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
        </base-table>
      </div>
      <div class="home__table">
        <base-table
          :id="`home-${transactionsId}`"
          :items="txs"
          :fields="tableHeadersTxs"
          :table-busy="transactionsTableBusy"
          :type="transactionsId"
          :skeleton="{rows: limit, columns: tableHeadersTxs.length}"
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
        </base-table>
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
      blocksTableBusy: false,
      transactionsTableBusy: false,
      blocksId: 'blocks',
      transactionsId: 'transactions',
    };
  },
  computed: {
    ...mapGetters({
      blocks: 'blocks/getBlocks',
      txs: 'tx/getTxs',
      WUSDSymbol: 'tokens/getWUSDTokenSymbol',
      WUSDDecimal: 'tokens/getWUSDTokenDecimals',
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
          key: 'blockNumber',
          label: this.$t('ui.block.blockNumber'),
          formatter: (value, key, item) => item.number,
        },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          formatter: (value, key, item) => this.formatDataFromNow(item.timestamp),
        },
        {
          key: 'transactionsCount',
          label: this.$t('ui.block.txsCount'),
        },
        {
          key: 'gasUsed',
          label: this.$t('ui.block.gasUsed'),
          formatter: (value, key, item) => [
            {
              value: +item.gas_used,
              class: '',
            },
            {
              value: `${this.NumberFormat((+item.gas_used / +item.gas_limit) * 100, 4)}%`,
              class: 'grey',
            },
          ],
        },
        {
          key: 'gasLimit',
          label: this.$t('ui.block.gasLimit'),
          formatter: (value, key, item) => this.NumberFormat(item.gas_limit),
        },
      ];
    },
    tableHeadersTxs() {
      return [
        {
          key: 'hash',
          label: this.$t('ui.tx.transaction'),
        },
        {
          key: 'addressFrom',
          label: this.$t('ui.tx.from'),
          formatter: (value, key, item) => item.from_address_hash?.bech32 || '',
        },
        {
          key: 'addressTo',
          label: this.$t('ui.tx.to'),
          formatter: (value, key, item) => item.to_address_hash?.bech32 || '',
        },
        {
          key: 'value',
          label: this.$t('ui.tx.value'),
          formatter: (value) => `${this.ConvertFromDecimals(value, this.WUSDDecimal, 4)} ${this.WUSDSymbol}`,
        },
      ];
    },
  },
  async mounted() {
    await this.getBlocks();
    await this.getTransactions();
  },
  beforeDestroy() {
    this.$store.commit('tx/resetTxs');
    this.$store.commit('blocks/resetBlocksInfo');
  },
  methods: {
    async getBlocks() {
      this.blocksTableBusy = true;
      await this.$store.dispatch('blocks/getBlocks', this.payload);
      this.blocksTableBusy = false;
    },
    async getTransactions() {
      this.transactionsTableBusy = true;
      await this.$store.dispatch('tx/getTxs', this.payload);
      this.transactionsTableBusy = false;
    },
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
