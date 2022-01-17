<template>
  <div
    class="holder"
    :class="{holder__separator: isLast}"
  >
    <div
      v-if="holder.address"
      class="holder__hash"
    >
      <p>{{ $t('ui.token.address') }}</p>
      <p>
        <nuxt-link
          class="holder__link"
          :to="`/address/${(holder.address)}`"
        >
          {{ formatItem(holder.address, 9, 6) }}
        </nuxt-link>
      </p>
    </div>
    <div
      v-if="holder.quantity"
      class="holder__subtitle"
    >
      {{ $t('ui.token.quantity') }}
      <span class="holder__info">{{ holder.quantity }}</span>
    </div>
    <div
      v-if="holder.percentage"
      class="holder__subtitle"
    >
      {{ $t('ui.token.percentage') }}
      <span class="holder__info">{{ holder.percentage }}</span>
    </div>
    <div
      v-if="holder.value"
      class="holder__subtitle"
    >
      {{ $t('ui.tx.value') }}
      <span class="holder__info">{{ holder.value }}</span>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Holder',
  props: {
    holder: {
      type: Object,
      default: () => {
      },
    },
    tokens: {
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
