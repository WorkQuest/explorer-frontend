<template>
  <div class="overview">
    <div class="overview-wrap">
      <p class="overview__header">
        {{ $t('ui.token.overview') }}
      </p>
    </div>
    <div class="overview-wrap">
      <p class="overview__info">
        <span class="overview__title">{{ isToken ? $t('ui.token.maxSupply') : $t('ui.token.balance') }}</span>
        {{ isToken ? NumberFormat(balance) : Floor(balance) }} {{ symbol }}
      </p>
      <p
        v-if="isToken"
        class="overview__info"
      >
        <span class="overview__title"> {{ $t('ui.token.holders') }}  </span>
        {{ NumberFormat(token.holder_count) }}
      </p>
      <p class="overview__info">
        <template v-if="isToken">
          <span class="overview__title"> {{ $t('ui.token.transfers') }}  </span>
          {{ NumberFormat(transfersCount) }}
        </template>
        <template v-else>
          <span class="overview__title">{{ symbol }} {{ $t('ui.tx.value') }}</span>
          ${{ Floor(balance) }} (@ $1.00/{{ symbol }})
        </template>
      </p>
      <template v-if="!isToken">
        <div class="overview__token">
          {{ $t('ui.token.token') }}
        </div>
        <div
          v-click-outside="hideChoice"
          class="overview__select-field"
        >
          <div
            class="overview__input"
            :class="accountTokens.length === 0 ? 'overview__input_disabled' :''"
          >
            {{ $t('ui.token.selectToken') }}
            <span
              class="icon-caret_down"
              @click="toggleChoice"
            />
          </div>
          <ChoiceToken
            v-if="isChoosing"
            class="overview__select"
            :tokens="accountTokens"
          />
        </div>
      </template>
    </div>
  </div>
</template>
<script>
import ClickOutside from 'vue-click-outside';
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import ChoiceToken from '~/components/ChoiceToken.vue';

/** @param { Object } accountInfo */

export default {
  name: 'Overview',
  components: {
    ChoiceToken,
  },
  directives: {
    ClickOutside,
  },
  props: {
    address: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isChoosing: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      nativeBalance: 'account/getNativeBalance',
      accountInfo: 'account/getAccountInfo',
      accountTokens: 'account/getAccountTokens',
      nativeSymbol: 'tokens/getWUSDTokenSymbol',
      nativeDecimals: 'tokens/getWUSDTokenDecimals',
      token: 'tokens/getCurrentToken',
      transfersCount: 'tokens/getCurrentTokenTransfersCount',
    }),
    isToken() {
      return Object.keys(this.token).length > 0;
    },
    decimals() {
      return this.isToken && this.address ? this.token.decimals : this.nativeDecimals;
    },
    symbol() {
      return this.isToken && this.address ? this.token.symbol : this.nativeSymbol;
    },
    balance() {
      return new BigNumber(this.isToken && this.address
        ? this.token.total_supply
        : this.nativeBalance).shiftedBy(-this.decimals).toString();
    },
  },
  methods: {
    toggleChoice() {
      this.isChoosing = !this.isChoosing;
    },
    hideChoice() {
      this.isChoosing = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.overview {
  background: $white;
  border-radius: 6px;
  max-width: 578px;

  &-wrap {
    margin: 20px;
    position: relative;
  }

  &__header {
    @include text-simple;
    @include normal-font-size;
    font-size: 18px;
    margin-bottom: 20px;
  }

  &__info {
    @include text-simple;
    @include normal-font-size;
    margin-bottom: 15px;
  }

  &__title {
    @include text-simple;
    @include normal-font-size;
    font-weight: 600;
    margin-right: 10px;
  }

  &__token {
    @include text-simple;
    @include normal-font-size;
    margin-bottom: 5px;
  }

  &__input {
    @include text-simple;
    @include normal-font-size;
    padding: 11px 20px 11px 15px;
    background: $black0;
    border-radius: 6px;
    color: $black200;
    &_disabled {
      pointer-events: none;
      color: $black100;
    }
  }

  &__select {
    position: absolute;
    z-index: 1;
    width: 100%;
    left: 0;
  }
}

.icon-caret_down::before {
  color: $blue;
  font-size: 20px;
  float: right;
  cursor: pointer;
}

@include _767 {
  .overview {
    @include container;
    max-width: 100vw;

    &__title {
      display: block;
    }
  }
}
</style>
