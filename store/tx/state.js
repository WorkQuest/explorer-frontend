export const txsByAccount = {
  count: 0,
  transactions: [],
};

export const txsByHash = {};

export const txs = {
  count: 0,
  transactions: [],
};

export default () => ({
  txsByAccount,
  txsByHash,
  txs,
});
