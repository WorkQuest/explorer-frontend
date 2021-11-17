<template>
  <div class="transactions">
    <search-filter class="transactions__search" />
    <div class="transactions__wrap">
      <div
        v-if="query"
        class="transactions__header"
      >
        <h5 class="transactions__title">
          {{ $t('ui.tx.total') }} 406 {{ $t('ui.tx.found') }}
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
      <TableTxs
        class="transactions__table"
        :is-only="false"
        :items="txs"
        :fields="tableHeaders"
      />
      <base-pager
        v-if="totalPagesValue > 1"
        v-model="currentPage"
        :total-pages="totalPagesValue"
      />
    </div>
  </div>
</template>
<script>
import TableTxs from '~/components/TableTxs/index.vue';

export default {
  name: 'Transactions',
  components: {
    TableTxs,
  },
  data() {
    return {
      currentPage: 1,
      txs: [],
      query: '',
    };
  },
  computed: {
    totalPagesValue() {
      return this.setTotalPages(this.txs.length, 20);
    },
    tableHeaders() {
      return [
        {
          key: 'id', label: this.$t('ui.tx.transaction'), sortable: true,
        },
        {
          key: 'blockNumber', label: this.$t('ui.block.blockNumber'), sortable: true,
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
          key: 'gasUsed', label: this.$t('ui.tx.fee'), sortable: true,
        },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    const txsRes = await this.$axios.get('/v1/txs');
    this.txs = txsRes.data.result.txs;
    this.query = this.$route.query.block;
    this.SetLoader(false);
  },
};
</script>

<style lang="scss" scoped>
.transactions {
    @include container;
    &__search {
      margin: 25px 0;
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
@include _991 {
  .transactions {
  }
}
</style>
