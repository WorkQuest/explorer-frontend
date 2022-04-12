export const allTokens = {
  count: 0,
  tokens: [],
};

export const currentToken = {
  /** @property  { object } token  */
  /** @property  { object } contract_address_hash  */
  /** @property  { string } contract_address_hash.hex  */
  /** @property  { string } contract_address_hash.bech32  */
  /** @property  { string } name  */
  /** @property  { string } symbol  */
  /** @property  { string } total_supply  */
  /** @property  { string } type  */
  /** @property  { string } inserted_at  */
  /** @property  { string } updated_at  */
  /** @property  { number } holder_count  */
  /** @property  { boolean } [bridged]  */
  /** @property  { boolean } [skip_metadata]  */

  token: {},
  transfersList: {
    count: 0,
    rows: [],
  },
  /** @property { object } holdersList  */
  /** @property { array } rows  */
  holdersList: {
    count: 0,
    rows: [],
  },
};

export const accountTokens = {
  count: 0,
  tokens: [],
};

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
