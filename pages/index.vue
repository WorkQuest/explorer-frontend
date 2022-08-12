<template>
  <div class="home">
    <div class="home__header">
      <div class="home__content">
        <h3 class="home__title">
          {{ currentTitle }}
        </h3>
        <search-filter :include-filter="true" />
      </div>
      <div class="home__statistics statistics">
        <div class="statistics__info info">
          <div class="info-text">
            {{ $t('ui.statistics.info') }}
          </div>
          <div class="info-dropdown dropdown">
            <button
              v-click-outside="closeTokens"
              class="dropdown__button dropdown__button_token"
              @click="showTokens"
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
          <div
            v-for="(item, i) in statisticsBlocks"
            :key="i"
          >
            <div :class="`info-${item.class} ${item.class}`">
              <img
                :class="item.img.class"
                :src="require(`~/assets/img/statistics/${item.img.icon}.svg`)"
                :alt="item.img.alt"
              >
              <p class="text">
                {{ item.text }}
              </p>
              <p
                v-if="item.value"
                class="value"
              >
                {{ item.value }}
              </p>
              <div
                v-else
                class="loader-cont"
              >
                <loader
                  class="loader-cont__loader"
                  is-mini-loader
                />
              </div>
            </div>
          </div>
        </div>
        <div class="statistics__history history">
          <p class="history-chart">
            {{ $t('ui.statistics.history') }}
          </p>
          <Chart />
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
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import ClickOutside from 'vue-click-outside';
import BigNumber from 'bignumber.js';
import Chart from '~/components/Chart';

export default Vue.extend({
  name: 'Home',
  layout: 'default',
  directives: {
    ClickOutside,
  },
  components: {
    Chart,
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
    };
  },
  computed: {
    ...mapGetters({
      blocks: 'blocks/getBlocks',
      txs: 'tx/getTxs',
      WQTSymbol: 'tokens/getWQTTokenSymbol',
      WQTDecimal: 'tokens/getWQTTokenDecimals',
      txsCount: 'tx/getTxsCount',
      getPrice: 'statistics/getPrice',
      getGasPrice: 'statistics/getGasPrice',
      getSupply: 'tokens/getSupply',
    }),
    statisticsBlocks() {
      return [
        {
          class: 'price',
          img: {
            class: 'icon',
            icon: 'ticket',
            alt: 'icon ticket',
          },
          text: this.$t('ui.statistics.price'),
          value: `$${this.getPrice}`,
        },
        {
          class: 'capitalization',
          img: {
            class: 'icon',
            icon: 'market-cap',
            alt: 'icon market-cap',
          },
          text: this.$t('ui.statistics.marketCap'),
          value: `$${(this.FormattingLargeNumber(this.calcMarketCap)).toFixed(2)}`,
        },
        {
          class: 'gas',
          img: {
            class: 'icon',
            icon: 'min-gas',
            alt: 'icon min-gas',
          },
          text: this.$t('ui.statistics.minGasPrice'),
          value: this.CurrentGasPrice,
        },
        {
          class: 'transactions',
          img: {
            class: 'icon',
            icon: 'transaction',
            alt: 'icon transaction',
          },
          text: this.$t('ui.txs'),
          value: this.txsCount,
        },
      ];
    },
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
    CurrentGasPrice() {
      return this.getGasPrice
        ? `${this.FormatSmallNumber(new BigNumber(this.getGasPrice).shiftedBy(-18))} WQT`
        : this.$t('ui.loading');
    },
    calcMarketCap() {
      return new BigNumber(this.getSupply).shiftedBy(-18) * this.getPrice;
    },
  },
  async mounted() {
    await this.getAllData();
    this.currentTitle = process.env.PRODUCTION === 'TEST' ? this.$t('home.titleTestnet') : this.$t('home.titleMainnet');
  },
  beforeDestroy() {
    this.$store.commit('tx/resetTxs');
    this.$store.commit('blocks/resetBlocksInfo');
  },
  methods: {
    ...mapActions({
      transactionsByTime: 'statistics/getTransactionsByTime',
      priceByTimestamp: 'statistics/getPriceByTimestamp',
      priceCoingecko: 'statistics/getPriceInCoingecko',
      circulatingSupply: 'tokens/getCirculatingSupply',
      gasPrice: 'statistics/getGasPrice',
    }),
    async getAllData() {
      await Promise.all([
        this.circulatingSupply(),
        this.gasPrice(),
        this.priceByTimestamp(this.$moment().unix()),
        this.getBlocks(),
        this.getTransactions(),
      ]);
    },
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
});
</script>

