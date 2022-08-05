export default {
  getTxsByAccount: (state) => state.txsByAccount.transactions,
  getTxsByAccountCount: (state) => state.txsByAccount.count,
  getTxsByHash: (state) => state.txsByHash,
  getTxs: (state) => state.txs.transactions,
  getTxsCount: (state) => state.txs.count,
  getPrice: (state) => state.temp.price,
};
