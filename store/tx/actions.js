export default {
  async getTxsByAccount({ commit }, address) {
    try {
      const response = await this.$axios.$get(`/v1/account/${address}/txs`);
      commit('setTxsByAccount', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async getTxsByHash({ commit }, hash) {
    try {
      const response = await this.$axios.$get(`/v1/tx/${hash}`);
      commit('setTxsByHash', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async getTxs({ commit }, limit) {
    try {
      const response = await this.$axios.$get(`/v1/txs?${limit}`);
      commit('setTxs', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
};
