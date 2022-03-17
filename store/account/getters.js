export default {
  getAccountInfo: (state) => state.account,
  getNativeBalance: (state) => state.account.fetched_coin_balance,
  getAccountTokens: (state) => state.account.addressTokensBalances,
  getTransactions: (state) => state.transactionsList.rows,
  getTransactionsCount: (state) => state.transactionsList.count,
  getInternalTransactions: (state) => state.internalTransactionsList.rows,
  getInternalTransactionsCount: (state) => state.internalTransactionsList.count,
  getTokenTransfers: (state) => state.tokenTransfersList.rows,
  getTokenTransfersCount: (state) => state.tokenTransfersList.count,
};
