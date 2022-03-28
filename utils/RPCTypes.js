export const METHOD = {
  GET_CHAIN_ID: 'eth_chainId',
  REQUEST_ACCOUNT: 'eth_requestAccounts',
  SWITCH_CHAIN: 'wallet_switchEthereumChain',
  ADD_CHAIN: 'wallet_addEthereumChain',
};
export const EVENT = {
  ACCOUNTS_CHANGED: 'accountsChanged',
  CHAIN_CHANGED: 'chainChanged',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
};
export const ERROR = {
  USER_REJECT: 4001,
  NETWORK_MISSING: 4902,
  INVALID_PARAMS: -32602,
  INTERNAL: -32603,
  METAMASK_IS_NOT_INSTALLED: 449,
  REQUEST_ERROR: 400,
};
