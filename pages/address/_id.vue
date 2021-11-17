<template>
  <div class="address">
    <search-filter class="address__search" />
    <div class="address__header">
      <h4 class="address__title">
        {{ $t('ui.token.address') }}
      </h4>
      <p
        class="address__address"
      >
        {{ address }}
        <span class="icon-copy" />
      </p>
    </div>
    <div class="address__info">
      <Overview />
    </div>
    <div
      class="address__txs"
    >
      <TableTxs
        class="address__table"
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
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

export default {
  name: 'AddressId',
  data() {
    return {
      addressInfo: {},
      address: '',
      currentPage: 1,
      txs: [
        {
          blockNumber: 17102304,
          id: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
          fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
          toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
          value: 7746000000000000,
          gasUsed: '0.00012719',
          timestamp: '10 secs ago',
        },
        {
          blockNumber: 17102305,
          id: '0xa7849bd1f330be133ce5665535fc7758669fdb0abbfcaf102b3083481c8b62345',
          fromAddress: '0xe24f99419d788003c0d5212f05f47b1572cdc38a',
          toAddress: '0x917dc1a9e858deb0a5bdcb44c7601f655f728dfe',
          value: 7749000000000000,
          gasUsed: '0.00012712',
          timestamp: '10 secs ago',
        },
      ],
    };
  },
  computed: {
    totalPagesValue() {
      return this.setTotalPages(this.txs.length, 20);
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.address = this.$route.params.id;
    const res = await this.$axios(`/v1/account/${this.address}`);
    this.addressInfo = res.data.result;
    this.SetLoader(false);
  },
  methods: {
    formatAmount(amount, precision) {
      return new BigNumber(amount).shiftedBy(-precision).toFixed(6);
    },
  },
};
</script>

<style lang="scss" scoped>
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
  }
  &__table {
    min-height: 450px;
  }
}
.icon-copy::before {
  color: $blue;
  font-size: 20px;
  cursor: pointer;
}
</style>
