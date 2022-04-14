/** @typedef {object} allTokens
  * @property {object[]} tokens
  * @property {object} tokens.contract_address_hash
  * @property {string} tokens.contract_address_hash.hex
  * @property {string} tokens.contract_address_hash.bech32
  * @property {string} tokens.name
  * @property {string} tokens.symbol
  * @property {string} tokens.total_supply
  * @property {string} tokens.decimals
  * @property {string} tokens.type
  * @property {string} tokens.inserted_at
  * @property {string} tokens.updated_at
  * @property {number} tokens.holder_count
  * @property {string|null} tokens.bridged
  * @property {string|null} tokens.skip_metadata
  * @property {number} count
  * @exports allTokens.token
  */

export const allTokens = {
  count: 0,
  tokens: [],
};

/** @typedef {object} currentToken
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
 * @property {string|null} token.bridged
 * @property {string|null} token.skip_metadata
 * @property {string} token.volume
 * @property {string} token.circulatingSupply
 * @property {object} transfersList
 * @property {number} transfersList.count
 * @property {object[]} transfersList.rows
 * @property {string} transfersList.rows.transaction_hash
 * @property {object} transfersList.rows.from_address_hash
 * @property {string} transfersList.rows.from_address_hash.hex
 * @property {string} transfersList.rows.from_address_hash.bech32
 * @property {object} transfersList.rows.to_address_hash
 * @property {string} transfersList.rows.to_address_hash.hex
 * @property {string} transfersList.rows.to_address_hash.bech32
 * @property {object} transfersList.rows.token_contract_address_hash
 * @property {string} transfersList.rows.token_contract_address_hash.hex
 * @property {string} transfersList.rows.token_contract_address_hash.bech32
 * @property {string} transfersList.rows.amount
 * @property {object} transfersList.rows.block
 * @property {string} transfersList.rows.block.timestamp
 * @property {object} holdersList
 * @property {number} holdersList.count
 * @property {object[]} holdersList.rows
 * @property {object} holdersList.rows.address_hash
 * @property {string} holdersList.rows.address_hash.hex
 * @property {string} holdersList.rows.address_hash.bech32
 * @property {string} holdersList.rows.value
 * @property {string} holdersList.rows.value_fetched_at
 */

export const currentToken = {
  token: {},
  transfersList: {
    count: 0,
    rows: [],
  },
  holdersList: {
    count: 0,
    rows: [],
  },
};

export const accountTokens = {
  count: 0,
  tokens: [],
};

/** @typedef {object} allTokenTransfers
 * @property {number} count
 * @property {object[]} txs
 * @property {string} txs.transaction_hash
 * @property {object} txs.from_address_hash
 * @property {string} txs.from_address_hash.hex
 * @property {string} txs.from_address_hash.bech32
 * @property {object} txs.to_address_hash
 * @property {string} txs.to_address_hash.hex
 * @property {string} txs.to_address_hash.bech32
 * @property {object} txs.token_contract_address_hash
 * @property {string} txs.token_contract_address_hash.hex
 * @property {string} txs.token_contract_address_hash.bech32
 * @property {string} txs.amount
 * @property {object} txs.block
 * @property {string} txs.block.timestamp
 */

export const allTokenTransfers = {
  count: 0,
  transfers: [],
};

/** @typedef {array} tokenPrices
 * @property {object} 0
 * @property {object} 1
 * @property {object} 2
 * @property {string} 0.symbol
 * @property {string} 0.price
 * @property {string} 0.timestamp
 * @property {string} 1.symbol
 * @property {string} 1.price
 * @property {string} 1.timestamp
 * @property {string} 2.symbol
 * @property {string} 2.price
 * @property {string} 2.timestamp
 */

export const tokenPrices = [];

export default () => ({
  allTokens,
  currentToken,
  accountTokens,
  allTokenTransfers,
  wusd: {
    symbol: 'WUSD',
    decimals: 18,
  },
  tokenPrices,
});

module.exports = allTokens;
