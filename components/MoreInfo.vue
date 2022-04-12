<template>
  <div class="info">
    <div
      v-if="isToken"
      class="info-wrap"
    >
      <p class="info__header">
        {{ $t('ui.token.summary') }}
      </p>
      <p class="info__info">
        <span class="info__title">{{ $t('ui.token.contract') }}</span>
        <nuxt-link
          class="info__link"
          :to="{ path: '/contract/' + token.contract_address_hash.bech32}"
        >
          {{ token.contract_address_hash.bech32 }}
        </nuxt-link>
        <button-copy
          :value="token.contract_address_hash.bech32"
          icon-color="primary"
        />
      </p>
      <p class="info__info">
        <span class="info__title">{{ $t('ui.token.decimals') }}</span>
        {{ token.decimals }}
      </p>
    </div>
    <div
      v-else
      class="info-wrap"
    >
      <p class="info__header">
        {{ $t('ui.token.more') }}
      </p>
      <template v-if="createdContract">
        <p class="info__info">
          <span class="info__title">{{ $t('ui.token.creator') }}</span>
          <nuxt-link
            class="info__link"
            :to="`/address/${creator}`"
          >
            {{ formatItem(creator, 9, 6) }}
          </nuxt-link>
          {{ $t('ui.token.atTxn') }}
          <nuxt-link
            class="info__link"
            :to="`/tx/${txHash}`"
          >
            {{ formatItem(txHash, 9, 6) }}
          </nuxt-link>
        </p>
        <template v-if="isTokenTracker">
          <p class="info__info">
            <span class="info__title">{{ $t('ui.token.tracker') }}</span>
            <nuxt-link
              class="info__link"
              :to="`/tokens/${tokenTrackerAddress}`"
              :title="`${tokenTrackerName} (${tokenTrackerSymbol}) (${tokenTrackerSupply})`"
            >
              {{ formatItem(`${tokenTrackerName} (${tokenTrackerSymbol}) (${tokenTrackerSupply})`, 26, 0) }}
            </nuxt-link>
          </p>
        </template>
      </template>
    </div>
  </div>
</template>
<script>

import { mapGetters } from 'vuex';

export default {
  name: 'Info',
  props: {
    address: {
      type: String,
      default: '',
    },
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      token: 'tokens/getCurrentToken',
      accountInfo: 'account/getAccountInfo',
    }),
    isToken() {
      return Object.keys(this.token).length > 0;
    },
    createdContract() {
      return !this.isToken ? this.accountInfo.createdContract : null;
    },
    creator() {
      return this.createdContract ? this.accountInfo.createdContract?.from_address_hash?.bech32 : '';
    },
    txHash() {
      return this.createdContract ? this.accountInfo.createdContract?.hash : '';
    },
    isTokenTracker() {
      return this.createdContract && this.accountInfo.token;
    },
    tokenTrackerAddress() {
      return this.isTokenTracker ? this.accountInfo.token.contract_address_hash.bech32 : '';
    },
    tokenTrackerName() {
      return this.isTokenTracker ? this.accountInfo.token.name : '';
    },
    tokenTrackerSymbol() {
      return this.isTokenTracker ? this.accountInfo.token.symbol : '';
    },
    tokenTrackerSupply() {
      const totalSupply = this.createdContract && this.accountInfo.token ? this.accountInfo.token.total_supply : 0;
      const decimals = this.createdContract && this.accountInfo.token ? this.accountInfo.token.decimals : 0;
      if (totalSupply && decimals) {
        return this.ConvertFromDecimals(totalSupply, decimals());
      }
      return '';
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

.info {
  padding: 20px;
  background: $white;
  border-radius: 6px;
  max-width: 578px;
  position: relative;

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

  &__link {
    @include link;
    overflow-wrap: anywhere;
  }
}

.icon-copy {
  color: $blue;
  font-size: 16px;
  cursor: pointer;
}

@include _767 {
  .info {
    max-width: 100%;
    &__title {
      display: block;
    }

    &__info {
      word-wrap: break-word;
    }
  }
}
</style>
