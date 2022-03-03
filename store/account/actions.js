import { error, output } from '~/utils';

export default {
  async getAccountByAddress({ commit }, address) {
    try {
      const response = await this.$axios.$get(`/account/${address}`);
      commit('setAccountInfo', response.result);
      return response;
    } catch (e) {
      return error(500, 'getAccountByAddress', e);
    }
  },
  async getAccountBalances({ commit }, address) {
    try {
      const response = await this.$axios.$get(`/account/${address}/transactions`);
      commit('setAccountBalances', response.result);
      return response;
    } catch (e) {
      return error(500, 'getAccountBalances', e);
    }
  },
};
