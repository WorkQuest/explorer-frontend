<template>
  <div
    v-if="!isLoading"
    class="transaction-wrapper"
  >
    <div class="txs">
      <search-filter class="txs__search" />
      <div class="txs__content">
        <button
          class="txs__back"
          type="button"
          @click="back()"
        >
          <span class="icon-short_left" />
          {{ $t('ui.back') }}
        </button>
        <h3 class="txs__title">
          {{ $t('ui.tx.txDetails') }}
        </h3>
        <div class="txs__info">
          <div class="tab">
            <span
              v-for="(tab, i) in tabs"
              :key="i"
              class="tab__item"
              :class="{ 'tab__item_active': activeTab === tab} "
              @click="onClick(tab)"
            >{{ $t(`ui.token.${tab}`) }}</span>
          </div>
          <div
            v-if="txsColumns.length > 0 && activeTab === 'overview'"
            id="overview"
            class="overview"
          >
            <div class="overview__desktop txs__columns columns">
              <info-item
                v-for="(item, i) in txsColumns"
                :key="i"
                :class="item.class"
                :title="item.title"
                :info="item.info"
                :note="item.note"
                :item="item.item"
              >
                <template
                  v-if="item.item === 'timestamp'"
                  #timestamp
                >
                  {{ dateFromNow }}
                </template>
              </info-item>
            </div>
            <div class="overview__mobile">
              <div class="overview__hash">
                <p>{{ $t('ui.tx.transaction') }}</p>

                <nuxt-link
                  class="overview__link"
                  :to="`/tx/${(tx.hash)}`"
                >
                  {{ formatItem(tx.hash, 9, 6) }}
                </nuxt-link>
                <button-copy
                  v-if="tx.hash"
                  :value="tx.hash"
                  icon-color="primary"
                />
              </div>
              <p class="overview__timestamp">
                {{ dateFromNow }}
              </p>
              <div class="overview__subtitle">
                {{ $t('ui.tx.status') }}
                <p
                  v-if="tx.status"
                  class="overview__status"
                  :class="{'overview__status_green': tx.status === 1, 'overview__status_red': tx.status === 2}"
                >
                  {{ tx.status === 1 ? this.$t('ui.tx.transactionSuccess') : this.$t('ui.tx.transactionFail') }}
                </p>
              </div>
              <div class="overview__subtitle">
                {{ $t('ui.block.blockNumber') }}
                <nuxt-link
                  v-if="tx.block_number"
                  class="overview__link_small"
                  :to="`/blocks/${tx.block_number}`"
                >
                  {{ tx.block_number }}
                </nuxt-link>
              </div>
              <div class="overview__subtitle">
                {{ $t('ui.tx.from') }}
                <nuxt-link
                  v-if="tx.from_address_hash"
                  class="overview__link_small"
                  :to="`/address/${tx.from_address_hash.hex}`"
                >
                  {{ formatItem(tx.from_address_hash.hex, 7, 6) }}
                </nuxt-link>
                <button-copy
                  v-if="tx.from_address_hash"
                  :value="tx.from_address_hash.hex"
                  icon-color="primary"
                />
              </div>
              <div class="overview__subtitle">
                {{ $t('ui.tx.to') }}
                <nuxt-link
                  v-if="tx.to_address_hash"
                  class="overview__link_small"
                  :to="`/address/${tx.to_address_hash.hex}`"
                >
                  {{ formatItem(tx.to_address_hash.hex, 7, 6) }}
                </nuxt-link>
                <button-copy
                  v-if="tx.to_address_hash"
                  :value="tx.to_address_hash.hex"
                  icon-color="primary"
                />
              </div>
              <div class="overview__subtitle">
                {{ $t('ui.tx.value') }}
                <span class="overview__info">{{ value }} {{ symbol }}</span>
              </div>
              <div class="overview__subtitle  overview__subtitle_underlined">
                {{ $t('ui.tx.fee') }}
                <span class="overview__info">{{ NumberFormat(fee) }}</span>
              </div>
              <div class="overview__subtitle">
                {{ $t('ui.block.gasLimit') }}
                <span class="overview__info">{{ NumberFormat(gasLimit) }}</span>
              </div>
              <div class="overview__subtitle">
                {{ $t('ui.block.gasUsed') }}
                <span class="overview__info">{{ NumberFormat(gasUsed) }} ({{ NumberFormat((gasUsed / gasLimit) * 100, 4) }}%) </span>
              </div>
              <div class="overview__subtitle">
                {{ $t('ui.tx.gasPrice') }}
                <span class="overview__info">{{ gasPrice }}</span>
              </div>
            </div>
          </div>
          <!-- logs -->
          <div
            v-if="tx && activeTab === 'logs'"
            id="logs"
            class="txs__logs logs"
          >
            <template v-if="Array.isArray(tx.logs) && tx.logs.length === 0">
              <empty-data :description="$tc('ui.tx.noLogs')" />
            </template>
            <div
              v-else
              class="content"
            >
              <p
                v-if="Array.isArray(tx.logs) && tx.logs.length > 0"
                class="content__header"
              >
                {{ $t('ui.tx.logs') }}
              </p>

              <div class="content__table log">
                <p
                  v-if="Array.isArray(tx.logs) && tx.logs.length > 0"
                  class="log__title"
                >
                  {{ $t('ui.tx.transactionFull') }}
                </p>
                <span
                  v-if="tx.hash"
                  class="log__number"
                >
                  {{ tx.hash }}
                </span>
                <template v-for="(item, index) in tx.logs">
                  <template v-if="item.first_topic">
                    <p
                      :key="`${index}_title`"
                      class="log__title"
                    >
                      {{ $t('ui.tx.topics') }}
                    </p>
                    <div
                      :key="`${index}_firstTopic`"
                      class="log__topic"
                    >
                      <div class="topic">
                        <p class="topic__index">
                          0
                        </p>
                        <p class="topic__item">
                          {{ item.first_topic }}
                        </p>
                      </div>
                      <div
                        v-if="item.second_topic"
                        :key="`${index}_secondTopic`"
                        class="topic"
                      >
                        <p class="topic__index">
                          1
                        </p>
                        <p class="topic__item">
                          {{ item.second_topic }}
                        </p>
                      </div>
                      <div
                        v-if="item.third_topic"
                        :key="`${index}_thirdTopic`"
                        class="topic"
                      >
                        <p class="topic__index">
                          2
                        </p>
                        <p class="topic__item">
                          {{ item.third_topic }}
                        </p>
                      </div>
                      <div
                        v-if="item.fourth_topic"
                        :key="`${index}_fourthTopic`"
                        class="topic"
                      >
                        <p class="topic__index">
                          3
                        </p>
                        <p class="topic__item">
                          {{ item.fourth_topic }}
                        </p>
                      </div>
                    </div>
                    <p
                      :key="`${index}_dataTitle`"
                      class="log__title"
                    >
                      {{ $t('ui.tx.data') }}
                    </p>
                    <div
                      :key="`${index}_dataContent`"
                      class="log__data"
                    >
                      <div class="log__data">
                        {{ item.data }}
                      </div>
                    </div>
                  </template>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';

