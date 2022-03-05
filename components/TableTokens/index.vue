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
      :empty-text="$t('ui.token.noToken')"
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
          {{ el.item.number }}
        </p>
      </template>

      <template #cell(contract_address_hash.hex)="el">
        <div class="token__header">
          <img
            :src="Require(`tokens/${el.item.symbol}.svg`)"
            width="15"
            class="token__image"
            alt=""
            @error="handleError()"
          >
          <nuxt-link
            :to="{ path: `tokens/`+el.item.token, params: { token: el.item.token }}"
            class="token__title table__link"
          >
            {{ el.item.name }} ({{ el.item.symbol }})
          </nuxt-link>
        </div>
        <p class="token__description">
          {{ el.item.description }}
        </p>
      </template>

      <template #cell(total_supply)="el">
        <p>
          {{ NumberFormat(el.item.total_supply) }}
        </p>
      </template>

      <template #cell(holders)="el">
        <span>{{ NumberFormat(el.item.holder_count) }} </span>
      </template>

      <template #cell(address)="el">
        <nuxt-link
          class="table__link"
          :to="{ path: '/address/'+el.item.address }"
        >
          {{ el.item.address }}
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
  mounted() {
    console.log('this.items: ', this.items);
  },
  methods: {
    handleError(e) {
      console.log('e: ', e);
      return '';
    },
  },
};
</script>

<style lang="scss">
.token {
  &__header {
    display: flex;
  }

  &__title {
    @include text-simple;
    @include normal-font-size;
    margin: 5px;
  }

  &__description {
    @include text-simple;
    @include normal-font-size;
    font-size: 12px;
    color: $black300;
    max-width: 273px;
    margin-left: 22px;
  }
}
</style>
