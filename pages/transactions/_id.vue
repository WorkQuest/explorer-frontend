<template>
  <div class="txs">
    <search-filter class="txs__search" />
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
            class="txs__tab_overview"
            :class="{txs__tab_active: activeElement === 'txs__tab_overview'}"
            @click="onClick"
          >{{ $t('ui.token.overview') }}</span>
          <span
            class="txs__tab_logs"
            :class="{txs__tab_active: activeElement === 'txs__tab_logs'}"
            @click="onClick"
          >{{ $t('ui.token.logs') }}</span>
        </div>
        <div
          v-if="activeElement === 'txs__tab_overview'"
          class="txs__columns columns"
        >
          <Item
            class="columns__item_six"
            :title="$t('ui.tx.transaction')"
            :info="tx.id"
          />
          <Item
            class="columns__item_two-one"
            :title="$t('ui.timestamp')"
            info="16 secs ago"
            :note="tx.timestamp"
          />
          <Item
            class="columns__item_two-two"
            :title="$t('ui.tx.status')"
            :info="tx.status"
            item="status"
          />
          <Item
            class="columns__item_two-three"
            :title="$t('ui.block.block')"
            info="17102304"
            item="link"
          />
          <Item
            class="columns__item_three-one"
            :title="$t('ui.tx.from')"
            :info="tx.fromAddress"
            item="address"
          />
          <Item
            class="columns__item_three-two"
            :title="$t('ui.tx.to')"
            :info="tx.toAddress"
            item="address"
          />
          <Item
            class="columns__item_three-one"
            :title="$t('ui.tx.value')"
            :info="tx.value"
          />
          <Item
            class="columns__item_three-two"
            :title="$t('ui.tx.fee')"
            :info="tx.gasPrice"
          />
          <Item
            class="columns__item_three-one"
            :title="$t('ui.block.gasUsed')"
            :info="tx.gasUsed"
          />
          <Item
            class="columns__item_three-two"
            :title="$t('ui.block.gasLimit')"
            :info="tx.gasLimit"
          />
        </div>
        <div
          v-if="activeElement === 'txs__tab_logs'"
          class="txs__logs logs"
        >
          <p class="logs__header">
            {{ $t('ui.tx.logs') }}
          </p>
          <p class="logs__hash">
            {{ $t('ui.tx.transaction') }}
            <span class="logs__number">
              {{ tx.logs[0].transactionHash }}
            </span>
          </p>
          <div class="logs__content">
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
              </div>
            </div>
          </div>
          <div class="logs__content">
            <p class="logs__title">
              {{ $t('ui.tx.data') }}
            </p>
            <div class="logs__info">
              {{ tx.logs[0].data }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Item from '~/components/InfoItem.vue';

export default {
  name: 'Block',
  components: {
    Item,
  },
  data() {
    return {
      tx: {},
      activeElement: 'txs__tab_overview',
    };
  },
  computed: {
  },
  async mounted() {
    this.SetLoader(true);
    const txsRes = await this.$axios.get('/v1/txs');
    // eslint-disable-next-line prefer-destructuring
    this.tx = txsRes.data.result.txs[0];
    this.SetLoader(false);
  },
  methods: {
    onClick(event) {
      this.activeElement = event.target.className;
    },
  },
};
</script>
<style lang="scss" scoped>
.txs {
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

  }
}
@include _991 {
.txs {
  &__columns {
    grid-gap: 5px;
  }
}
}
</style>
