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
  async getToken({ commit }, { address, commonLimit }) {
    try {
      const response = await this.$axios.$get(`/token/${address}`, {
        params: { commonLimit },
      });
      commit('setCurrentToken', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getToken', e);
    }
  },
  async getTokenTransfers({ commit }, { address, limit, offset }) {
    try {
      const response = await this.$axios.$get(`/token/${address}/transfers`, { params: { limit, offset } });
      commit('setCurrentTokenTransfers', response.result);
      return response.result;
    } catch (e) {
      return error(e.code || 500, 'getTokenTransfers', e);
    }
  },
  async getTokenHolders({ commit }, { address, limit, offset }) {
    try {
      const response = await this.$axios.$get(`/token/${address}/holders`, { params: { limit, offset } });
      commit('setCurrentTokenHolders', response.result);
      return response.result;
    } catch (e) {
      return error(e.code || 500, 'getTokenHolders', e);
    }
  },
};
