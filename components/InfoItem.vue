<template>
  <div class="item">
    <p class="item__header">
      {{ title }}
    </p>
    <p
      v-if="item === 'link'"
      class="item__info"
    >
      <nuxt-link
        class="item__link"
        :to="`blocks/${info}`"
      >
        {{ info }}
      </nuxt-link>
    </p>
    <p
      @click="pushToTxs"
      v-else-if="item === 'transaction'"
      class="item__link"
    >
    <!-- site/register?plan=private
    etherscan.io/txs?block=13542487 -->
      <!-- <nuxt-link
        class="item__link"
        :to="{ path: 'transaction', query: { block: 13542487 }}"
      > -->
        {{ info }} {{ $t('ui.txs') }}
      <!-- </nuxt-link> -->
    </p>
    <p
      v-else-if="item === 'address'"
      class="item__info item__info_blue"
    >
      {{ info }}
      <span class="icon-copy" />
    </p>
    <p
      v-else-if="item === 'status'"
      class="item__info"
      :class="{'item__info_green': info === 1, 'item__info_red': info === 2}"
    >
      {{ info }}
    </p>
    <p
      v-else
      class="item__info"
    >
      {{ info }}
    </p>
    <p class="item__note">
      {{ note }}
    </p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    info: {
      type: String || Number,
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
    item: {
      type: String,
      default: '',
    },
  },
  methods: {
    pushToTxs() {
      // this.$router.go(-1);
      this.$router.replace('/transactions');
    },
  },
};
</script>
<style lang="scss" scoped>
.item {
    &__header {
        @include text-simple;
        font-weight: 600;
        font-size: 18px;
    }
    &__info {
        @include text-simple;
        &_blue {
           color: $blue;
        }
        &_green {
          background: rgba(34, 204, 20, 0.1);
          border-radius: 3px;
          color: $default-green;
          width: 58px;
          text-align: center;
        }
        &_red {
          background: rgba(223, 51, 51, 0.1);
          border-radius: 3px;
          color: $red;
          width: 58px;
          text-align: center;
        }
    }
    &__note {
        @include text-simple;
        font-size: 14px;
        color: $black300;
    }
    &__link {
      @include text-simple;
      cursor: pointer;
      color: $blue;
    }
}
.icon-copy::before {
  color: $blue;
  font-size: 20px;
  cursor: pointer;
}
</style>
