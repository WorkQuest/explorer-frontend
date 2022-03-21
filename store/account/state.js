export const account = {
  fetched_coin_balance: '',
  addressTokensBalances: [],
  addressCoinBalance: {},
  hash: {},
  smartContract: {
    address_hash: {
      hex: '',
      bech32: '',
    },
    id: '',
    name: '',
    compiler_version: '',
    optimization: null,
    contract_source_code: '',
    abi: {
      abi: [],
      _format: '',
      bytecode: '',
      sourceName: '',
      contractName: '',
      linkReferences: {},
      deployedBytecode: '',
      deployedLinkReferences: {},
    },
    inserted_at: '',
    updated_at: '',
    constructor_arguments: null,
    optimization_runs: null,
    evm_version: null,
    external_libraries: [],
    verified_via_sourcify: null,
    partially_verified: null,
    file_path: null,
  },
};

export const addressLogsList = {
  count: 0,
  rows: [],
};

export const internalTransactionsList = {
  count: 0,
  rows: [],
};

export const tokenTransfersList = {
  count: 0,
  rows: [],
};

export const transactionsList = {
  count: 0,
  rows: [],
};

export const transactionWithTokensList = {
  count: 0,
  rows: [],
};

export default () => ({
  account,
  addressLogsList,
  internalTransactionsList,
  tokenTransfersList,
  transactionsList,
  transactionWithTokensList,
});
