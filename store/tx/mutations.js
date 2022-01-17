export default {
  setTxsByAccount(state, data) {
    state.txsByAccount = data;
  },
  setTxsByHash(state, data) {
    state.txsByHash = data;
  },
  setTxs(state, data) {
    state.txs = data;
  },
};
