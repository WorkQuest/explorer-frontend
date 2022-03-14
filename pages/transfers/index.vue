<template>
  <div class="transfer transfer__container">
    <search-filter class="transfer__search" />
    <table-txs
      class="transfer__table"
      :title="$t('ui.token.token')+' '+$t('ui.token.transfers')"
      :items="allTokenTransfers"
      :fields="tableHeaders"
    />
    <div class="tables__transactions">
      <p class="tables__title">
        {{ $t('ui.token.token') + ' ' + $t('ui.token.transfers') }}
      </p>
      <!--      <transaction-->
      <!--        v-for="(item, i) in allTokenTransfers"-->
      <!--        :key="i"-->
      <!--        class="tables__transaction"-->
      <!--        :transaction="item"-->
      <!--        :is-last="allTokenTransfers[i] === allTokenTransfers[allTokenTransfers.length - 1]"-->
      <!--        :is-home="true"-->
      <!--        :is-token="true"-->
      <!--      />-->
    </div>
    <base-pager
      v-if="totalPagesValue > 1"
      v-model="page"
      class="transfer__pager"
      :total-pages="totalPagesValue"
    />
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Transfer',
  data() {
    return {
      page: 1,
      limit: 20,
      offset: 0,
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
        offset: this.offset,
      };
    },
    totalPagesValue() {
      return this.setTotalPages(this.allTokenTransfersCount, this.limit);
    },
    tableHeaders() {
      return [
        { key: 'hash', label: this.$t('ui.tx.transaction'), sortable: true },
        { key: 'age', label: this.$t('ui.block.age'), sortable: true },
        { key: 'from_address_hash.hex', label: this.$t('ui.tx.from'), sortable: true },
        { key: 'to_address_hash.hex', label: this.$t('ui.tx.to'), sortable: true },
        {
          key: 'transfer_amount',
          label: this.$t('ui.tx.value'),
          sortable: true,
          formatter: (value, key, item) => this.ConvertFromDecimals(item.amount, item.decimals || 18),
        },
        {
          key: 'tokenContractAddress',
          abel: this.$t('ui.token.token'),
          sortable: true,
          formatter: (value, key, item) => `${item.tokenContractAddress.token.name} (${item.tokenContractAddress.token.symbol})`,
        },
      ];
    },
  },
  watch: {
    async page() {
      this.offset = (this.page - 1) * this.limit;
      await this.getTokenTransfers();
    },
  },
  async mounted() {
    await this.getTokenTransfers();
  },
  methods: {
    async getTokenTransfers() {
      await this.SetLoader(true);
      await this.$store.dispatch('tokens/getAllTokensTransfers', this.payload);
      await this.SetLoader(false);
    },
  },
};
</script>

<!--
{
        "transaction_hash": "0xb606fa187c5cd71beb30d9f3b9ae207c3cd3254ff824e798dbe3a9a72960752e",
        "from_address_hash": {
          "hex": "0x20966b2da806a2daf74ef049678a5569e9e1f2c9",
          "bech32": "wq1yztxktdgq63d4a6w7pyk0zj4d857rukfmpfqgt"
        },
        "to_address_hash": {
          "hex": "0x60716ce1ad79d2489b937a3d2df4327095cffbb3",
          "bech32": "wq1vpckecdd08fy3xun0g7jmapjwz2ul7anp5aep3"
        },
        "token_contract_address_hash": {
          "hex": "0x9c9fe9a77a3b0ed1d3584afadd5873843baf0e12",
          "bech32": "wq1nj07nfm68v8dr56cftad6krnssa67rsj6sceac"
        },
        "amount": "1000000000000000000",
        "block": {
          "timestamp": "2022-03-12T18:55:10.000Z"
        },
        "tokenContractAddress": {
          "hash": {
            "hex": "0x9c9fe9a77a3b0ed1d3584afadd5873843baf0e12",
            "bech32": "wq1nj07nfm68v8dr56cftad6krnssa67rsj6sceac"
          },
          "token": {
            "name": "WQ Binance wrapped",
            "symbol": "BNB"
          }
        }
-->

<style lang="scss" scoped>
.transfer {
  animation: show 1s 1;

  &__container {
    @include container;
  }

  &__search {
    margin: 25px 0;
  }

  &__table {
    margin: 25px 0;
  }

  &__grey {
    color: $black500;
  }
}

.page {
  &__active {
    color: $blue;
  }

  &__common {
    color: $black600;
  }
}

.tables {
  &__transactions {
    display: none;
  }
}

@include _767 {
  .transfer {
    &__table {
      display: none;
    }

    &__pager {
      margin: 16px;
    }
  }
  .tables {
    &__transactions {
      display: block;
      background: $white;
      padding: 16px;
    }
  }
}
</style>
