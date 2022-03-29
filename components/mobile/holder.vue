<template>
  <div
    class="holder"
    :class="{holder__separator: isLast}"
  >
    <div
      v-if="holder.address_hash.hex"
      class="holder__hash"
    >
      <p>{{ $t('ui.token.address') }}</p>
      <p>
        <nuxt-link
          class="holder__link"
          :to="`/address/${(holder.address_hash.hex)}`"
        >
          {{ formatItem(holder.address_hash.hex, 9, 6) }}
        </nuxt-link>
      </p>
    </div>
    <div
      v-if="holder.quantity"
      class="holder__subtitle"
    >
      {{ $t('ui.token.quantity') }}:
      <span class="holder__info">{{ holder.quantity }}</span>
    </div>
    <div
      v-if="holder.value && token.total_supply"
      class="holder__subtitle"
    >
      {{ $t('ui.token.percentage') }}:
      <span class="holder__info">{{ percentage }}</span>
    </div>
    <div
      v-if="holder.value"
      class="holder__subtitle"
    >
      {{ $t('ui.token.quantity') }}:
      <span class="holder__info">{{ NumberFormat(ConvertFromDecimals(holder.value, token.decimals)) }}</span>
    </div>
  </div>
</template>
<script>

import BigNumber from 'bignumber.js';

export default {
  name: 'Holder',
  props: {
    holder: {
      type: Object,
      default: () => {
      },
    },
    token: {
      type: Object,
      default: () => {
      },
    },
    isLast: {
      type: Boolean,
      default: false,
    },
    isHome: {
      type: Boolean,
      default: false,
    },
    isToken: {
      type: Boolean,
      default: false,
    },
    internal: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    percentage() {
      return this.holder.value && this.token.total_supply
        ? `${new BigNumber(this.holder.value).dividedBy(this.token.total_supply).multipliedBy(100).decimalPlaces(4)}%`
        : '';
    },
  },
};
</script>
<style lang="scss" scoped>
.holder {
  padding: 20px 0;
  border-bottom: 1px solid $black100;
  grid-template-columns: 1fr 1fr;
  display: grid;

  &__separator {
    border: none;
  }

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
}
</style>
