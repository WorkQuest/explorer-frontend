<template>
  <div
    v-if="!isLoading"
    class="tokens"
  >
    <search-filter class="tokens__search" />
    <table-tokens
      class="tokens__table"
      :title="$tc('ui.token.tracker')"
      :items="tokens"
      :fields="tableHeaders"
      type="transfers"
    />

    <!--        mobile-->
    <div class="tokens__content">
      <p class="tokens__title">
        {{ $t('ui.token.tracker') }}
      </p>
      <div
        v-for="(token, index) in tokens"
        :key="index"
        class="token"
        :class="{token__separator: (index === tokens.length - 1)}"
      >
        <p class="token__token">
          {{ $t('ui.token.token') }}
        </p>
        <div class="token__header">
          <!--              TODO base64-->
          <img
            :src="require(`~/assets/img/tokens/empty-token.svg`)"
            width="15"
            height="15"
            class="token__image"
            :alt="token.symbol"
          >
          <nuxt-link
            :to="{ path: `/tokens/`+token.contract_address_hash.hex, params: { token: token.contract_address_hash.hex }}"
            class="token__title table__link"
          >
            {{ token.name }} ({{ token.symbol }})
          </nuxt-link>
        </div>
        <p class="token__description">
          {{ token.description ? token.description : '' }}
        </p>
        <div
          v-if="token.total_supply"
          class="token__subtitle"
        >
          {{ $t('ui.token.volume') }}
          <span class="token__info">
            {{ NumberFormat(ConvertFromDecimals(token.total_supply, token.decimals)) }}
          </span>
        </div>
        <div
          v-if="token.holder_count"
          class="token__subtitle"
        >
          {{ $t('ui.token.holders') }}
          <span class="token__info">
            {{ token.holder_count }}
          </span>
        </div>
      </div>
    </div>

    <base-pager
      v-if="totalPages > 1"
      v-model="page"
      class="tokens__pager"
      :total-pages="totalPages"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TableTokens from '~/components/TableTokens';

export default {
  name: 'TokensTracker',
  components: { TableTokens },
  data() {
    return {
      limit: 20,
      offset: 0,
      page: +this.$route.query?.page || 1,
    };
  },
  computed: {
    ...mapGetters({
      allTokensCount: 'tokens/getAllTokensCount',
      allTokens: 'tokens/getAllTokens',
      isLoading: 'main/getIsLoading',
    }),
    totalPages() {
      return this.setTotalPages(this.allTokensCount, this.limit);
    },
    payload() {
      return {
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
      };
    },
    tokens() {
      if (this.allTokensCount > 0) {
        return this.allTokens;
      }
      return [];
    },
    tableHeaders() {
      return [
        { key: 'number', label: '#', sortable: false },
        { key: 'contract_address_hash.hex', label: this.$t('ui.token.token'), sortable: true },
        {
          key: 'total_supply',
          label: this.$t('ui.token.volume'),
          sortable: true,
          formatter: (value, key, item) => this.NumberFormat(this.ConvertFromDecimals(value, item.decimals)),
        },
        {
          key: 'holder_count',
          label: this.$t('ui.token.holders'),
          sortable: true,
          formatter: (value) => this.NumberFormat(value),
        },
      ];
    },
  },
  watch: {
    async page(current, previous) {
      if (current !== previous) {
        await this.$router.push({ query: { ...this.$route.query, page: this.page.toString() } });
      }
    },
  },
  async mounted() {
    const isSearch = this.$route.query?.search;
    if (!isSearch || !this.allTokensCount) {
      await this.SetLoader(true);
      await this.$store.dispatch('tokens/getAllTokens', this.payload);
      await this.SetLoader(false);
    }
  },
  beforeDestroy() {
    this.$store.commit('tokens/resetTokens');
  },
};
</script>

<style lang="scss" scoped>
.tokens {
  animation: show 1s 1;
  margin: 0 auto;

  &__search {
    margin: 25px 0;
  }

  &__table {
    @include container;
  }

  &__content {
    display: none;
  }
}

@include _767 {
  .tokens {
    &__table {
      display: none;
    }

    &__content {
      display: block;
      background: $white;
      padding: 16px;
    }

    &__title {
      @include text-simple;
      @include normal-font-size;
    }

  }
  .token {
    padding: 20px 0;
    border-bottom: 1px solid $black100;

    &__separator {
      border: none;
      padding-bottom: 5px;
    }

    &__token {
      @include text-simple;
      @include normal-font-size;
      font-weight: 600;
      font-size: 14px;
      color: $black300;
    }

    &__header {
      display: flex;
      align-items: center;
    }

    &__title {
      @include text-simple;
      @include normal-font-size;
      @include link;
      font-size: 20px;
      margin: 5px;
    }

    &__description {
      @include text-simple;
      @include normal-font-size;
      font-size: 12px;
      color: $black300;
      max-width: 100%;
      margin: 0;
    }

    &__subtitle {
      font-weight: 600;
      grid-column: 1/3;
      margin-top: 11px;
    }

    &__info {
      font-weight: normal;
      margin-left: 10px;
    }
    &__image {
      border-radius: 50%;
      width: 15px;
      height: 15px;
      overflow: hidden;
      object-fit: cover;
    }
  }
  .table__link {
    width: auto !important;
  }
}
</style>
