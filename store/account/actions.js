export default {
  async getAccountByAddress({ commit }, address) {
    try {
      const response = await this.$axios.$get(`/v1/account/${address}`);
      commit('setAccountInfo', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async getAccountBalances({ commit }, address) {
    try {
      const response = await this.$axios.$get(`/v1/account/${address}/balances`);
      commit('setAccountBalances', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
};
