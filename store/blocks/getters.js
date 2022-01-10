export default {
  getCurrentBlock: (state) => state.block,
  getBlocks: (state) => state.blocks?.blocks,
  getBlocksCount: (state) => state.blocks.count,
};
