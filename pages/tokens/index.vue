<template>
  <div class="tokens">
    <base-table
      :id="`${id}-table`"
      class="tokens__table"
      :title="$tc('ui.token.tracker')"
      :items="tokens"
      :fields="tableHeaders"
      :type="id"
      :table-busy="tableBusy"
      :skeleton="{rows: limit, columns: tableHeaders.length}"
      :sort-by.sync="sortFieldForTable"
      :sort-desc.sync="isSortDesc"
      @table-sort="changeSortParams"
    />
    <paginator
      v-if="totalPages > 1"
      v-model="page"
      :total-pages="totalPages"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { isSortable, sortDirections, sortTables } from '~/utils';

export default {
  name: 'Tokens',
  data() {
    return {
      limit: 20,
      offset: 0,
      page: +this.$route.query?.page || 1,
      tableBusy: false,
      sortDirection: sortDirections.DESC,
      sortField: sortTables.tokens.holders,
      id: 'tokens',
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
          sortable: isSortable(this.id, 'index'),
          formatter: () => this.offset + 1,
        },
        {
          key: 'token',
          label: this.$t('ui.token.token'),
          sortable: isSortable(this.id, 'token'),
          formatter: (value, key, item) => {
            const { name, symbol, metadata } = item;
            const link = item.contract_address_hash.bech32;
            const description = metadata ? metadata.description : null;
            const iconUrl = metadata ? metadata.iconUrl : null;
            return {
              name,
              symbol,
              link,
              description,
              iconUrl,
            };
          },
        },
        {
          key: 'volume',
          label: this.$t('ui.token.volume'),
          sortable: isSortable(this.id, 'volume'),
          formatter: (value, key, item) => {
            const { decimals } = item;
            const convertedVolume = this.ConvertFromDecimals(value, decimals, 2);
            return this.NumberFormat(convertedVolume);
          },
        },
        {
          key: 'holders',
          label: this.$t('ui.token.holders'),
          sortable: isSortable(this.id, 'holders'),
          formatter: (value, key, item) => this.NumberFormat(item.holder_count),
        },
      ];
    },
    payload() {
      return {
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
        'sort[field]': this.sortField,
        'sort[type]': this.sortDirection,
      };
    },
    sortFieldForTable() {
      return this.GetSortKeyByValue(this.id, this.sortField);
    },
    sortDirectionForTable() {
      return this.sortDirection.toLowerCase();
    },
    isSortDesc() {
      return this.sortDirectionForTable === 'desc';
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
    await this.getTokens();
    sessionStorage.setItem('backRoute', this.$route.fullPath);
  },
  beforeDestroy() {
    this.$store.commit('tokens/resetTokens');
    sessionStorage.removeItem('backRoute');
  },
  methods: {
    async getTokens() {
      const isSearch = this.$route.query?.search;
      this.tableBusy = true;
      if (!isSearch || !this.allTokensCount) {
        await this.$store.dispatch('tokens/getAllTokens', this.payload);
        await this.$store.dispatch('tokens/getTokenPrices');
      }
      this.tableBusy = false;
    },
    async changeSortParams(params) {
      const { sortBy, sortDesc } = params;
      if (sortBy !== this.sortFieldForTable) {
        this.sortDirection = sortDirections.DESC;
      } else {
        this.sortDirection = this.sortDirection === sortDirections.ASC ? sortDirections.DESC : sortDirections.ASC;
      }
      this.sortField = sortTables[this.id][sortBy];
      if (sortBy) {
        await this.getTokens();
      }
    },
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
