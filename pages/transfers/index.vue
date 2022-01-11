<template>
  <div class="transfer transfer__container">
    <search-filter class="transfer__search" />
    <base-field
      v-model="search"
      class="transfer__search_mobile"
      :is-search="true"
      :is-hide-error="true"
      :placeholder="$t('ui.forms.searchPlaceholder')"
    />
    <TableTxs
      class="transfer__table"
      :title="$t('ui.token.token')+' '+$t('ui.token.transfers')"
      :items="transfers"
      :tokens="tokens"
      :fields="tableHeaders"
    />
    <div class="tables__transactions">
      <p class="tables__title">
        {{ $t('ui.token.token')+' '+$t('ui.token.transfers') }}
      </p>
      <Transaction
        v-for="(item, i) in transfers"
        :key="i"
        class="tables__transaction"
        :transaction="item"
        :is-last="transfers[i] === transfers[transfers.length - 1]"
        :is-home="true"
        :tokens="tokens"
        :is-token="true"
      />
    </div>
    <base-pager
      v-if="totalPagesValue > 1"
      v-model="currentPage"
      class="transfer__pager"
      :total-pages="totalPagesValue"
    />
  </div>
</template>
<script>
import TableTxs from '~/components/TableTxs/index.vue';
import Transaction from '~/components/mobile/transaction.vue';

export default {
  name: 'Transfer',
  components: {
    TableTxs,
    Transaction,
  },
  data() {
    return {
      currentPage: 1,
      search: '',
      transfers: [
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '2021-11-24T09:19:08.000Z',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
        {
          id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
          timestamp: '2021-11-24T09:19:08.000Z',
          fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
          value: 664600000000000000,
          token: 'GHST',
        },
      ],
      tokens: {
        USDT: {
          name: 'Tether USD',
          description: 'Tether gives you the joint benefits of open blockchain technology and traditional currency by converting your cash into a stable digital currency equivalent.',
        },
        BUSD: {
          name: 'Binance USD',
          description: 'Binance USD (BUSD) is a dollar-backed stablecoin issued and custodied by Paxos Trust Company, and regulated by the New York State Department of Financial Services. BUSD is available directly for sale 1:1 with USD on Paxos.com and will be listed for trading on Binance.',
        },
        GHST: {
          name: 'Aavegotchi Ghost Token',
          description: 'Aavegotchis are crypto-collectibles living on the Ethereum blockchain, backed by the ERC721 standard used in popular blockchain games. $GHST is the official utility token of the Aavegotchi ecosystem and can be used to purchase portals, wearables, and consumables.',
        },
      },
    };
  },
  computed: {
    totalPagesValue() {
      return this.setTotalPages(this.transfers.length, 20);
    },
    tableHeaders() {
      return [
        {
          key: 'id', label: this.$t('ui.tx.transaction'), sortable: true,
        },
        {
          key: 'timestamp', label: this.$t('ui.block.age'), sortable: true,
        },
        {
          key: 'fromAddress', label: this.$t('ui.tx.from'), sortable: true,
        },
        {
          key: 'toAddress', label: this.$t('ui.tx.to'), sortable: true,
        },
        {
          key: 'value', label: this.$t('ui.tx.value'), sortable: true,
        },
        {
          key: 'token', label: this.$t('ui.token.token'), sortable: true,
        },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
};
</script>

<style lang="scss" scoped>
.transfer {
  animation: show  1s 1;
    &__container {
        @include container;
    }
    &__search {
    margin: 25px 0;
      &_mobile {
        display: none;
      }
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
  &__search {
      display: none;
      &_mobile {
        display: block;
        background: $white;
        border-radius: 6px;
        padding: 10px 14px;
        margin: 25px 16px;
      }
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
