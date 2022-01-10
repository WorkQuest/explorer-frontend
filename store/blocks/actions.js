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
  async getBlocks({ commit }) {
    try {
      // limit // offset
      const response = await this.$axios.$get('/v1/blocks');
      commit('setBlocks', response.result);
      return response;
    } catch (e) {
      return console.log(e);
    }
  },
};
