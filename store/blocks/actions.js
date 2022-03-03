import { error } from '~/utils';

export default {
  async getBlockById({ commit }, blockId) {
    try {
      const response = await this.$axios.$get(`/block/${blockId}`);
      if (response.ok) commit('setBlock', response.result);
      return response;
    } catch (e) {
      console.log('getBlockById: ', e);
      return error(500, 'getBlockById', e);
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
      console.log('getBlocks: ', e);
      return error(500, 'getBlocks', e);
    }
  },
};
