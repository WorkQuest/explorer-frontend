import { allTokens, currentToken } from '~/store/tokens/state';

export default {
  setAllTokens(state, data) {
    state.allTokens = data;
  },
  setCurrentToken(state, data) {
    state.currentToken = data;
  },
  setAccountTokens(state, data) {
    state.accountTokens = data;
  },
  setCurrentTokenTransfers(state, data) {
    state.currentToken.transfersList.count = data.count;
    state.currentToken.transfersList.rows = data.txs;
  },
  setCurrentTokenHolders(state, data) {
    state.currentToken.holdersList.count = data.count;
    state.currentToken.holdersList.rows = data.holders;
  },
  setSearchResult(state, data) {
    state.allTokens.count = data.count;
    state.allTokens.tokens = data.rows.map((item) => item.token);
  },
  resetTokens(state) {
    Object.assign(state.allTokens, allTokens);
  },
  resetCurrentToken(state) {
    Object.assign(state.currentToken, currentToken);
  },
};
