<template>
  <div
    class="block"
    :class="{block__separator: isLast}"
  >
    <div
      v-if="block.id"
      class="block__number"
    >
      <p>{{ $t('ui.block.blockNumber') }}</p>
      <p>
        <nuxt-link
          class="block__link"
          :to="`/blocks/${block.id}`"
        >
          {{ block.id }}
        </nuxt-link>
      </p>
    </div>
    <p
      v-if="block.timestamp"
      class="block__timestamp"
    >
      {{ formatDataFromNow(block.timestamp) }}
    </p>
    <div
      v-if="block.txsCount >= 0"
      class="block__subtitle"
    >
      {{ $t('ui.txs') }}
      <nuxt-link
        class="block__link_small"
        :to="{ path: '/transactions', query: { block: block.id }}"
      >
        {{ block.txsCount }} txns
      </nuxt-link>
      <span class="block__timestamp">({{ formatDataFromNow(block.timestamp) }})</span>
    </div>
    <div
      v-if="block.gasUsed"
      class="block__subtitle"
    >
      {{ $t('ui.block.gasUsed') }}
      <span class="block__info">{{ block.gasUsed }}</span>
    </div>
    <div
      v-if="block.gasLimit"
      class="block__subtitle"
    >
      {{ $t('ui.block.gasLimit') }}
      <span class="block__info">{{ block.gasLimit }}</span>
    </div>
    <div
      v-if="block.reward"
      class="block__subtitle"
    >
      {{ $t('ui.block.reward') }}
      <span class="block__info">{{ block.reward }} {{ block.symbol }}</span>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Block',
  props: {
    block: {
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
  },
};
</script>
<style lang="scss" scoped>
.block {
  padding: 20px 0;
  border-bottom: 1px solid $black100;
  grid-template-columns: 1fr 1fr;
  display: grid;

  &__separator {
    border: none;
  }

  &__number {
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
