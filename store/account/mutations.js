import {
  account,
  addressLogsList,
  internalTransactionsList,
  tokenTransfersList,
  transactionsList,
} from '~/store/account/state';

export default {
  setAccountInfo(state, data) {
    state.account = data.account;
    state.addressLogsList = data.addressLogsList;
    state.internalTransactionsList = data.internalTransactionsList;
    state.tokenTransfersList = data.tokenTransfersList;
    state.transactionsList = data.transactionsList;
  },
  resetAccountInfo(state) {
    Object.assign(state.account, account);
    Object.assign(state.addressLogsList, addressLogsList);
    Object.assign(state.internalTransactionsList, internalTransactionsList);
    Object.assign(state.tokenTransfersList, tokenTransfersList);
    Object.assign(state.transactionsList, transactionsList);
  },
};
