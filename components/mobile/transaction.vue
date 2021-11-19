<template>
  <div
    class="transaction"
    :class="{transaction__separator: isLast}"
  >
    <div class="transaction__hash">
      <p>
        {{ $t('ui.tx.transaction') }}
      </p>
      <p>
        <nuxt-link
          class="transaction__link"
          :to="`/transactions/${(transaction.hash || transaction.id)}`"
        >
          {{ formatItem((transaction.hash || transaction.id), 9, 6) }}
        </nuxt-link>
      </p>
    </div>
    <p class="transaction__timestamp">
      16 sec ago
    </p>
    <div class="transaction__subtitle">
      {{ $t('ui.tx.from') }}
      <nuxt-link
        class="transaction__link_small"
        :to="`/address/${transaction.fromAddress}`"
      >
        {{ formatItem(transaction.fromAddress, 7, 6) }}
      </nuxt-link>
    </div>
    <div
      v-if="!isHome"
      class="transaction__subtitle"
    >
      {{ $t('ui.block.blockNumber') }}
      <nuxt-link
        class="transaction__link_small"
        :to="`/blocks/${transaction.blockNumber}`"
      >
        {{ transaction.blockNumber }}
      </nuxt-link>
    </div>
    <div class="transaction__subtitle">
      {{ $t('ui.tx.to') }}
      <nuxt-link
        v-if="transaction.toAddress"
        class="transaction__link_small"
        :to="`/address/${transaction.toAddress}`"
      >
        {{ formatItem(transaction.toAddress, 7, 6) }}
      </nuxt-link>
    </div>
    <div
      v-if="isHome"
      class="transaction__subtitle"
    >
      {{ $t('ui.tx.amount') }}
      <span class="transaction__info">
        {{ transaction.value }} {{ transaction.symbol }}
      </span>
    </div>
    <div
      v-else
      class="transaction__subtitle"
    >
      {{ $t('ui.tx.value') }}
      <span class="transaction__info">
        {{ transaction.value }} {{ transaction.symbol }}
      </span>
    </div>
    <div
      v-if="!isHome"
      class="transaction__subtitle"
    >
      {{ $t('ui.tx.fee') }}
      <span class="transaction__info">
        {{ transaction.gasUsed }}
      </span>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Transaction',
  props: {
    transaction: {
      type: Object,
      default: () => {},
    },
    isLast: {
      type: Boolean,
      default: false,
    },
    isHome: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
<style lang="scss" scoped>
.transaction {
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
      grid-column: 1/2;
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
