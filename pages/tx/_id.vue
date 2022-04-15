<template>
  <div class="txs">
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
      >
        <div class="columns">
          <template v-if="isTxLoading">
            <info-item
              v-for="(item, i) in txsColumns"
              :key="`txs-item-loader-${i}`"
              :class="item.class"
              :title="item.title"
              :is-info-loading="true"
            />
          </template>
          <template v-else>
            <info-item
              v-for="(item, i) in txsColumns"
              :key="`txs-item-${i}`"
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
          </template>
        </div>
      </div>
      <tx-logs
        v-if="tx && activeTab === 'logs'"
        id="logs"
        :logs="tx.logs"
        :hash="tx.hash"
      />
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
      isTxLoading: true,
    };
  },
  computed: {
    ...mapGetters({
      tx: 'tx/getTxsByHash',
      symbol: 'tokens/getWUSDTokenSymbol',
      decimals: 'tokens/getWUSDTokenDecimals',
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
            info: this.tx.from_address_hash.bech32,
            item: 'address',
          },
          {
            class: 'columns__item_three-two',
            title: this.$t('ui.tx.to'),
            info: this.tx.to_address_hash ? this.tx.to_address_hash.bech32 : null,
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
    this.isTxLoading = true;
    await this.$store.dispatch('tx/getTxsByHash', this.$route.params.id);
    this.isTxLoading = false;
  },
  async mounted() {
    await this.hashNavigation();
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
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 20px;
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

.icon-short_left {
  color: $black600;
  font-size: 22px;
  margin-right: 12px;
}

@include _991 {
  .txs {
    &__info {
      padding: 16px;
    }
  }
  .columns {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  ::v-deep .item {
    display: flex;
    align-items: center;
    &__header {
      margin-right: 10px;
      align-self: flex-start;
      margin-bottom: 0;
    }
    &__note.item__note_red {
      & > span {
        visibility: hidden;
      }
    }
    &:nth-child(1) {
      // hash
      flex-direction: column;
      order: 1;
    }
    &:nth-child(1) .item__header {
      margin-bottom: 5px;
      color: $black300;
    }
    &:nth-child(1) .item__info {
      color: $blue;
      font-size: 20px;
      font-weight: 400;
      align-self: flex-start;
    }
    &:nth-child(2) {
      // timestamp
      order: 2;
      margin-bottom: -25px;
    }
    &:nth-child(2) .item__info {
      position: absolute;
      right: 0;
      top: 4px;
      color: $black300;
      font-size: 14px;
    }
    &:nth-child(2) .item__header {
      display: none;
    }
    &:nth-child(2) .item__note {
      display: none;
    }
    &:nth-child(3) {
      // status
      order: 3;
    }
    &:nth-child(4) {
      // block
      order: 4;
    }
    &:nth-child(5) {
      // from
      order: 5;
    }
    &:nth-child(6) {
      // to
      order: 6;
    }
    &:nth-child(7) {
      // value
      order: 7;
    }
    &:nth-child(8) {
      // gas price
      order: 9;
    }
    &:nth-child(9) {
      // gas limit
      order: 10;
    }
    &:nth-child(10) {
      // gas used
      order: 11;
    }
    &:nth-child(11) {
      // fee
      order: 8;
      padding-bottom: 10px;
      border-bottom: 1px solid $black100;
    }
  }
}

@include _767 {
  .txs {
    background: $white;
    padding-top: 22px;
  }
  ::v-deep .item {
    &__info_blue {
      font-size: 18px;
    }
  }
}
</style>
