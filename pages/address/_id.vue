<template>
  <div style="margin: 50px">
    <p>Address: {{address}}</p>
    <p>Balances:</p>
    <p :key="balance.token.symbol" v-for="balance in addressInfo.balances">
      {{ balance.token.symbol }} {{ formatAmount(balance.amount, balance.token.decimals) }}
    </p>
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
    };
  },
  methods: {
    formatAmount(amount, precision) {
      return new BigNumber(amount).shiftedBy(-precision).toFixed(6);
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.address = this.$route.params.id;
    const res = await this.$axios(`/v1/account/${this.address}`);
    this.addressInfo = res.data.result;
    this.SetLoader(false);
  },
};
</script>

<style scoped>

</style>
