<template>
  <div class="txs">
    <search-filter class="txs__search" />
    <base-field
      v-model="search"
      class="txs__search_mobile"
      :is-search="true"
      :is-hide-error="true"
      :placeholder="$t('ui.forms.searchPlaceholder')"
    />
    <div class="txs__content">
      <nuxt-link
        to="/transactions"
        class="txs__back"
      >
        <span class="icon-short_left" />
        {{ $t('ui.back') }}
      </nuxt-link>
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
          v-if="tx && activeElement === 'overview'"
          class="txs__columns columns"
        >
          <Item
            v-for="(item, i) in txsColumns"
            :key="i"
            :class="item.class"
            :title="item.title"
            :info="item.info"
            :note="item.note"
          />
        </div>
        <div
          v-if="tx && activeElement === 'logs'"
          class="txs__logs logs"
        >
          <div v-if="tx.logs.length === 0">
            {{ $t('tx.noLogs') }}
          </div>
          <p
            v-if="tx.logs.length > 0"
            class="logs__header"
          >
            {{ $t('ui.tx.logs') }}
          </p>
          <p
            v-if="tx.logs.length > 0"
            class="logs__hash"
          >
            {{ $t('ui.tx.transaction') }}
            <span
              v-for="(item, i) in txsLogs"
              :key="i"
              :class="item.class"
            >
              {{ item.text }}
            </span>
          </p>
          <div
            v-if="tx.logs.length > 0"
            class="logs__content"
          >
            <p class="logs__title">
              {{ $t('ui.tx.topics') }}
            </p>
            <div class="logs__info">
              <div
                v-for="(item, index) in tx.logs[0].topics"
                :key="index"
                class="logs__topic"
              >
                <p class="logs__index">
                  {{ index }}
                </p>
                <p class="logs__item">
                  {{ item }}
                </p>
                <p class="logs__item_mobile">
                  {{ formatItem(item, 9, 6) }}
                </p>
              </div>
            </div>
          </div>
          <div
            v-if="tx.logs.length > 0"
            class="logs__content"
          >
            <p class="logs__title">
              {{ $t('ui.tx.data') }}
            </p>
            <div class="logs__info logs__info_desktop">
              {{ tx.logs[0].data }}
            </div>
            <div class="logs__info_mobile">
              {{ formatItem(tx.logs[0].data, 9, 6) }}
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
            <p>
              <nuxt-link
                class="overview__link"
                :to="`/transactions/${(tx.id)}`"
              >
                {{ formatItem(tx.id, 9, 6) }}
              </nuxt-link>
            </p>
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
              {{ tx.status }}
            </p>
          </div>
          <div class="overview__subtitle">
            {{ $t('ui.block.blockNumber') }}
            <nuxt-link
              v-if="tx.blockNumber"
              class="overview__link_small"
              :to="`/blocks/${tx.blockNumber}`"
            >
              {{ tx.blockNumber }}
            </nuxt-link>
          </div>
          <div class="overview__subtitle">
            {{ $t('ui.tx.from') }}
            <nuxt-link
              v-if="tx.fromAddress"
              class="overview__link_small"
              :to="`/address/${tx.fromAddress}`"
            >
              {{ formatItem(tx.fromAddress, 7, 6) }}
            </nuxt-link>
            <button
              v-clipboard:copy="tx.fromAddress"
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
              v-if="tx.toAddress"
              class="overview__link_small"
              :to="`/address/${tx.toAddress}`"
            >
              {{ formatItem(tx.toAddress, 7, 6) }}
            </nuxt-link>
            <button
              v-clipboard:copy="tx.toAddress"
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
            <span class="overview__info">{{ tx.value }} {{ tx.symbol }}</span>
          </div>
          <div class="overview__subtitle  overview__subtitle_underlined">
            {{ $t('ui.tx.fee') }}
            <span class="overview__info">{{ tx.gasUsed }}</span>
          </div>
          <div class="overview__subtitle">
            {{ $t('ui.block.gasUsed') }}
            <span class="overview__info">{{ tx.gasUsed }}</span>
          </div>
          <div class="overview__subtitle">
            {{ $t('ui.block.gasLimit') }}
            <span class="overview__info">{{ tx.gasLimit }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import Item from '~/components/InfoItem.vue';

export default {
  name: 'Block',
  components: {
    Item,
  },
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
    }),
    txsColumns() {
      return [
        { class: 'columns__item_six', title: this.$t('ui.tx.transaction'), info: this.tx.id },
        {
          class: 'columns__item_two-one',
          title: this.$t('ui.timestamp'),
          info: this.formatDataFromNow(this.tx.timestamp),
          note: this.tx.timestamp,
        },
        {
          class: 'columns__item_two-two', title: this.$t('ui.tx.status'), info: this.tx.status, item: 'status',
        },
        {
          class: 'columns__item_two-three', title: this.$t('ui.block.block'), info: '17102304', item: 'link',
        },
        {
          class: 'columns__item_three-one', title: this.$t('ui.tx.from'), info: this.tx.fromAddress, item: 'address',
        },
        {
          class: 'columns__item_three-two', title: this.$t('ui.tx.to'), info: this.tx.toAddress, item: 'address',
        },
        { class: 'columns__item_three-one', title: this.$t('ui.tx.value'), info: this.tx.value },
        { class: 'columns__item_three-two', title: this.$t('ui.tx.fee'), info: this.tx.gasPrice },
        { class: 'columns__item_three-one', title: this.$t('ui.block.gasUsed'), info: this.tx.gasUsed },
        { class: 'columns__item_three-two', title: this.$t('ui.block.gasLimit'), info: this.tx.gasLimit },
      ];
    },
    txsLogs() {
      return [
        { class: 'logs__number', text: this.tx.logs[0].transactionHash },
        { class: 'logs__number_mobile', text: this.formatItem(this.tx.logs[0].transactionHash, 9, 6) },
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
    padding: 25px 0 20px 20px;
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
    height: 370px;
  }
}

.columns {
  &__item {
    &_six {
      grid-column: 1 / span 6;
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
  &__header {
    @include text-simple;
    font-size: 20px;
  }

  &__hash {
    @include text-simple;
    font-weight: 600;
    margin-top: 20px;
  }

  &__number {
    @include text-simple;
    color: $blue;
    margin-left: 10px;

    &_mobile {
      display: none;
    }
  }

  &__content {
    display: flex;
    margin: 15px 0 0 23px;
  }

  &__topic {
    display: flex;
  }

  &__info {
    margin-left: 10px;

    &_mobile {
      display: none;
    }
  }

  &__title {
    @include text-simple;
    font-weight: 600;
  }

  &__index {
    background: $black100;
    color: $black600;
    text-align: center;
    border-radius: 3px;
    width: 21px;
    height: 21px;
    margin: 0 10px 15px 0;
    font-size: 12px;
  }

  &__item {
    &_mobile {
      display: none;
    }

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
    padding: 20px 0;
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
      font-weight: 600;
      grid-column: 1/3;
      margin-top: 11px;

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
      &_green {
        background: rgba(34, 204, 20, 0.1);
        border-radius: 3px;
        color: $default-green;
        width: 58px;
        text-align: center;
        display: inline-block;
      }

      &_red {
        background: rgba(223, 51, 51, 0.1);
        border-radius: 3px;
        color: $red;
        width: 58px;
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
