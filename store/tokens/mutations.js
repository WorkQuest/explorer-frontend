import { currentToken } from '~/store/tokens/state';

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
  resetCurrentToken(state) {
    Object.assign(state.currentToken, currentToken);
  },
};