export default {
  name: 'Block',
  data() {
    return {
      tabs: ['overview', 'logs'],
      activeTab: 'overview',
      timer: null,
      time: Date.now(),
      minute: 60000,
    };
  },
  computed: {
    ...mapGetters({
      tx: 'tx/getTxsByHash',
      symbol: 'tokens/getWUSDTokenSymbol',
      decimals: 'tokens/getWUSDTokenDecimals',
      isLoading: 'main/getIsLoading',
    }),
    gasLimit() {
      return +this.tx?.block?.gas_limit || 0;
    },
    gasUsed() {
      return +this.tx?.gas_used || 0;
    },
    gasPrice() {
      return this.NumberFormat(this.tx?.gas_price || 0);
    },
    fee() {
      return new BigNumber(this.tx.gas_price * this.gasUsed).toString();
    },
    value() {
      return this.ConvertFromDecimals(this.tx?.value, this.decimals);
    },
    txsColumns() {
      if (typeof this.tx === 'object' && Object.keys(this.tx).length > 0) {
        return [
          {
            class: 'columns__item_six',
            title: this.$t('ui.tx.transactionFull'),
            info: this.tx.hash,
          },
          {
            class: 'columns__item_two-one',
            title: this.$t('ui.timestamp'),
            info: this.tx.block.timestamp,
            note: this.$moment(this.tx.block.timestamp)
              .format('MMM-DD-YYYY HH:mm:ss A +UTC'),
            item: 'timestamp',
          },
          {
            class: 'columns__item_two-two',
            title: this.$t('ui.tx.status'),
            info: this.tx.status,
            item: 'status',
            note: this.tx.error,
          },
          {
            class: 'columns__item_two-three',
            title: this.$t('ui.block.block'),
            info: this.tx.block_number,
            item: 'link',
          },
          {
            class: 'columns__item_three-one',
            title: this.$t('ui.tx.from'),
            info: this.tx.from_address_hash.hex,
            item: 'address',
          },
          {
            class: 'columns__item_three-two',
            title: this.$t('ui.tx.to'),
            info: this.tx.to_address_hash ? this.tx.to_address_hash.hex : null,
            item: 'address',
          },
          {
            class: 'columns__item_three-one',
            title: this.$t('ui.tx.value'),
            info: this.ConvertFromDecimals(this.tx.value, this.decimals),
          },
          {
            class: 'columns__item_three-two',
            title: this.$t('ui.tx.gasPrice'),
            info: this.NumberFormat(this.tx.gas_price),
          },
          {
            class: 'columns__item_four-one',
            title: this.$t('ui.block.gasLimit'),
            info: this.gasLimit,
          },
          {
            class: 'columns__item_four-two',
            title: this.$t('ui.tx.gasUsed'),
            info: `${this.gasUsed} (${this.NumberFormat((this.gasUsed / this.gasLimit) * 100, 4)}%)`,
          },
          {
            class: 'columns__item_four-three',
            title: this.$t('ui.tx.feeFull'),
            info: `${this.fee} ${this.symbol}`,
          },
        ];
      }
      return [];
    },
    txsLogs() {
      return [
        { class: 'table__number_desktop', text: this.tx.hash },
        { class: 'table__number_mobile', text: this.formatItem(this.tx.hash, 9, 6) },
      ];
    },
    hash() {
      return this.$route.hash;
    },
    historyPath() {
      return sessionStorage.getItem('backRoute');
    },
    dateFromNow() {
      return this.time && this.formatDataFromNow(this.tx.block.timestamp);
    },
  },
  watch: {
    async hash(current, previous) {
      if (current !== previous) {
        await this.hashNavigation();
      }
    },
  },
  async beforeCreate() {
    await this.$store.dispatch('tx/getTxsByHash', this.$route.params.id);
  },
  async mounted() {
    await this.SetLoader(true);
    await this.hashNavigation();
    await this.SetLoader(false);
    clearInterval(Number(this.timer));
    this.timer = setInterval(() => {
      this.time = Date.now();
    }, this.minute);
  },
  beforeDestroy() {
    clearInterval(Number(this.timer));
    this.$store.commit('tx/resetTxsByHash');
  },
  methods: {
    onClick(tab) {
      this.activeTab = tab;
      this.$router.push({ hash: `#${tab}` });
    },
    async hashNavigation() {
      if (this.hash) {
        await this.$router.push({ hash: this.hash });
        const replacedHash = this.hash ? this.hash.replace('#', '') : '';
        this.activeTab = this.tabs.includes(replacedHash) ? replacedHash : this.tabs[0];
      }
    },
    back() {
      if (this.historyPath) {
        this.$router.push(this.historyPath);
      } else {
        this.$router.push('/tx');
      }
    },
  },
};
</script>
<style lang="scss" scoped>

