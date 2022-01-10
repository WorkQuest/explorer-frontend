export default {
  getTxsByAccount: (state) => state.txsByAccount,
  getTxsByHash: (state) => state.txsByHash,
  getTxs: (state) => state.txs?.txs,
  getTxsCount: (state) => state.txs?.count,
};
