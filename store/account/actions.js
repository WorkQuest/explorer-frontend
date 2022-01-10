export default {
  async getAccountByAddress({ commit }, address) {
    try {
      const response = await this.$axios.$get(`/v1/account/${address}`);
      commit('setAccountAddress', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async getAccountBalances({ commit }, address) {
    try {
      // limit // offset
      const response = await this.$axios.$get(`/v1/account/${address}/balances`);
      commit('setAccountBalances', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
};
