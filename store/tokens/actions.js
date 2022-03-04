import { error } from '~/utils';

export default {
  async getAllTokens({ commit }, queries) {
    try {
      const response = await this.$axios.$get('/tokens', {
        params: { ...queries },
      });
      commit('setAllTokens', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getAllTokens', e);
    }
  },
};
