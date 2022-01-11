export default {
  async getBlockById({ commit }, blockId) {
    try {
      const response = await this.$axios.$get(`/v1/block/${blockId}`);
      commit('setBlock', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
  async getBlocks({ commit }, queries) {
    try {
      const response = await this.$axios.$get('/v1/blocks', {
        params: { ...queries },
      });
      commit('setBlocks', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
};
