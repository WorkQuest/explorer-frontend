<template>
  <div
    class="tokens"
    @click.stop.prevent
  >
    <base-field
      v-model="search"
      :is-search="true"
      :is-hide-error="true"
      :placeholder="$tc('ui.forms.search')"
      class="tokens__search"
    />
    <div class="token-wrapper">
      <div
        v-for="(token, index) in tokensArray"
        :key="index"
        class="token"
        @click="onClick(token)"
      >
        <p class="token__item">
          <token-image
            class="token__image"
            :link="tokenIconUrl(token)"
            :symbol="tokenSymbol(token)"
            size="small"
          />
          {{ token.name }} ({{ token.symbol }})
        </p>
        <p class="token__code">
          {{ NumberFormat(ConvertFromDecimals(token.value, token.decimals)) }} {{ token.symbol }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'ChoiceToken',
  props: {
    tokens: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      search: '',
    };
  },
  computed: {
    tokensArray() {
      return this.search
        ? this.tokens.filter((token) => `${token.name} ${token.symbol}`.toLowerCase().includes(this.search.toLowerCase()))
        : this.tokens;
    },
  },
  methods: {
    async onClick(token) {
      await this.$router.push(`/tokens/${token.token_contract_address_hash?.hex || ''}`);
    },
    tokenIconUrl(token) {
      return token.metadata?.urlLink || '';
    },
    tokenSymbol(token) {
      return token.symbol || '';
    },
  },
};
</script>

<style lang="scss" scoped>
.tokens {
  background: $white;
  box-shadow: 0 47.1676px 61.4131px rgba(10, 27, 61, 0.078707), 0 26.7219px 32.8344px rgba(10, 27, 61, 0.0629546), 0 14.4955px 18.4067px rgba(10, 27, 61, 0.0598272), 0 6.96225px 9.77565px rgba(10, 27, 61, 0.0584222), 0 2.43911px 4.06787px rgba(10, 27, 61, 0.0492837);
  border-radius: 6px;
  max-height: 499px;
  padding-top: 15px;

  &__search {
    background: $black0;
    border-radius: 6px;
    margin: 15px 10px 15px;
  }
}

.token {
  padding: 15px 0 15px 15px;
  border-bottom: 1px solid $black100;

  &:hover {
    background: $black0;
    cursor: pointer;
  }

  &-wrapper {
    max-height: 200px;
    height: 100%;
    min-width: 100%;
    overflow: hidden;
    &:hover {
      overflow-y: auto;
      overscroll-behavior-y: contain;
    }
  }

  &__item {
    @include text-simple;
    @include normal-font-size;
    display: flex;
    align-items: center;
  }

  &__image {
    margin-right: 10px;
  }

  &__code {
    @include text-simple;
    @include normal-font-size;
    font-size: 14px;
    color: $black300;
    margin-top: 10px;
  }
}
</style>
