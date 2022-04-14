/** @typedef {object} account
 * @property {object} hash
 * @property {string} hash.hex
 * @property {string} hash.bech32
 * @property {string} [contract_code]
 * @property {string} fetched_coin_balance
 * @property {string} fetched_coin_balance_block_number
 * @property {string} inserted_at
 * @property {string} updated_at
 * @property {string} [nonce]
 * @property {boolean} decompiled
 * @property {boolean} verified
 * @property {object} token
 * @property {object} token.contract_address_hash
 * @property {string} token.contract_address_hash.hex
 * @property {string} token.contract_address_hash.bech32
 * @property {string} token.name
 * @property {string} token.symbol
 * @property {string} token.total_supply
 * @property {string} token.decimals
 * @property {string} token.type
 * @property {string} token.inserted_at
 * @property {string} token.updated_at
 * @property {number} token.holder_count
 * @property {null} token.bridged
 * @property {null} token.skip_metadata
 * @property {object} smartContract
 * @property {object} smartContract.address_hash
 * @property {string} smartContract.address_hash.hex
 * @property {string} smartContract.address_hash.bech32
 * @property {string} smartContract.id
 * @property {string} smartContract.name
 * @property {string} smartContract.compiler_version
 * @property {boolean} smartContract.optimization
 * @property {string} smartContract.contract_source_code
 * @property {object} smartContract.abi
 * @property {object[]} smartContract.abi.abi
 * @property {string} smartContract.abi.abi.name
 * @property {string} smartContract.abi.abi.type
 * @property {object[]|[]} smartContract.abi.abi.inputs
 * @property {string} smartContract.abi.abi.inputs.name
 * @property {string} smartContract.abi.abi.inputs.type
 * @property {boolean} smartContract.abi.abi.inputs.indexed
 * @property {string} smartContract.abi.abi.inputs.internalType
 * @property {boolean} smartContract.abi.abi.anonymous
 * @property {object[]|[]} smartContract.abi.abi.outputs
 * @property {string} smartContract.abi.abi.outputs.name
 * @property {string} smartContract.abi.abi.outputs.type
 * @property {string} smartContract.abi.abi.outputs.internalType
 * @property {string} smartContract.abi.abi.stateMutability
 * @property {string} smartContract.abi._format
 * @property {string} smartContract.abi.bytecode
 * @property {string} smartContract.abi.sourceName
 * @property {string} smartContract.abi.contractName
 * @property {string} smartContract.abi.deployedBytecode
 * @property {string} smartContract.inserted_at
 * @property {string} smartContract.updated_at
 * @property {string} [smartContract.constructor_arguments]
 * @property {string} smartContract.optimization_runs
 * @property {string} [smartContract.evm_version]
 * @property {string} [smartContract.external_libraries]
 * @property {string} [smartContract.verified_via_sourcify]
 * @property {string} [smartContract.partially_verified]
 * @property {string} [smartContract.file_path]
 * @property {string} [createdContract]
 * @property {object} addressCoinBalance
 * @property {object} addressCoinBalance.address_hash
 * @property {string} addressCoinBalance.address_hash.hex
 * @property {string} addressCoinBalance.address_hash.bech32
 * @property {string} addressCoinBalance.value
 * @property {string} addressCoinBalance.value_fetched_at
 * @property {object[]} addressTokensBalances
 * @property {object} addressTokensBalances.address_hash
 * @property {string} addressTokensBalances.address_hash.hex
 * @property {string} addressTokensBalances.address_hash.bech32
 * @property {object} addressTokensBalances.token_contract_address_hash
 * @property {string} addressTokensBalances.token_contract_address_hash.hex
 * @property {string} addressTokensBalances.token_contract_address_hash.bech32
 * @property {string} addressTokensBalances.value
 * @property {string} addressTokensBalances.value_fetched_at
 * @property {string} addressTokensBalances.name
 * @property {string} addressTokensBalances.symbol
 * @property {string} addressTokensBalances.decimals
 */

export const account = {
  fetched_coin_balance: '',
  addressTokensBalances: [],
  addressCoinBalance: {},
  hash: {},
  createdContract: null,
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
  token: null,
};

