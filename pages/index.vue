<template>
  <div class="home">
    <div class="home__header">
      <div class="home__content">
        <h3 class="home__title">
          {{ currentTitle }}
        </h3>
        <search-filter :include-filter="true" />
      </div>
      <div
        class="home__statistics statistics"
      >
        <div class="statistics__info info">
          <div class="info-text">
            {{ $t('ui.statistics.info') }}
          </div>
          <div
            class="info-dropdown dropdown"
          >
            <button
              v-click-outside="closeTokens"
              class="dropdown__button dropdown__button_token"
              @click="showTokens()"
            >
              <img
                :src="require(`~/assets/img/statistics/${currentToken.toUpperCase()}.svg`)"
                :alt="currentToken"
                class="token__icon"
              >
              {{ currentToken.toUpperCase() }}
              <span class="icon-caret_down" />
              <transition name="fade">
                <div
                  v-if="isShowTokens"
                  class="token"
                >
                  <div
                    v-for="(item, i) in tokens"
                    :key="`${i}-token`"
                    class="token__container"
                  >
                    <div
                      class="token__items"
                      @click="setToken(item)"
                    >
                      <img
                        :src="require(`~/assets/img/statistics/${item}.svg`)"
                        :alt="item"
                        class="token__icon"
                      >
                      <div class="token__text">
                        {{ item.toUpperCase() }}
                      </div>
                    </div>
                  </div>
                </div>
              </transition>
            </button>
          </div>
          <div class="info-price price">
            <img
              class="icon"
              src="~assets/img/statistics/ticket.svg"
              alt="icon"
            >
            <p
              class="text"
            >
              {{ currentToken.toUpperCase() }} {{ $t('ui.statistics.price') }}
            </p>
            <p
              class="value"
            >
              $0.0005
            </p>
          </div>
          <div class="info-capitalization capitalization">
            <img
              class="icon"
              src="~assets/img/statistics/market-cap.svg"
              alt="icon"
            >
            <p
              class="text"
            >
              {{ currentToken.toUpperCase() }} {{ $t('ui.statistics.marketCap') }}
            </p>
            <p
              class="value"
            >
              $213 321 738 30.99
            </p>
          </div>
          <div class="info-gas gas">
            <img
              class="icon"
              src="~assets/img/statistics/min-gas.svg"
              alt="icon"
            >
            <p
              class="text"
            >
              {{ $t('ui.statistics.minGasPrice') }}
            </p>
            <p
              class="value"
            >
              0.00002 WQT
            </p>
          </div>
          <div class="info-transactions transactions">
            <img
              class="icon"
              src="~assets/img/statistics/transaction.svg"
              alt="icon"
            >
            <p
              class="text"
            >
              {{ $t('ui.txs') }}
            </p>
            <p
              class="value"
            >
              {{ txsCount }}
            </p>
          </div>
        </div>
        <div class="statistics__history history">
          <p
            class="history-chart"
          >
            {{ $t('ui.statistics.history') }}
          </p>
          <GChart
            type="LineChart"
            :data="chartData"
            :options="chartOptions"
          />
        </div>
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
import { mapActions, mapGetters } from 'vuex';
import { GChart } from 'vue-google-charts/legacy';
import ClickOutside from 'vue-click-outside';

