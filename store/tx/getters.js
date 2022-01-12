export default {
  getTxsByAccount: (state) => state.txsByAccount?.txs,
  getTxsByAccountCount: (state) => state.txsByAccount?.count,
  getTxsByHash: (state) => state.txsByHash,
  getTxs: (state) => state.txs?.txs,
  getTxsCount: (state) => state.txs?.count,
};