/** @typedef {object} addressLogsList
 * @property {number} count
 * @property {object[]} rows
 * @property {string} rows.data
 * @property {object} rows.address_hash
 * @property {string} rows.address_hash.hex
 * @property {string} rows.address_hash.bech32
 * @property {string} rows.transaction_hash
 * @property {string} rows.block_hash
 * @property {number} rows.index
 * @property {string} [rows.type] ?
 * @property {string} rows.first_topic
 * @property {string} rows.second_topic
 * @property {string} rows.third_topic
 * @property {null} rows.fourth_topic
 * @property {string} rows.inserted_at
 * @property {string} rows.updated_at
 * @property {number} rows.block_number
 */

export const addressLogsList = {
  count: 0,
  rows: [],
};

/** @typedef {object} internalTransactionsList
 * @property {number} count
 * @property {object[]} rows
 * @property {object} rows.from_address_hash
 * @property {string} rows.from_address_hash.hex
 * @property {string} rows.from_address_hash.bech32
 * @property {object} rows.to_address_hash
 * @property {string} rows.to_address_hash.hex
 * @property {string} rows.to_address_hash.bech32
 * @property {string} [rows.error]
 * @property {string} rows.value
 * @property {number} rows.block_number
 * @property {object} rows.block
 * @property {string} rows.block.timestamp
 */

export const internalTransactionsList = {
  count: 0,
  rows: [],
};

/** @typedef {object} tokenTransfersList
 * @property {number} count
 * @property {object[]} rows
 * @property {string} rows.transaction_hash
 * @property {object} rows.from_address_hash
 * @property {string} rows.from_address_hash.hex
 * @property {string} rows.from_address_hash.bech32
 * @property {object} rows.to_address_hash
 * @property {string} rows.to_address_hash.hex
 * @property {string} rows.to_address_hash.bech32
 * @property {object} rows.token_contract_address_hash
 * @property {string} rows.token_contract_address_hash.hex
 * @property {string} rows.token_contract_address_hash.bech32
 * @property {string} rows.amount
 * @property {object} rows.block
 * @property {string} rows.block.timestamp
 */

export const tokenTransfersList = {
  count: 0,
  rows: [],
};

/** @typedef {object} transactionsList
 * @property {number} count
 * @property {object[]} rows
 * @property {string} rows.hash
 * @property {object} rows.from_address_hash
 * @property {string} rows.from_address_hash.hex
 * @property {string} rows.from_address_hash.bech32
 * @property {object} rows.to_address_hash
 * @property {string} rows.to_address_hash.hex
 * @property {string} rows.to_address_hash.bech32
 * @property {string} rows.gas
 * @property {string} [rows.error]
 * @property {string} rows.value
 * @property {number} rows.status
 * @property {string} rows.gas_used
 * @property {string} rows.gas_price
 * @property {number} rows.block_number
 * @property {object} rows.block
 * @property {string} rows.block.timestamp
 */

export const transactionsList = {
  count: 0,
  rows: [],
};

/** @typedef {object} transactionWithTokensList
 * @property {number} count
 * @property {object[]} rows
 * @property {string} rows.hash
 * @property {object} rows.from_address_hash
 * @property {string} rows.from_address_hash.hex
 * @property {string} rows.from_address_hash.bech32
 * @property {object} rows.to_address_hash
 * @property {string} rows.to_address_hash.hex
 * @property {string} rows.to_address_hash.bech32
 * @property {string} rows.gas
 * @property {null} rows.error
 * @property {string} rows.value
 * @property {number} rows.status
 * @property {string} rows.gas_used
 * @property {string} rows.gas_price
 * @property {number} rows.block_number
 * @property {object[]} rows.tokenTransfers
 * @property {object} rows.tokenTransfers.token_contract_address_hash
 * @property {string} rows.tokenTransfers.token_contract_address_hash.hex
 * @property {string} rows.tokenTransfers.token_contract_address_hash.bech32
 * @property {object} rows.tokenTransfers.tokenContractAddress
 * @property {object} rows.tokenTransfers.tokenContractAddress.hash
 * @property {string} rows.tokenTransfers.tokenContractAddress.hash.hex
 * @property {string} rows.tokenTransfers.tokenContractAddress.hash.bech32
 * @property {object} rows.tokenTransfers.tokenContractAddress.token
 * @property {string} rows.tokenTransfers.tokenContractAddress.token.name
 * @property {string} rows.tokenTransfers.tokenContractAddress.token.decimals
 * @property {string} rows.tokenTransfers.tokenContractAddress.token.symbol
 */

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
