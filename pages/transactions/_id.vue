<template>
  <div class="transaction-wrapper">
    <div class="txs">
      <search-filter class="txs__search" />
      <base-field
        v-model="search"
        class="txs__search_mobile"
        :is-search="true"
        :is-hide-error="true"
        :placeholder="$tc('ui.forms.searchPlaceholder')"
      />
      <div class="txs__content">
        <button
          class="txs__back"
          type="button"
          @click="$router.go(-1)"
        >
          <span class="icon-short_left" />
          {{ $t('ui.back') }}
        </button>
        <h3 class="txs__title">
          {{ $t('ui.tx.txDetails') }}
        </h3>
        <div class="txs__info">
          <div class="txs__number-field">
            <span
              v-for="(tab, i) in tabs"
              :key="i"
              class="txs__tab_overview"
              :class="{txs__tab_active: activeElement === tab}"
              @click="onClick(tab)"
            >{{ $t(`ui.token.${tab}`) }}</span>
          </div>
          <div
            v-if="txsColumns.length > 0 && activeElement === 'overview'"
            class="txs__columns columns"
          >
            <info-item
              v-for="(item, i) in txsColumns"
              :key="i"
              :class="item.class"
              :title="item.title"
              :info="item.info"
              :note="item.note"
              :item="item.item"
            />
          </div>
          <!-- logs -->
          <div
            v-if="tx && activeElement === 'logs'"
            class="txs__logs logs"
          >
            <div v-if="Array.isArray(tx.logs) && tx.logs.length === 0">
              {{ $t('ui.tx.noLogs') }}
            </div>
            <div
              v-else
              class="logs__content content"
            >
              <p
                v-if="Array.isArray(tx.logs) && tx.logs.length > 0"
                class="content__header"
              >
                {{ $t('ui.tx.logs') }}
              </p>

              <div class="content__table table">
                <p
                  v-if="tx.logs.length > 0"
                  class="table__title"
                >
                  {{ $t('ui.tx.transactionFull') }}
                </p>
                <span
                  v-for="(item, i) in txsLogs"
                  :key="i"
                  class="table__number"
                  :class="item.class"
                >
                  {{ item.text }}
                </span>
                <template v-for="(item, index) in tx.logs">
                  <template v-if="item.first_topic">
                    <p
                      :key="`${index}_title`"
                      class="table__title"
                    >
                      {{ $t('ui.tx.topics') }}
                    </p>
                    <div
                      :key="`${index}_firstTopic`"
                      class="table__topic"
                    >
                      <div class="topic">
                        <p class="topic__index">
                          0
                        </p>
                        <p class="topic__item topic__item_desktop">
                          {{ item.first_topic }}
                        </p>
                        <p class="topic__item topic__item_mobile">
                          {{ formatItem(item.first_topic, 9, 6) }}
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
                        <p class="topic__item topic__item_desktop">
                          {{ item.second_topic }}
                        </p>
                        <p class="topic__item topic__item_mobile">
                          {{ formatItem(item.second_topic, 9, 6) }}
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
                        <p class="topic__item topic__item_desktop">
                          {{ item.third_topic }}
                        </p>
                        <p class="topic__item topic__item_mobile">
                          {{ formatItem(item.third_topic, 9, 6) }}
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
                        <p class="topic__item topic__item_desktop">
                          {{ item.fourth_topic }}
                        </p>
                        <p class="topic__item topic__item_mobile">
                          {{ formatItem(item.fourth_topic, 9, 6) }}
                        </p>
                      </div>
                    </div>
                    <p
                      :key="`${index}_dataTitle`"
                      class="table__title"
                    >
                      {{ $t('ui.tx.data') }}
                    </p>
                    <div
                      :key="`${index}_dataContent`"
                      class="table__data"
                    >
                      <div class="table__data_desktop">
                        {{ item.data }}
                      </div>
                      <div class="table__data_mobile">
                        {{ formatItem(item.data, 9, 6) }}
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

    <!-- mobile -->
    <div
      v-if="tx && activeElement === 'overview'"
      class="overview"
    >
      <div class="overview__hash">
        <p>{{ $t('ui.tx.transaction') }}</p>

        <nuxt-link
          class="overview__link"
          :to="`/transactions/${(tx.hash)}`"
        >
          {{ formatItem(tx.hash, 9, 6) }}
        </nuxt-link>
      </div>
      <p class="overview__timestamp">
        {{ formatDataFromNow(tx.timestamp) }}
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
        <button
          v-if="tx.from_address_hash"
          v-clipboard:copy="tx.from_address_hash.hex"
          v-clipboard:success="ClipboardSuccessHandler"
          v-clipboard:error="ClipboardErrorHandler"
          class="btn__copy"
          type="button"
        >
          <span class="icon-copy" />
        </button>
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
        <button
          v-if="tx.to_address_hash"
          v-clipboard:copy="tx.to_address_hash.hex"
          v-clipboard:success="ClipboardSuccessHandler"
          v-clipboard:error="ClipboardErrorHandler"
          class="btn__copy"
          type="button"
        >
          <span class="icon-copy" />
        </button>
      </div>
      <div class="overview__subtitle">
        {{ $t('ui.tx.amount') }}
        <span class="overview__info">{{ tx.value }} {{ symbol }}</span>
      </div>
      <div class="overview__subtitle  overview__subtitle_underlined">
        {{ $t('ui.tx.fee') }}
        <span class="overview__info">{{ fee }}</span>
      </div>
      <div class="overview__subtitle">
        {{ $t('ui.block.gasUsed') }}
        <span class="overview__info">{{ gasUsed }}</span>
      </div>
      <div class="overview__subtitle">
        {{ $t('ui.block.gasLimit') }}
        <span class="overview__info">{{ gasLimit }}</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';

