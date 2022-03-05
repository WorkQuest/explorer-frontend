import { error } from '~/utils';

export default {
  async getBlockById({ commit }, blockId) {
    try {
      const response = await this.$axios.$get(`/block/${blockId}`);
      if (response.ok) commit('setBlock', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getBlockById', e);
    }
  },
  async getBlocks({ commit }, queries) {
    try {
      const response = await this.$axios.$get('/blocks', {
        params: { ...queries },
      });
      commit('setBlocks', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getBlocks', e);
    }
  },
  async getBlockTransactions({ commit }, { blockId, limit, offset }) {
    try {
      const response = await this.$axios.$get(`/block/${blockId}/transactions`, {
        params: { limit, offset },
      });
      if (response.ok) {
        commit('setBlockTransactions', response.result);
      }
      return response;
    } catch (e) {
      return error(e.code || 500, 'getTransactionsByBlock', e);
    }
  },
};
