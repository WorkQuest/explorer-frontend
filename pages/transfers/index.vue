<template>
  <div
    v-if="!isLoading"
    class="transfer transfer__container"
  >
    <search-filter class="transfer__search" />

    <base-table
      id="transfers-table"
      class="transfer__table"
      :title="$t('ui.token.token')+' '+$t('ui.token.transfers')"
      :items="allTokenTransfers"
      :fields="tableHeaders"
      :table-busy="tableBusy"
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

export default {
  name: 'Transfer',
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
      allTokenTransfers: 'tokens/getAllTokenTransfers',
      allTokenTransfersCount: 'tokens/getAllTokenTransfersCount',
      isLoading: 'main/getIsLoading',
    }),
    payload() {
      return {
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
      };
    },
    totalPages() {
      return this.setTotalPages(this.allTokenTransfersCount, this.limit);
    },
    tableHeaders() {
      return [
        {
          key: 'hash',
          label: this.$t('ui.tx.transaction'),
          sortable: true,
          formatter: (value, key, item) => item.transaction_hash,
        },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: true,
          formatter: (value, key, item) => this.formatDataFromNow(item.block.timestamp),
        },
        {
          key: 'addressFrom',
          label: this.$t('ui.tx.from'),
          sortable: true,
          formatter: (value, key, item) => item.from_address_hash.hex || '',
        },
        {
          key: 'addressTo',
          label: this.$t('ui.tx.to'),
          sortable: true,
          formatter: (value, key, item) => item.to_address_hash?.hex || '',
        },
        {
          key: 'value',
          label: this.$t('ui.tx.value'),
          sortable: true,
          formatter: (value, key, item) => {
            const { decimals } = item.tokenContractAddress.token;
            return this.ConvertFromDecimals(item.amount, decimals || 0, 6);
          },
        },
        {
          key: 'token',
          label: this.$t('ui.token.token'),
          sortable: true,
          /**
           * @param { string } value
           * @param { number } key
           * @param { tokenTransfers } item
           * @memberOf tokenTransfers
           */
          formatter: (value, key, item) => {
            const { name, symbol } = item.tokenContractAddress?.token;
            const link = item.tokenContractAddress.hash.hex;
            return {
              name,
              symbol,
              link,
            };
          },
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
    await this.SetLoader(false);
    await this.getTokenTransfers();
    sessionStorage.setItem('backRoute', this.$route.fullPath);
  },
  beforeDestroy() {
    if (this.$route.name !== 'tx-id') {
      sessionStorage.removeItem('backRoute');
    }
  },
  methods: {
    async getTokenTransfers() {
      this.tableBusy = true;
      await this.$store.dispatch('tokens/getAllTokensTransfers', this.payload);
      this.tableBusy = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.transfer {
  animation: show 1s 1;
  @include container;

  &__search {
    margin: 25px 0;
  }
}

</style>
