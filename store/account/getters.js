export default {
  getAccountInfo: (state) => state.accountInfo,
  getAccountBalances: (state) => state.accountBalances?.balances,
  getAccountBalancesCount: (state) => state.accountBalances?.count,
};
