<template>
  <div class="contract">
    <search-filter class="contract__search" />
    <div class="contract__header">
      <h4 class="contract__title">
        Contract
      </h4>
      <p
        class="contract__contract"
      >
        0x7811B8604c64D62D02dc7e5a8c47185B1b59E0b3
        <span class="icon-copy" />
      </p>
    </div>
    <div class="contract__info">
      <Overview />
      <MoreInfo />
    </div>
    <div class="contract__tables tables">
      <div class="tables__menu">
        <span
          class="tables__tab_txs"
          :class="{tables__tab_active: activeElement === 'tables__tab_txs'}"
          @click="onClick"
        >Transactions</span>
        <span
          class="tables__tab_internal"
          :class="{tables__tab_active: activeElement === 'tables__tab_internal'}"
          @click="onClick"
        >Internal Txns</span>
        <span
          class="tables__tab_erc"
          :class="{tables__tab_active: activeElement === 'tables__tab_erc'}"
          @click="onClick"
        >ERC-20 Token Txns</span>
      </div>
      <div
        v-if="activeElement === 'tables__tab_txs'"
        class="tables__txs"
      >
        <TableTxs
          class="tables__table"
          :title="$t('ui.txs')"
          :is-only="false"
          :items="txs"
          :fields="[
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
            }
          ]"
        />
        <base-pager
          v-if="totalPagesValue > 1"
          v-model="currentPage"
          :total-pages="totalPagesValue"
        />
      </div>
      <div
        v-if="activeElement === 'tables__tab_internal'"
        class="tables__internal"
      >
        <TableTxs
          class="tables__table"
          :title="$t('ui.txs')"
          :is-only="false"
          :items="internal"
          :fields="[
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
          ]"
        />
        <base-pager
          v-if="totalPagesValue > 1"
          v-model="currentPage"
          :total-pages="totalPagesValue"
        />
      </div>
      <div
        v-if="activeElement === 'tables__tab_erc'"
        class="tables__erc"
      >
        <TableTxs
          class="tables__table"
          :title="$t('ui.txs')"
          :is-only="false"
          :items="erc"
          :fields="[
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
              key: 'token', label: this.$t('ui.tx.token'), sortable: true,
            },
          ]"
        />
        <base-pager
          v-if="totalPagesValue > 1"
          v-model="currentPage"
          :total-pages="totalPagesValue"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Overview from '~/components/Overview.vue';
import MoreInfo from '~/components/MoreInfo.vue';

export default {
  name: 'Contract',
  components: {
    Overview,
    MoreInfo,
  },
  data: () => ({
    activeElement: 'tables__tab_txs',
    currentPage: 1,
    txs: [],
    internal: [
      {
        blockNumber: 17102304,
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
      },
      {
        blockNumber: 17102305,
        timestamp: '35 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664700000000000000,
      },
      {
        blockNumber: 17102306,
        timestamp: '45 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664800000000000000,
      },
    ],
    erc: [
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
      {
        id: '0x9ef45a5f717b9315917105c3ea920c593a591ea3',
        timestamp: '25 secs ago',
        fromAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        toAddress: '0xebb2e87085808be55824edb0085c5a5dc7888147',
        value: 664600000000000000,
        token: 'Aavegotchi Ghost Token (GHST)',
      },
    ],
  }),
  computed: {
    totalPagesValue() {
      if (this.activeElement === 'tables__tab_txs') {
        return this.setTotalPages(this.txs.length, 20);
      } if (this.activeElement === 'tables__tab_internal') {
        return this.setTotalPages(this.internal.length, 20);
      } if (this.activeElement === 'tables__tab_erc') {
        return this.setTotalPages(this.erc.length, 20);
      }
      return 1;
    },
  },
  async mounted() {
    this.SetLoader(true);
    const txsRes = await this.$axios.get('/v1/txs');
    this.txs = txsRes.data.result.txs;
    this.SetLoader(false);
  },
  methods: {
    onClick(event) {
      this.activeElement = event.target.className;
    },
  },
};
</script>

<style lang="scss" scoped>
.contract {
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
  }
}
.tables {
  background: $white;
  border-radius: 6px;
  padding-top: 20px;
  min-height: 450px;
  &__menu {
    margin: 0 0 27px 20px
  }
  &__tab {
    &_txs, &_erc, &_internal {
    @include text-simple;
    margin-right: 20px;
    padding-bottom: 12px;
    color: $black500;
    cursor: pointer;
    }
    &_active {
        @include text-simple;
        border-bottom: 2px solid $blue;
    }
    }
}
.icon-copy::before {
  color: $blue;
  font-size: 20px;
  cursor: pointer;
}
</style>
