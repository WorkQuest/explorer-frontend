import { error } from '~/utils';

export default {
  async getAccountByAddress({ commit }, { address, commonLimit }) {
    try {
      const response = await this.$axios.$get(`/account/${address}`, { params: { commonLimit } });
      commit('setAccountInfo', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getAccountByAddress', e);
    }
  },
  async getAccountInternalTransactions({ commit }, { address, query }) {
    try {
      const response = await this.$axios.$get(`/account/${address}/internal-transactions`, {
        params: { ...query },
      });
      commit('setAccountInternalTransaction', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getAccountInternalTransactions', e);
    }
  },
  async getAccountTransactions({ commit }, { address, query }) {
    try {
      const response = await this.$axios.$get(`/account/${address}/transactions`, { params: { ...query } });
      commit('setAccountTransactions', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getAccountTransactions', e);
    }
  },
  async getAccountTokenTransfers({ commit }, { address, limit, offset }) {
    try {
      const response = await this.$axios.$get(`/v1/token/${address}/transfers`, { params: { limit, offset } });
      commit('setAccountTokenTransfers', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getAccountTokenTransfers', e);
    }
  },
};