/** @param { array } txsColumns[] */
/** @param {{ gas_limit: string }} tx   */
/** @param {{ gas_price: string }} tx   */
/** @param { array } tx.logs  */
/** @param {{ transaction_hash: string }} tx.logs  */
/** @param {{ first_topic: string }} tx.logs  */
/** @param {{ second_topic: string }} tx.logs  */
/** @param {{ third_topic: string }} tx.logs  */
/** @param {{ fourth_topic: string }} tx.logs  */

export default {
  name: 'Block',
  data() {
    return {
      tabs: ['overview', 'logs'],
      activeElement: 'overview',
      search: '',
    };
  },
  computed: {
    ...mapGetters({
      tx: 'tx/getTxsByHash',
      wusdTokenData: 'main/getWUSDTokenData',
    }),
    symbol() {
      return Object.keys(this.wusdTokenData).length > 0 ? this.wusdTokenData.symbol : 0;
    },
    decimals() {
      return Object.keys(this.wusdTokenData).length > 0 ? this.wusdTokenData.decimals : 0;
    },
    gasLimit() {
      return Object.keys(this.tx).length > 0 && Object.keys(this.tx.block).length > 0 ? +this.tx.block.gas_limit : 0;
    },
    gasUsed() {
      return Object.keys(this.tx).length > 0 ? +this.tx.gas_used : 0;
    },
    fee() {
      return Object.keys(this.tx).length > 0 ? new BigNumber(this.tx.gas_price * this.gasUsed)
        .shiftedBy(-this.decimals)
        .toString() : 0;
    },
    txsColumns() {
      if (Object.keys(this.tx).length > 0) {
        return [
          {
            class: 'columns__item_six',
            title: this.$t('ui.tx.transactionFull'),
            info: this.tx.hash,
          },
          {
            class: 'columns__item_two-one',
            title: this.$t('ui.timestamp'),
            info: this.formatDataFromNow(this.tx.timestamp),
            note: this.$moment(this.tx.timestamp)
              .format('MMM-DD-YYYY HH:MM:SS A +UTC'),
          },
          {
            class: 'columns__item_two-two',
            title: this.$t('ui.tx.status'),
            info: this.tx.status,
            item: 'status',
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
            info: this.NumberFormat(this.tx.value),
          },
          {
            class: 'columns__item_three-two',
            title: this.$t('ui.tx.feeFull'),
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
            info: `${this.gasUsed} (${(this.gasUsed / this.gasLimit) * 100}%)`,
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
  },
  async beforeCreate() {
    await this.$store.dispatch('tx/getTxsByHash', this.$route.params.id);
  },
  async mounted() {
    await this.SetLoader(true);
    await this.SetLoader(false);
  },
  methods: {
    onClick(tab) {
      this.activeElement = tab;
    },
  },
};
</script>
<style lang="scss" scoped>
@mixin adaptive {
  &_desktop {
    @include _767 {
      display: none;
    }
  }
  &_mobile {
    display: none;
    @include _767 {
      display: block;
    }
  }
}
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

    &_mobile {
      display: none;
    }
  }

  &__back {
    @include text-simple;
    @include normal-font-size;
    text-decoration: none;
    font-size: 18px;
    color: $black600;
    cursor: pointer;

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

  &__tab {
    &_overview, &_logs {
      @include text-simple;
      margin-right: 20px;
      padding-bottom: 12px;
      color: $black500;
      cursor: pointer;
    }

    &_active {
      @include text-simple;
      border-bottom: 2px solid $blue;
    }
  }

  &__columns {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-gap: 23px;
    margin-top: 25px;
  }

  &__logs {
    margin-top: 25px;
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

.logs {

  &__content {
    display: flex;
    flex-direction: column;
  }

  &__topic {
    display: flex;
  }

  &__info {
    margin-left: 10px;
    @include adaptive
  }

  &__title {
    @include text-simple;
    font-weight: 600;
  }

  &__item {
    &_mobile {
      display: none;
    }
  }

  &__block {
    display: flex;
    flex-direction: column;
  }
}

.block {
  &__topic {
    display: flex;
    flex-direction: row;
  }
  &__data {
    display: flex;
    flex-direction: row;
  }
}

.content {
  &__header {
    @include text-simple;
    font-size: 20px;
    margin-bottom: 20px;
  }
  &__table {
    display: grid;
    grid-template-columns: max-content 1fr;
    grid-gap: 10px;
    @include _767 {
      grid-template-columns: 1fr
    }
  }
}

.table {
  &__title {
    @include text-simple;
    font-weight: 600;
    text-align: right;
    margin: 0;
    @include _767 {
      text-align: left;
    }
  }
  &__topic {
    display: flex;
    flex-direction: column;
  }
  &__data {
    @include text-simple;
    margin-bottom: 20px;
    &_desktop {
      overflow-wrap: anywhere;
      width: 600px;
      text-align: justify;
      @include _767 {
        display: none;
      }
    }
    &_mobile {
     display: none;
      @include _767 {
        display: block;
      }
    }
  }
  &__number {
    @include text-simple;
    color: $blue;
    font-weight: 600;
    margin-bottom: 5px;
    &_desktop {
      @include _767 {
        display: none;
      }
    }
    &_mobile {
      display: none;
      @include _767 {
        display: block;
      }
    }
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
  }
  &__item {
    @include text-simple;
    @include adaptive;
  }
}

.overview {
  display: none;
}

@include _991 {
  .txs {
    &__columns {
      grid-gap: 5px;
    }
  }
}

@include _767 {
  .txs {
    &__info {
      padding: 16px;
    }

    &__title {
      margin-left: 16px;
    }

    &__back {
      margin-left: 16px;
    }

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
  }
  .overview {
    padding: 20px;
    grid-template-columns: 1fr 1fr;
    display: grid;

    &__hash {
      font-weight: 600;
      font-size: 14px;
      color: $black300;
    }

    &__link {
      @include link;
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
        background: rgba(34, 204, 20, 0.1);
        color: $default-green;
        text-align: center;
        display: inline-block;
      }

      &_red {
        background: rgba(223, 51, 51, 0.1);
        color: $red;
        text-align: center;
        display: inline-block;
      }
    }
  }
  .logs {
    &__header {
      font-size: 16px;
    }

    &__content {
      margin: 0 0 15px 0;
      display: grid;
    }

    &__number {
      display: none;

      &_mobile {
        display: block;
        @include text-simple;
        color: $blue;
        margin: 15px 0;
        font-size: 20px;
      }
    }

    &__item {
      display: none;

      &_mobile {
        display: inline-block;
      }
    }

    &__info {
      margin: 15px 0 0 0;

      &_desktop {
        display: none;
      }

      &_mobile {
        display: block;
      }
    }
  }
  .columns {
    display: none;
  }
  .icon-copy::before {
    color: $blue;
    font-size: 20px;
    cursor: pointer;
  }
}
</style>
