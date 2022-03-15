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

export default () => ({
  allTokens,
  currentToken,
  accountTokens,
  wusd: {
    symbol: 'WUSD',
    decimals: 18,
  },
});
