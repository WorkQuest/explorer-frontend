import { error } from '~/utils';

export default {
  async getAccountByAddress({ commit }, address) {
    try {
      const response = await this.$axios.$get(`/account/${address}`);
      commit('setAccountInfo', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getAccountByAddress', e);
    }
  },
  async getAccountInternalTransactions({ commit }, { address, limit, offset }) {
    try {
      const response = await this.$axios.$get(`/account/${address}/internal-transactions`, {
        params: { limit, offset },
      });
      commit('setAccountInternalTransaction', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getAccountInternalTransactions', e);
    }
  },
  async getAccountTransactions({ commit }, { address, limit, offset }) {
    try {
      const response = await this.$axios.$get(`/account/${address}/transactions`, { params: { limit, offset } });
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
