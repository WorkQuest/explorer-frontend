export default {
  async getBlockById({ commit }, blockId) {
    try {
      const response = await this.$axios.$get(`/block/${blockId}`);
      if (response.ok) commit('setBlock', response.result);
      return response;
    } catch (e) {
      throw new Error(e);
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
      throw new Error(e);
    }
  },
};