<style lang="scss" scoped>
:deep(.google-visualization-tooltip) {
  border-radius: 8px;
  border: 1px solid #F7F8FA;
  width: 140px!important;
  height: 45px!important;
}
:deep(.google-visualization-tooltip-item span) {
  font-family: 'Inter',sans-serif!important;
}
:deep(.google-visualization-tooltip-item) {
  margin: 0.2em 0 0.2em 0!important;
}
:deep(.google-visualization-tooltip-item span) {
  color: #AAB0B9!important;
  font-size: 12px!important;
  font-weight: 400!important;
}
:deep(.google-visualization-tooltip-item:nth-child(2)){
  display: flex;
}
:deep(.google-visualization-tooltip-item span:nth-child(2)) {
  color: black!important;
  padding-left: 5px;
}
</style>

<style lang="scss" scoped>
.loader-cont {
  height: 20px;
  width: 20px;
  position: relative;

  &__loader {
    position: absolute !important;
    background: transparent !important;
  }
}

.home {
  animation: show 1s 1;

  &__header {
    background: $darkblue;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }

  &__content {
    @include container;
    margin-top: 30px;
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
    @include container;
    display: flex;
    margin-bottom: 30px;
    justify-content: space-between;
  }
}

.statistics {
  &__info, &__history {
    width: 100%;
    max-width: 570px;
    background-color: $white;
    padding: 20px;
    border-radius: 7px;
    color: $black800;
  }
}

.statistics {
  &__history {
    padding: 27px 20px 20px;
  }
}

.info {
  margin-right: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 46px 50px 50px;
  gap: 20px 20px;
  grid-template-areas:
    "info-text info-dropdown"
    "info-price info-capitalization"
    "info-transactions info-gas";
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

@include _1199 {
  .home {
    &__statistics {
      padding: 0 20px;
    }
  }
}

@include _1080 {
  .home {
    &__header {
      align-items: flex-start;
    }
  }

  .statistics {
    &__history {
      max-width: unset;
    }
  }

  .info {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 46px 50px 50px 50px 50px 50px;
    gap: 20px 20px;
    grid-template-areas:
    "info-text"
    "info-dropdown"
    "info-price"
    "info-capitalization"
    "info-transactions"
    "info-gas";
    align-items: center;
  }

  .dropdown {
    &__button {
      &_token {
        margin-left: unset;
        margin-right: auto;
      }
    }
  }
}

@include _769 {
  .home {
    &__statistics {
      flex-direction: column;
      margin-bottom: 0;
    }
  }
  .info {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 46px 50px 50px;
    gap: 20px 20px;
    grid-template-areas:
    "info-text info-dropdown"
    "info-price info-capitalization"
    "info-transactions info-gas";
    align-items: center;
    margin-bottom: 20px;
    max-width: none;
  }
  .history {
    margin-bottom: 20px;
  }
}

@include _767 {
  .home {
    &__statistics {
      padding: 0 10px;
    }

    &__title {
      font-size: 28px;
      max-width: 100%;
      margin: 10px 0 0 16px;
    }
  }
  .statistics {
    width: 100%;
    &__info {
      max-width: unset;
    }
  }
}

@include _575 {
  .info {
    display: grid;
    grid-template-columns: max-content;
    grid-template-rows: 50px 50px 50px 50px 50px 50px;
    gap: 20px 20px;
    grid-template-areas:
    "info-text"
    "info-dropdown"
    "info-price"
    "info-capitalization"
    "info-gas"
    "info-transactions";
  }

  .dropdown__button {
    &_token {
      margin: 0 auto 0 0;
    }
  }
}

@include _480 {
  .info {
    grid-template-rows: 32px 46px 50px 50px 50px 50px;
  }
  .statistics {
    &__info, &__history {
      padding: 10px;
    }
  }
}
</style>
