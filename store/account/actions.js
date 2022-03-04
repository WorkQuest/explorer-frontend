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
};
