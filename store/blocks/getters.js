export default {
  getCurrentBlock: (state) => state.block,
  getBlocks: (state) => state.blocksInfo.blocks,
  getBlocksCount: (state) => state.blocksInfo.count,
  getCurrentBlockTransactions: (state) => state.blockTransactions.transactions,
  getCurrentBlockTransactionsCount: (state) => state.blockTransactions.count,
};
