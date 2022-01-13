<template>
  <div class="overview">
    <div class="overview-wrap">
      <!--  TODO: Вывести реальные данные -->
      <p class="overview__header">
        {{ $t('ui.token.overview') }}
      </p>
      <!--      <p class="overview__info">-->
      <!--        <span class="overview__title">{{ $t('ui.token.maxSupply') }}</span>-->
      <!--        30 910 401 959,97513 {{ token }}-->
      <!--      </p>-->
      <!--      <p class="overview__info">-->
      <!--        <span class="overview__title">{{ $t('ui.token.holders') }}</span>-->
      <!--        3 321 050-->
      <!--      </p>-->
      <!--      <p class="overview__info">-->
      <!--        <span class="overview__title">{{ $t('ui.token.transfers') }}</span>-->
      <!--        115 777 329-->
      <!--      </p>-->
    </div>
    <div class="overview-wrap">
      <p class="overview__info">
        <span class="overview__title">{{ $t('ui.token.balance') }}</span>
        {{ balanceWusd }} {{ tokenName }}
      </p>
      <p class="overview__info">
        <span class="overview__title">WUSD {{ $t('ui.tx.value') }}</span>
        ${{ balanceWusd }} (@ $0.89/WUSD)
      </p>
      <div class="overview__token">
        {{ $t('ui.token.token') }}
      </div>
      <div
        v-click-outside="hideChoice"
        class="overview__select-field"
      >
        <div class="overview__input">
          {{ $t('ui.token.placeholder') }}
          <span
            class="icon-caret_down"
            @click="toggleChoice"
          />
        </div>
        <ChoiceToken
          v-if="isChoosing"
          class="overview__select"
        />
      </div>
    </div>
  </div>
</template>
<script>
import ClickOutside from 'vue-click-outside';
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import ChoiceToken from '~/components/ChoiceToken.vue';

export default {
  name: 'Overview',
  components: {
    ChoiceToken,
  },
  directives: {
    ClickOutside,
  },
  data() {
    return {
      address: this.$route.params.id,
      balanceWusd: 0,
      tokenName: '',
      isChoosing: false,
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      accountBalances: 'account/getAccountBalances',
      accountBalancesCount: 'account/getAccountBalancesCount',
    }),
  },
  async created() {
    await this.$store.dispatch('account/getAccountBalances', this.address);
  },
  async mounted() {
    await this.SetLoader(true);
    await this.currentBalanceWusd();
    await this.currentTokenName();
    await this.SetLoader(false);
  },
  methods: {
    async currentTokenName() {
      if (this.accountBalances && this.accountBalancesCount > 0) {
        this.tokenName = this.accountBalances[0].tokenId.toUpperCase();
      }
    },
    async currentBalanceWusd() {
      if (this.accountBalances && this.accountBalancesCount > 0) {
        const amount = new BigNumber(this.accountBalances[0].amount);
        this.balanceWusd = amount.shiftedBy(-this.accountBalances[0].token.decimals).toFixed(5);
      }
    },
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
