import { txs, txsByAccount, txsByHash } from '~/store/tx/state';

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
  resetTxsByAccount(state) {
    Object.assign(state.txsByAccount, txsByAccount);
  },
  resetTxsByHash(state) {
    Object.assign(state.txsByHash, txsByHash);
  },
  resetTxs(state) {
    Object.assign(state.txs, txs);
  },
  setPrice(state, data) {
    state.temp.price = data;
  },
};
