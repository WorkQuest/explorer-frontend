export default {
  async getAccountByAddress({ commit }, address) {
    try {
      const response = await this.$axios.$get(`/account/${address}`);
      commit('setAccountInfo', response.result);
      return response;
    } catch (e) {
      throw new Error(e);
    }
  },
  async getAccountBalances({ commit }, address) {
    try {
      const response = await this.$axios.$get(`/account/${address}/txs`);
      commit('setAccountBalances', response.result);
      return response;
    } catch (e) {
      throw new Error(e);
    }
  },
};
