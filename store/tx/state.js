/** @typedef {object} txsByAccount
 * @property {number} count
 * @property {object[]} transactions
 * @property {string} transactions.hash
 * @property {object} transactions.from_address_hash
 * @property {string} transactions.from_address_hash.hex
 * @property {string} transactions.from_address_hash.bech32
 * @property {object} transactions.to_address_hash
 * @property {string} transactions.to_address_hash.hex
 * @property {string} transactions.to_address_hash.bech32
 * @property {string} transactions.gas
 * @property {string|null} transactions.error
 * @property {string} transactions.value
 * @property {number} transactions.status
 * @property {string} transactions.gas_used
 * @property {string} transactions.gas_price
 * @property {number} transactions.block_number
 * @property {object} transactions.block
 * @property {string} transactions.block.timestamp
 * @property {object[]|[]} transactions.tokenTransfers
 * @property {string} transactions.tokenTransfers.amount
 */

export const txsByAccount = {
  count: 0,
  transactions: [],
};

/** @typedef {object} txsByHash
 * @property {string} hash
 * @property {string} input
 * @property {string|string} block_hash
 * @property {object} from_address_hash
 * @property {string} from_address_hash.hex
 * @property {string} from_address_hash.bech32
 * @property {object} to_address_hash
 * @property {string} to_address_hash.hex
 * @property {string} to_address_hash.bech32
 * @property {string|null} created_contract_address_hash
 * @property {null|string} old_block_hash
 * @property {string} cumulative_gas_used
 * @property {string} [error]
 * @property {string} gas
 * @property {string} gas_price
 * @property {string} gas_used
 * @property {number} index
 * @property {number} nonce
 * @property {string} r
 * @property {string} s
 * @property {number} status
 * @property {string} v
 * @property {string} value
 * @property {string} inserted_at
 * @property {string} updated_at
 * @property {number|undefined} block_number
 * @property {string|null} created_contract_code_indexed_at
 * @property {string|null} earliest_processing_start
 * @property {string|null} revert_reason
 * @property {string|null} max_priority_fee_per_gas
 * @property {string|null} max_fee_per_gas
 * @property {number} type
 * @property {object} fromAddress
 * @property {object} fromAddress.hash
 * @property {string} fromAddress.hash.hex
 * @property {string} fromAddress.hash.bech32
 * @property {string} [fromAddress.contract_code]
 * @property {string} fromAddress.fetched_coin_balance
 * @property {string} fromAddress.fetched_coin_balance_block_number
 * @property {string} fromAddress.inserted_at
 * @property {string} fromAddress.updated_at
 * @property {number} fromAddress.nonce
 * @property {boolean} fromAddress.decompiled
 * @property {boolean} fromAddress.verified
 * @property {object} block
 * @property {string} block.hash
 * @property {object} block.miner_hash
 * @property {string} block.miner_hash.hex
 * @property {string} block.miner_hash.bech32
 * @property {string} block.nonce
 * @property {string} block.parent_hash
 * @property {boolean} block.consensus
 * @property {string} block.difficulty
 * @property {string} block.gas_limit
 * @property {string} block.gas_used
 * @property {string} block.number
 * @property {number} block.size
 * @property {string} block.timestamp
 * @property {string} block.total_difficulty
 * @property {string} block.inserted_at
 * @property {string} block.updated_at
 * @property {boolean} block.refetch_needed
 * @property {string} block.base_fee_per_gas
 * @property {object} toAddress
 * @property {object} toAddress.hash
 * @property {string} toAddress.hash.hex
 * @property {string} toAddress.hash.bech32
 * @property {string} [toAddress.contract_code]
 * @property {string} toAddress.fetched_coin_balance
 * @property {string} toAddress.fetched_coin_balance_block_number
 * @property {string} toAddress.inserted_at
 * @property {string} toAddress.updated_at
 * @property {string} [toAddress.nonce]
 * @property {boolean} toAddress.decompiled
 * @property {boolean} toAddress.verified
 * @property {string|null} createdContractAddress
 * @property {object[]} tokenTransfers
 * @property {string} tokenTransfers.amount
 * @property {object[]} logs
 * @property {string} logs.data
 * @property {object} logs.address_hash
 * @property {string} logs.address_hash.hex
 * @property {string} logs.address_hash.bech32
 * @property {string} logs.transaction_hash
 * @property {string} logs.block_hash
 * @property {number} logs.index
 * @property {string} [logs.type]
 * @property {string} logs.first_topic
 * @property {string} logs.second_topic
 * @property {string} logs.third_topic
 * @property {string|null} logs.fourth_topic
 * @property {string} logs.inserted_at
 * @property {string} logs.updated_at
 * @property {number} logs.block_number
 */

export const txsByHash = {};

/** @typedef {object} txs
 * @property {number} count
 * @property {object[]} transactions
 * @property {string} transactions.hash
 * @property {object} transactions.from_address_hash
 * @property {string} transactions.from_address_hash.hex
 * @property {string} transactions.from_address_hash.bech32
 * @property {object} transactions.to_address_hash
 * @property {string} transactions.to_address_hash.hex
 * @property {string} transactions.to_address_hash.bech32
 * @property {string} transactions.gas
 * @property {string} [transactions.error]
 * @property {string} transactions.value
 * @property {number} transactions.status
 * @property {string} transactions.gas_used
 * @property {string} transactions.gas_price
 * @property {number} transactions.block_number
 * @property {object} transactions.block
 * @property {string} transactions.block.timestamp
 * @property {object[]|[]} transactions.tokenTransfers
 * @property {string} transactions.tokenTransfers.amount
 */
export const txs = {
  count: 0,
  transactions: [],
};

export const temp = {
  price: 0,
};

export default () => ({
  txsByAccount,
  txsByHash,
  txs,
  temp,
});
