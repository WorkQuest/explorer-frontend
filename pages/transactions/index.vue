<template>
  <div class="transactions transactions__container">
    <search-filter class="transactions__header" />
    <TableTxs
      class="transactions__table"
      :title="$t('ui.txs')"
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
</template>
<script>
import TableTxs from '~/components/TableTxs/index.vue';

export default {
  name: 'Transactions',
  components: {
    TableTxs,
  },
  data: () => ({
    // txs: [
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b8158',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.06646,
    //     transactionFee: '0.00012718',
    //     symbol: 'BUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07746,
    //     transactionFee: '0.00012719',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102305,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07749,
    //     transactionFee: '0.00012712',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b8158',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.06646,
    //     transactionFee: '0.00012718',
    //     symbol: 'BUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07746,
    //     transactionFee: '0.00012719',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102305,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07749,
    //     transactionFee: '0.00012712',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b8158',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.06646,
    //     transactionFee: '0.00012718',
    //     symbol: 'BUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07746,
    //     transactionFee: '0.00012719',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102305,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07749,
    //     transactionFee: '0.00012712',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b8158',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.06646,
    //     transactionFee: '0.00012718',
    //     symbol: 'BUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07746,
    //     transactionFee: '0.00012719',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102305,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07749,
    //     transactionFee: '0.00012712',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b8158',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.06646,
    //     transactionFee: '0.00012718',
    //     symbol: 'BUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07746,
    //     transactionFee: '0.00012719',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102305,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07749,
    //     transactionFee: '0.00012712',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b8158',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.06646,
    //     transactionFee: '0.00012718',
    //     symbol: 'BUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07746,
    //     transactionFee: '0.00012719',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102305,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07749,
    //     transactionFee: '0.00012712',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b8158',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.06646,
    //     transactionFee: '0.00012718',
    //     symbol: 'BUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102304,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07746,
    //     transactionFee: '0.00012719',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    //   {
    //     id: 17102305,
    //     hash: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
    //     fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
    //     toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
    //     value: 0.07749,
    //     transactionFee: '0.00012712',
    //     symbol: 'WUSD',
    //     timestamp: '10 secs ago',
    //   },
    // ],
    currentPage: 1,
    txs: [],
  }),
  computed: {
    totalPagesValue() {
      return this.setTotalPages(this.txs.length, 20);
    },
  },
  async mounted() {
    this.SetLoader(true);
    const blocksRes = await this.$axios.get('/v1/txs');
    this.txs = blocksRes.data.result.txs;
    this.SetLoader(false);
    console.log('TXS', this.txs);
  },
};
</script>

<style lang="scss" scoped>
.transactions {
    &__container {
        @include container;
    }
    &__header {
      margin-top: 30px;
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
</style>
