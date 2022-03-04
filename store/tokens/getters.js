export default {
  getAllTokensCount: (state) => state.allTokens.count,
  getAllTokens: (state) => state.allTokens.tokens,
  getCurrentToken: (state) => state.currentToken,
  getAccountTokensCount: (state) => state.accountTokens.count,
  getAccountTokens: (state) => state.accountTokens.tokens,
};
