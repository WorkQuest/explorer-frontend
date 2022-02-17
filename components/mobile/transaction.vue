<template>
  <div
    class="transaction"
    :class="{transaction__separator: isLast}"
  >
    <div
      v-if="(transaction.hash || transaction.id)"
      class="transaction__hash"
    >
      <p>{{ $t('ui.tx.transaction') }}</p>
      <p>
        <nuxt-link
          class="transaction__link"
          :to="`/transactions/${(transaction.hash || transaction.id)}`"
        >
          {{ formatItem((transaction.hash || transaction.id), 9, 6) }}
        </nuxt-link>
      </p>
    </div>
    <div
      v-if="transaction.block_number && internal"
      class="transaction__hash"
    >
      <p>{{ $t('ui.block.blockNumber') }}</p>
      <p>
        <nuxt-link
          class="transaction__link"
          :to="`/blocks/${(transaction.block_number)}`"
        >
          {{ transaction.block_number }}
        </nuxt-link>
      </p>
    </div>
    <p class="transaction__timestamp">
      {{ formatDataFromNow(transaction.timestamp) }}
    </p>
    <div
      v-if="transaction.method"
      class="transaction__subtitle"
    >
      {{ $t('ui.token.method') }}
      <span class="transaction__info">{{ transaction.method }}</span>
    </div>
    <div
      v-if="transaction.from_address_hash && Object.keys(transaction.from_address_hash).length > 0"
      class="transaction__subtitle"
    >
      {{ $t('ui.tx.from') }}
      <nuxt-link
        v-if="transaction.from_address_hash && transaction.from_address_hash.hex"
        class="transaction__link_small"
        :to="`/address/${transaction.from_address_hash.hex}`"
      >
        {{ formatItem(transaction.from_address_hash.hex, 7, 6) }}
      </nuxt-link>
    </div>
    <div
      v-if="transaction.block_number && !internal"
      class="transaction__subtitle"
    >
      {{ $t('ui.block.blockNumber') }}
      <nuxt-link
        class="transaction__link_small"
        :to="`/blocks/${transaction.block_number}`"
      >
        {{ transaction.block_number }}
      </nuxt-link>
    </div>
    <div
      v-if="transaction.to_address_hash && Object.keys(transaction.to_address_hash).length > 0"
      class="transaction__subtitle"
    >
      {{ $t('ui.tx.to') }}
      <nuxt-link
        v-if="transaction.to_address_hash && transaction.to_address_hash.hex"
        class="transaction__link_small"
        :to="`/address/${transaction.to_address_hash.hex}`"
      >
        {{ formatItem(transaction.to_address_hash.hex, 7, 6) }}
      </nuxt-link>
    </div>
    <div
      v-if="isHome"
      class="transaction__subtitle"
    >
      {{ $t('ui.tx.amount') }}
      <span class="transaction__info">{{ transaction.value }} {{ transaction.symbol }}</span>
    </div>
    <div
      v-else-if="transaction.value"
      class="transaction__subtitle"
    >
      {{ $t('ui.tx.value') }}
      <span class="transaction__info">{{ transaction.value }} {{ transaction.symbol }}</span>
    </div>
    <div
      v-if="transaction.gas_used"
      class="transaction__subtitle"
    >
      {{ $t('ui.tx.fee') }}
      <span class="transaction__info">{{ transaction.gas_used }}</span>
    </div>
    <div
      v-if="transaction.quantity"
      class="transaction__subtitle"
    >
      {{ $t('ui.token.quantity') }}
      <span class="transaction__info">{{ transaction.quantity }}</span>
    </div>
    <div
      v-if="isToken"
      class="transaction__subtitle"
    >
      {{ $t('ui.token.token') }}
      <span class="transaction__info">
        <nuxt-link
          class="transaction__link_small"
          :to="{ path: `tokens/`+transaction.token, params: { token: transaction.token }}"
        >
          {{ formatItem(tokens[`${transaction.token}`].name, 10, 0) }} ({{ transaction.token }})
        </nuxt-link>
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
    tokens: {
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
