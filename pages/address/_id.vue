<template>
  <div class="address">
    <div class="address__header">
      <h4 class="address__title">
        {{ $t('ui.token.address') }}
      </h4>
      <p class="address__address">
        {{ address }}
        <button-copy
          :value="address"
          icon-color="primary"
        />
      </p>
    </div>
    <div class="address__info">
      <overview />
    </div>
    <div class="address__txs">
      <base-table
        :id="`address-${id}-table`"
        class="address__table"
        :title="$tc('ui.txs')"
        :items="txs"
        :fields="tableFields"
        :table-busy="tableBusy"
        :type="id"
        :skeleton="{rows: limit, columns: tableFields.length}"
        :sort-by.sync="sortFieldForTable"
        :sort-desc.sync="isSortDesc"
        @table-sort="changeSortParams"
      />
    </div>
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
  name: 'AddressId',
  data() {
    return {
      search: '',
      page: 1,
      limit: 10,
      offset: 0,
      tableBusy: false,
      id: 'transactions',
      sortDirection: sortDirections.DESC,
      sortField: sortTables.transactions.blockNumber,
    };
  },
  computed: {
    ...mapGetters({
      txs: 'tx/getTxsByAccount',
      txsCount: 'tx/getTxsByAccountCount',
      WUSDSymbol: 'tokens/getWUSDTokenSymbol',
      WUSDDecimal: 'tokens/getWUSDTokenDecimals',
      accountInfo: 'account/getAccountInfo',
    }),
    payload() {
      return {
        address: this.address,
        query: {
          limit: this.limit,
          offset: (this.page - 1) * this.limit,
          'sort[field]': this.sortField,
          'sort[type]': this.sortDirection,
        },
      };
    },
    address() {
      return Object.keys(this.accountInfo).length > 0 && this.accountInfo.hash?.bech32 ? this.accountInfo.hash.bech32 : this.$route.params.id;
    },
    totalPages() {
      return this.setTotalPages(this.txsCount, this.limit);
    },
    tableFields() {
      return [
        {
          key: 'hash',
          label: this.$t('ui.tx.transaction'),
          sortable: isSortable(this.id, 'hash'),
        },
        {
          key: 'age',
          label: this.$t('ui.block.age'),
          sortable: isSortable(this.id, 'age'),
          formatter: (value, key, item) => this.formatDataFromNow(item.block.timestamp),
        },
        {
          key: 'blockNumber',
          label: this.$t('ui.block.blockNumber'),
          sortable: isSortable(this.id, 'blockNumber'),
          formatter: (value, key, item) => item.block_number,
        },
        {
          key: 'addressFrom',
          label: this.$t('ui.tx.from'),
          sortable: isSortable(this.id, 'addressFrom'),
          formatter: (value, key, item) => item.from_address_hash?.bech32 || '',
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
          formatter: (value) => `${this.ConvertFromDecimals(value, this.WUSDDecimal, 4)} ${this.WUSDSymbol}`,
        },
        {
          key: 'gasUsed',
          label: this.$t('ui.tx.fee'),
          sortable: isSortable(this.id, 'gasUsed'),
          formatter: (value, key, item) => [
            {
              value: this.FormatSmallNumber(this.ConvertFromDecimals(item.gas_used * item.gas_price, this.WUSDDecimal)),
              class: 'grey',
            },
          ],
        },
      ];
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
        await this.getTxsByAccount();
      }
    },
  },
  async mounted() {
    await this.getAccountData();
    await this.getTxsByAccount();
  },
  beforeDestroy() {
    this.$store.commit('account/resetAccountInfo');
    this.$store.commit('tx/resetTxsByAccount');
  },
  methods: {
    async getAccountData() {
      if (!this.accountInfo.hash?.bech32) {
        await this.SetLoader(true);
        await this.$store.dispatch('account/getAccountByAddress', { address: this.address, commonLimit: this.limit });
        await this.SetLoader(false);
      }
    },
    async getTxsByAccount() {
      this.tableBusy = true;
      await this.$store.dispatch('tx/getTxsByAccount', this.payload);
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
        await this.getTxsByAccount();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  &__copy {
    height: 35px;
    width: 35px;
    align-items: center;
    justify-items: center;
    border: 1px solid $black0;
    padding: 5px;
    border-radius: 6px;
    transition: .5s;

    &:hover {
      background: $black100;
    }
  }
}

.address {
  animation: show 1s 1;
  @include container;
  padding-left: 0;
  padding-right: 0;

  &__search {
    margin: 25px 0;
  }

  &__header {
    display: flex;
    grid-gap: 10px;
    align-items: center;
    margin-bottom: 25px;
  }

  &__info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 25px;
    margin-bottom: 25px;
    background: $white;
    border-radius: 6px;
  }

  &__table {
    min-height: 450px;
  }

  &__subtitle, &__transaction {
    display: none;
  }

  &__title, &__address {
    margin-bottom: 0;
  }
}

.icon-copy {
  color: $blue;
  font-size: 20px;
  cursor: pointer;
}

@include _767 {
  .address {
    &__header {
      display: block;
      word-wrap: break-word;
      max-width: 700px;
    }

    &__address, &__title {
      margin-left: 16px;
    }

    &__subtitle, &__transaction {
      display: block;
    }
  }
}

@include _575 {
  .address {
    &__header {
      max-width: 500px;
    }
  }
}

@include _480 {
  .address {
    &__header {
      max-width: 400px;
    }
  }
}

@include _380 {
  .address {
    &__header {
      max-width: 300px;
    }
  }
}
</style>
