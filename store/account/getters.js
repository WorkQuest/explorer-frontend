export default {
  getAccountInfo: (state) => state.accountInfo,
  getAccountBalances: (state) => state.accountInfo.account.fetched_coin_balance,
};