.btn {
  &__copy {
    height: 35px;
    width: 35px;
    align-items: center;
    justify-items: center;
    background: $white;
    border: 1px solid $black0;
    padding: 5px;
    border-radius: 6px;
    transition: .5s;

    &:hover {
      background: $black100;
    }
  }
}

.txs {
  animation: show 1s 1;
  @include container;

  &__search {
    margin: 30px 0;
  }

  &__back {
    @include text-simple;
    @include normal-font-size;
    text-decoration: none;
    font-size: 18px;
    color: $black600;
    cursor: pointer;
    display: flex;
    align-items: center;

    &:hover {
      text-decoration: none;
    }
  }

  &__title {
    @include text-simple;
    font-weight: 600;
    font-size: 28px;
    line-height: 36px;
    margin: 15px 0 10px 0;
  }

  &__info {
    padding: 20px;
    background: $white;
    border-radius: 6px;
  }

  &__columns {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 20px;
    margin-top: 28px;
  }
  &__mobile {
    display: none;
  }

  &__logs {
    margin-top: 25px;
  }
}

.tab {
  margin-bottom: 30px;
  &__item {
    @include text-simple;
    margin-right: 20px;
    padding-bottom: 12px;
    color: $black500;
    cursor: pointer;
    &_active {
      @include text-simple;
      border-bottom: 2px solid $blue;
    }
  }
}

