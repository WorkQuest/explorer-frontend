<template>
  <div class="table">
    <b-table
      class="token"
      :items="items"
      :fields="fields"
      borderless
      thead-class="table__header"
      caption-top
      sort-icon-right
      :responsive="true"
      tbody-tr-class="table__row"
      :empty-text="$t('ui.token.noTokens')"
      show-empty
    >
      <template
        v-if="$props.title"
        #table-caption
      >
        <div class="table__titles">
          <span class="table__title">{{ $props.title }}</span>
        </div>
      </template>

      <template #cell(number)="el">
        <p>
          {{ el.index + 1 }}
        </p>
      </template>

      <template #cell(rank)="el">
        <p>
          {{ el.index + 1 }}
        </p>
      </template>

      <template #cell(contract_address_hash.hex)="el">
        <div class="token__header">
          <template v-if="el.item.symbol">
            <img
              :src="require(`~/assets/img/tokens/empty-token.svg`)"
              width="15"
              height="15"
              class="token__image"
              :alt="el.item.symbol"
            >
            <nuxt-link
              :to="{ path: `tokens/`+el.item.contract_address_hash.hex, params: { token: el.item.contract_address_hash.hex }}"
              class="token__title table__link"
            >
              {{ el.item.name }} ({{ el.item.symbol }})
            </nuxt-link>
          </template>
        </div>
        <p class="token__description">
          {{ el.item.description }}
        </p>
      </template>

      <template #cell(total_supply)="el">
        <p>
          {{ el.value }}
        </p>
      </template>

      <template #cell(holder_count)="el">
        <span>{{ el.value }} </span>
      </template>

      <template #cell(address_hash.hex)="el">
        <nuxt-link
          class="table__link"
          :to="{ path: '/address/'+el.item.address_hash.hex }"
        >
          {{ el.item.address_hash.hex }}
        </nuxt-link>
      </template>
    </b-table>
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.token {
  &__header {
    display: flex;
  }

  &__title {
    @include text-simple;
    @include normal-font-size;
    margin-left: 5px;
  }

  &__description {
    @include text-simple;
    @include normal-font-size;
    font-size: 12px;
    color: $black300;
    max-width: 273px;
    margin-left: 22px;
  }
  &__image {
    border-radius: 50%;
    margin-top: 5px;
    width: 15px;
    height: 15px;
    overflow: hidden;
  }
}
</style>
