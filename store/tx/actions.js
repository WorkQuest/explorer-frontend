import { error } from '~/utils';

export default {
  async getTxsByAccount({ commit }, { address, limit, offset }) {
    try {
      const response = await this.$axios.$get(`/account/${address}/transactions`, {
        params: { limit, offset },
      });
      commit('setTxsByAccount', response.result);
      return response;
    } catch (e) {
      return error(500, 'getTxsByAccount', e);
    }
  },
  async getTxsByHash({ commit }, hash) {
    try {
      const response = await this.$axios.$get(`/transaction/${hash}`);
      commit('setTxsByHash', response.result);
      return response;
    } catch (e) {
      return error(500, 'getTxsByHash', e);
    }
  },
  async getTxs({ commit }, queries) {
    try {
      const response = await this.$axios.$get('/transactions', {
        params: { ...queries },
      });
      commit('setTxs', response.result);
      return response;
    } catch (e) {
      return error(500, 'getTxs', e);
    }
  },
};
