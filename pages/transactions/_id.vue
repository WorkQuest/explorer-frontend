<template>
  <div class="txs">
    <search-filter class="txs__search" />
    <div class="txs__content">
      <div class="txs__back">
        <span class="icon-short_left" />
        {{ $t('ui.back') }}
      </div>
      <h3 class="txs__title">
        {{ $t('ui.tx.txDetails') }}
      </h3>
      <div class="txs__info">
        <div class="txs__number-field">
          <span
            class="txs__tab_overview"
            :class="{txs__tab_active: activeElement === 'txs__tab_overview'}"
            @click="onClick"
          >Overview</span>
          <span
            class="txs__tab_logs"
            :class="{txs__tab_active: activeElement === 'txs__tab_logs'}"
            @click="onClick"
          >Logs</span>
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
          <!-- blockNumber: 15433
contractAddress: "0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe"
createdAt: "2021-08-12T06:55:43.569Z"
fromAddress: "0xe24f99419d788003c0d5212f05f47b1572cdc38a"
gasLimit: null
gasPrice: "10000000000"
gasUsed: "43494"
id: "0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b8158"
input: "0xa9059cbb00000000000000000000000084cb5dc70dca8c9522c04cfffaee5a35000f6b72000000000000000000000000000000000000000000295be96e64066972000000"
logs: Array(1)
status: 1
timestamp: "2021-08-12T04:45:53.000Z"
toAddress: "0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe"
tokenId: null
updatedAt: "2021-08-12T06:55:43.576Z"
value: "0"
          <Item /> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Item from '~/components/Item.vue';

export default {
  name: 'Block',
  components: {
    Item,
  },
  data: () => ({
    tx: {},
    activeElement: 'txs__tab_overview',
  }),
  computed: {
  },
  async mounted() {
    this.SetLoader(true);
    const txsRes = await this.$axios.get('/v1/txs');
    // eslint-disable-next-line prefer-destructuring
    this.tx = txsRes.data.result.txs[0];
    console.log(this.tx);
    this.SetLoader(false);
  },
  methods: {
    onClick(event) {
      console.log(event);
      this.activeElement = event.target.className;
      console.log(this.activeElement);
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
        font-size: 18px;
        color: $black600;
        cursor: pointer;
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
        // &:last-child {
        //   grid-column-start: 1;
        //   grid-column-end: 2;
        // }
        // 183px
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
</style>