.columns {
  &__item {
    &_six {
      grid-column: 1 / span 6;
    }

    &_four {
      &-one {
        grid-column: 1 / span 2;
      }

      &-two {
        grid-column: 3 / span 2;
      }

      &-three {
        grid-column: 5 / span 2;
      }
    }

    &_three {
      &-one {
        grid-column: 1 / span 3;
      }

      &-two {
        grid-column: 4 / span 3;
      }
    }

    &_two {
      &-one {
        grid-column: 1 / span 2;
      }

      &-two {
        grid-column: 3 / span 2;
      }

      &-three {
        grid-column: 5 / span 2;
      }
    }
  }
}

.content {
  display: flex;
  flex-direction: column;
  &__header {
    @include text-simple;
    font-size: 20px;
    margin-bottom: 20px;
  }
  &__table {
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-gap: 10px;
  }
}

.log {
  &__title {
    @include text-simple;
    font-weight: 600;
    text-align: right;
    margin: 0;
  }
  &__topic {
    display: flex;
    flex-direction: column;
  }
  &__data {
    @include text-simple;
    margin-bottom: 20px;
    overflow-wrap: anywhere;
    max-width: 600px;
    text-align: justify;
  }
  &__number {
    @include text-simple;
    color: $blue;
    margin-bottom: 5px;
    overflow-wrap: anywhere;
  }
}

.topic {
  display: flex;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 5px;
  }
  &__index {
    @include text-simple;
    background: $black100;
    color: $black600;
    text-align: center;
    border-radius: 3px;
    width: 21px;
    height: 21px;
    margin-right: 10px;
    font-size: 12px;
    padding-right: 5px;
    padding-left: 5px;
  }
  &__item {
    @include text-simple;
    overflow-wrap: anywhere;
  }
}

.icon-short_left {
  color: $black600;
  font-size: 22px;
  margin-right: 12px;
}

.overview {
  &__desktop {
    display: grid;
  }
  &__mobile {
    display: none;
  }
}

@include _991 {
  .txs {
    &__info {
      padding: 16px;
    }
  }
  .overview {
    &__mobile {
      display: grid;
      background: $white;
    }

    &__desktop {
      display: none;
    }

    &__hash {
      font-weight: 600;
      font-size: 14px;
      color: $black300;
    }

    &__link {
      @include link;
      color: $blue !important;
      font-size: 20px;
      font-weight: normal;
    }

    &__timestamp {
      font-weight: normal;
      font-size: 14px;
      color: $black400;
      justify-self: end;
    }

    &__subtitle {
      display: flex;
      gap: 10px;
      font-weight: 600;
      grid-column: 1/3;
      margin-top: 11px;
      align-items: center;

      &_underlined {
        padding-bottom: 15px;
        border-bottom: 1px solid $black100;
      }
    }

    &__link_small {
      @include text-simple;
      @include normal-font-size;
      @include link;
      margin-left: 10px;
    }

    &__info {
      font-weight: normal;
      margin-left: 10px;
    }

    &__status {
      @include text-simple;
      word-break: break-all;
      padding: 4px 5px;
      font-size: 12px;
      line-height: 130%;
      border-radius: 6px;
      width: 61px;
      &_green {
        background: $green100;
        color: $green;
        text-align: center;
        display: inline-block;
      }

      &_red {
        background: rgba(223, 51, 51, 0.1);
        color: $red;
        text-align: center;
        display: inline-block;
      }

      &_error-text {
        width: auto;
        color: $red;
      }
    }
  }

  .log__title {
    text-align: left;
  }

  .content__table {
    grid-template-columns: 1fr
  }

  .table__title {
    text-align: left;
  }

  .icon-copy {
    color: $blue;
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
