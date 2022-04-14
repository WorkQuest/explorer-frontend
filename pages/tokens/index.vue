<template>
  <div class="tokens">
    <base-table
      id="tokens-table"
      class="tokens__table"
      :title="$tc('ui.token.tracker')"
      :items="tokens"
      :fields="tableHeaders"
      type="tokens"
      :table-busy="tableBusy"
      :skeleton="{rows: limit, columns: tableHeaders.length}"
    />
    <paginator
      v-if="totalPages > 1"
      v-model="page"
      class="tokens__pager"
      :total-pages="totalPages"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'TokensTracker',
  data() {
    return {
      limit: 20,
      offset: 0,
      page: +this.$route.query?.page || 1,
      tableBusy: false,
    };
  },
  computed: {
    ...mapGetters({
      allTokensCount: 'tokens/getAllTokensCount',
      allTokens: 'tokens/getAllTokens',
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
        {
          key: 'index',
          label: '#',
          sortable: false,
          formatter: () => this.offset + 1,
        },
        {
          key: 'token',
          label: this.$t('ui.token.token'),
          sortable: true,
          formatter: (value, key, item) => {
            const { name, symbol } = item;
            const link = item.contract_address_hash.hex;
            return {
              name,
              symbol,
              link,
            };
          },
        },
        {
          key: 'volume',
          label: this.$t('ui.token.volume'),
          sortable: true,
          formatter: (value, key, item) => {
            const { decimals } = item;
            const convertedVolume = this.ConvertFromDecimals(item.total_supply, decimals);
            return this.NumberFormat(convertedVolume);
          },
        },
        {
          key: 'holders',
          label: this.$t('ui.token.holders'),
          sortable: true,
          formatter: (value, key, item) => this.NumberFormat(item.holder_count),
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
    this.tableBusy = true;
    if (!isSearch || !this.allTokensCount) {
      await this.$store.dispatch('tokens/getAllTokens', this.payload);
    }
    this.tableBusy = false;
    sessionStorage.setItem('backRoute', this.$route.fullPath);
  },
  beforeDestroy() {
    this.$store.commit('tokens/resetTokens');
    sessionStorage.removeItem('backRoute');
  },
};
</script>

<style lang="scss" scoped>
.tokens {
  animation: show 1s 1;
  @include container;
}

@include _767 {
  .tokens {

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
