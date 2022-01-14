export default {
  async getTxsByAccount({ commit }, { address, limit, offset }) {
    try {
      const response = await this.$axios.$get(`/v1/account/${address}/txs`, {
        params: { limit, offset },
      });
      commit('setTxsByAccount', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async getTxsByHash({ commit }, hash) {
    try {
      const response = await this.$axios.$get(`/tx/${hash}`);
      commit('setTxsByHash', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async getTxs({ commit }, queries) {
    try {
      const response = await this.$axios.$get('/txs', {
        params: { ...queries },
      });
      commit('setTxs', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
};
