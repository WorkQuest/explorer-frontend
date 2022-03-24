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
  setAccountInternalTransaction(state, data) {
    state.internalTransactionsList.count = data.count;
    state.internalTransactionsList.rows = data.transactions;
  },
  setAccountTransactions(state, data) {
    state.transactionsList.count = data.count;
    state.transactionsList.rows = data.transactions;
  },
  setAccountTokenTransfers(state, data) {
    state.tokenTransfersList.count = data.count;
    state.tokenTransfersList.rows = data.txs;
  },
  resetAccountInfo(state) {
    Object.assign(state.account, account);
    Object.assign(state.addressLogsList, addressLogsList);
    Object.assign(state.internalTransactionsList, internalTransactionsList);
    Object.assign(state.tokenTransfersList, tokenTransfersList);
    Object.assign(state.transactionsList, transactionsList);
  },
};
