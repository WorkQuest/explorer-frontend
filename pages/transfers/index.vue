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
      <transaction
        v-for="(item, i) in allTokenTransfers"
        :key="i"
        class="tables__transaction"
        :transaction="item"
        :is-last="allTokenTransfers[i] === allTokenTransfers[allTokenTransfers.length - 1]"
        :is-token="true"
        :is-transfer="true"
      />
    </div>
    <base-pager
      v-if="totalPages > 1"
      v-model="page"
      class="transfer__pager"
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
      offset: ((+this.$route.query?.page || 1) - 1) * 20,
      page: +this.$route.query?.page || 1,
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
    totalPages() {
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
          formatter: (value, key, item) => this.ConvertFromDecimals(item.amount, item.tokenContractAddress.token.decimals, 6),
        },
        {
          key: 'tokenContractAddress',
          label: this.$t('ui.token.token'),
          sortable: true,
        },
      ];
    },
  },
  watch: {
    async page(current, previous) {
      if (current !== previous) {
        this.offset = (this.page - 1) * this.limit;
        await this.$router.push({ query: { ...this.$route.query, page: this.page.toString() } });
      }
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
