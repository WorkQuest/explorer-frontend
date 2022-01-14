<template>
  <div class="transactions">
    <search-filter class="transactions__search" />
    <base-field
      v-model="search"
      class="transactions__search_mobile"
      :is-search="true"
      :is-hide-error="true"
      :placeholder="$t('ui.forms.searchPlaceholder')"
    />
    <div class="transactions__wrap">
      <div
        v-if="query"
        class="transactions__header"
      >
        <h5 class="transactions__title">
          {{ $t('ui.tx.total') }} {{ txsTable.length }} {{ $t('ui.tx.found') }}
        </h5>
        <p class="transactions__block">
          {{ $t('ui.tx.forBlock') }}
          <nuxt-link
            class="transactions__link"
            :to="`/blocks/`+query"
          >
            {{ query }}
          </nuxt-link>
        </p>
      </div>
      <p
        v-else
        class="transactions__header"
      >
        {{ $t('ui.txs') }}
      </p>
      <table-txs
        class="transactions__table"
        :is-only="false"
        :items="txsTable"
        :fields="tableHeaders"
      />
      <transaction
        v-for="(item, i) in txsTable"
        :key="i"
        class="transactions__transaction"
        :transaction="item"
        :is-last="query ? currentBlock.txs[i]
          : txs[i] === query ? currentBlock.txs[txs.length - 1]
            : txs[txs.length - 1]"
      />
      <base-pager
        v-if="totalPages > 1"
        v-model="page"
        class="transactions__pager"
        :total-pages="totalPages"
      />
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Transactions',
  data() {
    return {
      limit: 20,
      offset: 0,
      page: 1,
      search: '',
    };
  },
  computed: {
    ...mapGetters({
      txs: 'tx/getTxs',
      txsCount: 'tx/getTxsCount',
      currentBlock: 'blocks/getCurrentBlock',
    }),
    query() {
      return this.$route.query.block;
    },
    txsTable() {
      if (this.query) return this.currentBlock.txs;
      return this.txs;
    },
    payload() {
      return {
        limit: this.limit,
        offset: this.offset,
      };
    },
    totalPages() {
      return Math.ceil(this.query ? this.currentBlock.txs.length : this.txsCount / this.limit);
    },
    tableHeaders() {
      return [
        { key: 'id', label: this.$t('ui.tx.transaction'), sortable: true },
        { key: 'blockNumber', label: this.$t('ui.block.blockNumber'), sortable: true },
        { key: 'timestamp', label: this.$t('ui.block.age'), sortable: true },
        { key: 'fromAddress', label: this.$t('ui.tx.from'), sortable: true },
        { key: 'toAddress', label: this.$t('ui.tx.to'), sortable: true },
        { key: 'value', label: this.$t('ui.tx.value'), sortable: true },
        { key: 'gasUsed', label: this.$t('ui.tx.fee'), sortable: true },
      ];
    },
  },
  watch: {
    async page() {
      await this.SetLoader(true);
      this.offset = (this.page - 1) * this.limit;
      await this.$store.dispatch('tx/getTxs', this.payload);
      await this.SetLoader(false);
    },
  },
  async mounted() {
    await this.SetLoader(true);
    if (this.query) await this.$store.dispatch('blocks/getBlockById', this.$route.query.block);
    if (!this.query) await this.$store.dispatch('tx/getTxs', this.payload);
    await this.SetLoader(false);
  },
};
</script>

<style lang="scss" scoped>
.transactions {
  animation: show 1s 1;
  @include container;

  &__search {
    margin: 25px 0;

    &_mobile {
      display: none;
    }
  }

  &__header {
    padding: 20px 0 0 20px;
  }

  &__title {
    @include text-simple;
    @include normal-font-size;
  }

  &__block {
    @include text-simple;
    @include normal-font-size;
    color: $black300;
    font-size: 14px;
  }

  &__wrap {
    background: $white;
    border-radius: 6px;
  }

  &__table {
    margin: 25px 0;
  }

  &__transaction {
    display: none;
  }

  &__grey {
    color: $black500;
  }

  &__link {
    @include link;
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

@include _767 {
  .transactions {
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

    &__wrap {
      padding: 20px 16px 0 16px;
    }

    &__header {
      padding: 0;
    }

    &__transaction {
      display: block;
    }

    &__pager {
      margin: 16px;
    }
  }
}
</style>
