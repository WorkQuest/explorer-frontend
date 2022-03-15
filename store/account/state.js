export const account = {
  fetched_coin_balance: '',
  addressTokensBalances: [],
  addressCoinBalance: {},
  hash: {},
};

export const addressLogsList = {
  count: 0,
  rows: [],
};

export const internalTransactionsList = {
  count: 0,
  rows: [],
};

export const tokenTransfersList = {
  count: 0,
  rows: [],
};

export const transactionsList = {
  count: 0,
  rows: [],
};

export default () => ({
  account,
  addressLogsList,
  internalTransactionsList,
  tokenTransfersList,
  transactionsList,
});
