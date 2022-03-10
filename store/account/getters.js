export default {
  getAccountInfo: (state) => state.account,
  getNativeBalance: (state) => state.account.fetched_coin_balance,
  getAccountTokens: (state) => state.account.addressTokensBalances,
  getTransactions: (state) => state.transactionsList.rows,
  getTransactionsCount: (state) => state.transactionsList.count,
};
