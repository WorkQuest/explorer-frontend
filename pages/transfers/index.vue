<template>
  <div class="transfer">
    <base-table
      :id="`${id}-table`"
      class="transfer__table"
      :title="$t('ui.token.token')+' '+$t('ui.token.transfers')"
      :items="allTokenTransfers"
      :fields="tableHeaders"
      :table-busy="tableBusy"
      :type="id"
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
  name: 'Transfers',
  data() {
    return {
      limit: 20,
      offset: 0,
      page: +this.$route.query?.page || 1,
      tableBusy: false,
      sortDirection: sortDirections.DESC,
      sortField: sortTables.transfers.age,
      id: 'transfers',
      sessionKey: 'transfersPagination',
    };
  },
  computed: {
    ...mapGetters({
      allTokenTransfers: 'tokens/getAllTokenTransfers',
      allTokenTransfersCount: 'tokens/getAllTokenTransfersCount',
    }),
    totalPages() {
      return this.setTotalPages(this.allTokenTransfersCount, this.limit);
    },
    tableHeaders() {
      return [
        {
          key: 'hash',
          label: this.$t('ui.tx.transaction'),
          sortable: isSortable(this.id, 'hash'),
          formatter: (value, key, item) => item.transaction_hash,
        },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: isSortable(this.id, 'age'),
          formatter: (value, key, item) => this.formatDataFromNow(item.block.timestamp),
        },
        {
          key: 'addressFrom',
          label: this.$t('ui.tx.from'),
          sortable: isSortable(this.id, 'addressFrom'),
          formatter: (value, key, item) => item.from_address_hash.bech32 || '',
        },
        {
          key: 'addressTo',
          label: this.$t('ui.tx.to'),
          sortable: isSortable(this.id, 'addressTo'),
          formatter: (value, key, item) => item.to_address_hash?.bech32 || '',
        },
        {
          key: 'value',
          label: this.$t('ui.tx.value'),
          sortable: isSortable(this.id, 'value'),
          formatter: (value, key, item) => {
            const { decimals } = item.tokenContractAddress.token;
            return this.ConvertFromDecimals(item.amount, decimals || 0, 6);
          },
        },
        {
          key: 'token',
          label: this.$t('ui.token.token'),
          sortable: isSortable(this.id, 'token'),
          formatter: (value, key, item) => {
            const { name, symbol } = item.tokenContractAddress?.token;
            const link = item.tokenContractAddress.hash.bech32;
            return {
              name,
              symbol,
              link,
            };
          },
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
        this.SaveToStorage(this.sessionKey, this.payload);
        await this.$router.push({ query: { ...this.$route.query, page: this.page.toString() } });
      }
    },
  },
  async mounted() {
    this.updateFromSessionStorage();
    await this.getTokenTransfers();
    sessionStorage.setItem('backRoute', this.$route.fullPath);
  },
  beforeDestroy() {
    if (this.$route.name !== 'tx-id') {
      sessionStorage.removeItem('backRoute');
    }
    if (this.$route.name !== this.id) {
      this.DeleteFromStorage(this.sessionKey);
    }
  },
  methods: {
    async getTokenTransfers() {
      this.tableBusy = true;
      await this.$store.dispatch('tokens/getAllTokensTransfers', this.payload);
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
        this.SaveToStorage(this.sessionKey, this.payload);
        await this.getTokenTransfers();
      }
    },
    updateFromSessionStorage() {
      if (this.IsStorageHaveKey(this.sessionKey)) {
        const payload = { ...this.GetFromStorage(this.sessionKey) };
        this.sortField = payload['sort[field]'];
        this.sortDirection = payload['sort[type]'];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.transfer {
  animation: show 1s 1;
  @include container;
}

</style>