export default {
  name: 'Home',
  layout: 'default',
  directives: {
    ClickOutside,
  },
  components: {
    GChart,
  },
  data() {
    return {
      search: '',
      limit: 5,
      offset: 0,
      blocksTableBusy: false,
      transactionsTableBusy: false,
      blocksId: 'blocks',
      transactionsId: 'transactions',
      currentTitle: '',
      isShowTokens: false,
      tokens: ['WQT'],
      currentToken: 'wqt',
      chartData: [
        // ['Year', 'Transactions'],
        // [new Date(2022, 7, 12), 150],
        // ['2022-07-13', 350],
        // [new Date(2022, 7, 15), 550],
        // [new Date(2022, 7, 19), 340],
        // [new Date(2022, 7, 22), 570],
        // [new Date(2022, 7, 26), 470],
      ],
      chartOptions: {
        curveType: 'function',
        width: 550,
        height: 150,
        chartArea: {
          width: '460',
          height: '110',
        },
        legend: {
          position: 'none',
        },
        hAxis: {
          baselineColor: '#FFF',
          gridlines: {
            color: '#FFF',
          },
          format: 'MMMM d',
          textStyle: {
            fontSize: '12',
            color: '#AAB0B9',
          },
        },
        vAxis: {
          baselineColor: '#FFF',
          gridlines: {
            color: '#FFF',
          },
          ticks: [200, 500, 800],
          textStyle: {
            fontSize: '12',
            color: '#AAB0B9',
          },
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      blocks: 'blocks/getBlocks',
      txs: 'tx/getTxs',
      WQTSymbol: 'tokens/getWQTTokenSymbol',
      WQTDecimal: 'tokens/getWQTTokenDecimals',
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
          formatter: (value) => `${this.ConvertFromDecimals(value, this.WQTDecimal, 4)} ${this.WQTSymbol}`,
        },
      ];
    },
  },
  async mounted() {
    await this.getBlocks();
    await this.getTransactions();
    await this.getTransactionsByDate();
    this.currentTitle = process.env.PRODUCTION === 'TEST' ? this.$t('home.titleTestnet') : this.$t('home.titleMainnet');
  },
  beforeDestroy() {
    this.$store.commit('tx/resetTxs');
    this.$store.commit('blocks/resetBlocksInfo');
  },
  methods: {
    ...mapActions({
      getTransactionsByTime: 'tx/getTransactionsByTime',
    }),
    showTokens() {
      this.isShowTokens = !this.isShowTokens;
    },
    closeTokens() {
      this.isShowTokens = false;
    },
    setToken(item) {
      this.currentToken = item;
      this.closeTokens();
    },
    async getTransactionsByDate() {
      const dayTo = new Date().toISOString();
      const currentDay = new Date();
      const timestamp = currentDay.setDate(currentDay.getDate() - 14);
      const dayFrom = new Date(timestamp).toISOString();
      const trans = await this.getTransactionsByTime({ dayFrom, dayTo });
      console.log(trans.result.count);
      let min = trans.result.count[0].count;
      let max = trans.result.count[0].count;
      trans.result.count.forEach((item) => {
        if (+item.count > max) {
          max = +item.count;
        } else if (+item.count < min) {
          min = +item.count;
        }
      });
      this.chartOptions.vAxis.ticks = [min, max];
      this.chartData = trans.result.count.reduce((acc, item) => [...acc, [new Date(item.date), +item.count]], [['Year', 'Transactions']]);
      console.log(this.chartData);
    },
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
defs {
  display: none;
}
.home {
  animation: show 1s 1;

  &__header {
    background: $darkblue;
    height: 350px;
    display: flex;
    flex-direction: column;
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

  &__statistics {
    display: flex;
    margin-bottom: 30px;
    justify-content: space-between;
    width: 100%;
    max-width: 1160px;
  }
}

.statistics {
  &__info, &__history {
    width: 100%;
    max-width: 570px;
    background-color: $white;
    padding: 27px 20px 20px;
    border-radius: 7px;
    color: $black800;
  }
}

.info {
  display: grid;
  grid-template-columns: 230px 280px;
  grid-template-rows: 46px 50px 50px;
  gap: 20px 20px;
  grid-template-areas:
    "info-text info-dropdown"
    "info-price info-capitalization"
    "info-gas info-transactions";
  align-items: center;
  &-text {
    grid-area: info-text;
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
  }

  &-dropdown {
    grid-area: info-dropdown;
  }

  &-price {
    grid-area: info-price;
  }

  &-capitalization {
    grid-area: info-capitalization;
  }

  &-gas {
    grid-area: info-gas;
  }

  &-transactions {
    grid-area: info-transactions;
  }
}
.price, .capitalization, .gas, .transactions {
  display: grid;
  grid-template-columns: 32px max-content;
  grid-template-rows: 21px 21px;
  gap: 8px 10px;
  grid-template-areas:
    "icon text"
    "icon value";
  align-items: center;
  .icon {
    grid-area:icon;
  }

  .text {
    grid-area: text;
    color: #AAB0B9;
  }

  .value {
    grid-area: value;
  }
}

.history {
  &-chart {
    font-weight: 600;
    font-size: 24px;
    line-height: 32px;
  }
}

.dropdown {
  &__button {
    @include text-simple;
    @include normal-font-size;
    line-height: 130%;
    color: $black600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 11px 15px;
    border-radius: 6px;
    width: 43px;
    height: 43px;
    border: 1px solid transparent;

    &:hover {
      border: 1px solid $black100;
    }

    span {
      color: $black400;
      font-size: 24px;
    }

    &_profile {
      position: relative;
    }

    &_menu {
      position: relative;
      display: none;
    }

    &_notify {
      position: relative;
    }

    &_token {
      width: 140px;
      height: 46px;
      position: relative;
      margin-left: auto;
    }

    &_networks {
      width: 110px;
      height: 46px;
    }
  }
}

.token {
  position: absolute;
  top: 47px;
  right: 0;
  background: $white;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 140px;
  z-index: 10000000;

  &__items {
    padding: 10px 15px;
    display: grid;
    align-items: center;
    grid-template-columns: 24px 1fr;
  }

  & .networks {
    grid-template-columns: 80px;
  }

  &__item {
    display: grid;
    grid-template-columns: 15px 1fr;
    grid-gap: 10px;
    align-items: center;
    min-height: 20px;
  }

  &__icon {
    border-radius: 50%;
    max-width: 24px;
  }

  &__text {
    @include text-simple;
    @include normal-font-size;
    font-weight: 500;
    color: $black500;
  }
}

.table__link {
  text-align: right;
}

@include _767 {
  .home {
    &__header {
      height: 300px;
    }

    &__title {
      font-size: 28px;
      max-width: 100%;
      margin-left: 16px;
    }
  }
}
</style>
