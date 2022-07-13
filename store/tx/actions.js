import { error } from '~/utils';

export default {
  async getTxsByAccount({ commit }, { address, query }) {
    try {
      const response = await this.$axios.$get(`/account/${address}/transactions`, {
        params: { ...query },
      });
      commit('setTxsByAccount', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getTxsByAccount', e);
    }
  },
  async getTxsByHash({ commit }, hash) {
    try {
      const response = await this.$axios.$get(`/transaction/${hash}`);
      commit('setTxsByHash', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getTxsByHash', e);
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
      return error(e.code || 500, 'getTxs', e);
    }
  },
  async getPriceByTimestamp({ commit }, currentDate) {
    try {
      const date = new Date(currentDate);
      const timestamp = date.getTime();
      const response = await this.$axios.$get(`${process.env.WQ_ORACLE_URL}/oracle/WQT/price?timestamp=${timestamp}`);
      return response.result;
    } catch (e) {
      return error(e.code || 500, 'getPriceByTimestamp', e);
    }
  },
};
