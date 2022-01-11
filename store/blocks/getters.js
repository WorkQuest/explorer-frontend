export default {
  getCurrentBlock: (state) => state.block,
  getBlocks: (state) => state.blocksInfo?.blocks,
  getBlocksCount: (state) => state.blocksInfo?.count,
};
