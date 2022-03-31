<template>
  <div
    v-if="!isLoading && Object.keys(txs).length > 0"
    class="address"
  >
    <search-filter class="address__search" />
    <div class="address__header">
      <h4 class="address__title">
        {{ $t('ui.token.address') }}
      </h4>
      <p class="address__address">
        {{ address }}
        <button
          v-clipboard:copy="address"
          v-clipboard:success="ClipboardSuccessHandler"
          v-clipboard:error="ClipboardErrorHandler"
          class="btn__copy"
          type="button"
        >
          <span class="icon-copy" />
        </button>
      </p>
    </div>
    <div class="address__info">
      <overview />
    </div>
    <div class="address__txs">
      <table-txs
        class="address__table"
        :title="$tc('ui.txs')"
        :items="txs"
        :fields="tableFields"
      />
      <p class="address__subtitle">
        {{ $t('ui.txs') }}
      </p>
      <transaction
        v-for="(item, i) in txs"
        :key="i"
        class="address__transaction"
        :transaction="item"
        :is-last="txs[i] === txs[txs.length - 1]"
      />
    </div>
    <base-pager
      v-if="totalPages > 1"
      v-model="page"
      class="address__pager"
      :total-pages="totalPages"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'AddressId',
  data() {
    return {
      search: '',
      page: 1,
      limit: 10,
      offset: 0,
    };
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      txs: 'tx/getTxsByAccount',
      txsCount: 'tx/getTxsByAccountCount',
      accountInfo: 'account/getAccountInfo',
    }),
    payload() {
      return {
        address: this.address,
        limit: this.limit,
        offset: (this.page - 1) * this.limit,
      };
    },
    address() {
      return Object.keys(this.accountInfo).length > 0 && this.accountInfo.hash?.hex ? this.accountInfo.hash.hex : this.$route.params.id;
    },
    totalPages() {
      return this.setTotalPages(this.txsCount, this.limit);
    },
    tableFields() {
      return [
        { key: 'hash', label: this.$t('ui.tx.transaction'), sortable: true },
        { key: 'block_number', label: this.$t('ui.block.blockNumber'), sortable: true },
        { key: 'age', label: this.$t('ui.block.age'), sortable: true },
        { key: 'from_address_hash.hex', label: this.$t('ui.tx.from'), sortable: true },
        { key: 'to_address_hash.hex', label: this.$t('ui.tx.to'), sortable: true },
        { key: 'value', label: this.$t('ui.tx.value'), sortable: true },
        { key: 'gas_used', label: this.$t('ui.tx.fee'), sortable: true },
      ];
    },
  },
  watch: {
    async page(current, previous) {
      if (current !== previous) {
        await this.getAccountData();
      }
    },
  },
  async mounted() {
    await this.getAccountData();
  },
  beforeDestroy() {
    this.$store.commit('account/resetAccountInfo');
    this.$store.commit('tx/resetTxsByAccount');
  },
  methods: {
    async getAccountData() {
      if (!this.accountInfo.hash?.hex) {
        await this.SetLoader(true);
        await this.$store.dispatch('account/getAccountByAddress', { address: this.address, commonLimit: this.limit });
        await this.SetLoader(false);
      }
      await this.$store.dispatch('tx/getTxsByAccount', this.payload);
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
  @include container;

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
    &__table {
      display: none;
    }

    &__header {
      display: block;
      word-wrap: break-word;
      max-width: 700px;
    }

    &__address, &__title {
      margin-left: 16px;
    }

    &__txs {
      background: $white;
      padding: 16px;
    }

    &__subtitle, &__transaction {
      display: block;
    }

    &__pager {
      margin: 16px;
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
