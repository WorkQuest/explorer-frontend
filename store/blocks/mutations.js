export default {
  setBlock(state, data) {
    state.block = data;
  },
  setBlockTransactions(state, data) {
    state.blockTransactions = data;
  },
  resetBlockTransactions(state) {
    state.blockTransactions = {
      count: 0,
      transactions: [],
    };
  },
  setBlocks(state, data) {
    state.blocksInfo = data;
  },
  resetBlock(state) {
    state.block = {};
  },
};
