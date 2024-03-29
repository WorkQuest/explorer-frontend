import { error } from '~/utils';

export default {
  async getAllTokens({ commit }, queries) {
    try {
      const response = await this.$axios.$get('/tokens', {
        params: { ...queries },
      });

      commit('setAllTokens', response.result);

      if (response.ok
        && Array.isArray(response.result.tokens)
        && response.result.tokens.length > 0
        && !response.result.tokens.map((t) => Object.keys(t)).flat().includes('volume')
      ) {
        const getVolumes = [];

        response.result.tokens.map(async (token) => {
          const address = token.contract_address_hash?.hex || '';
          getVolumes.push(this.$axios.$get(`/token/${address}`, {
            params: { commonLimit: 0 },
          }));
        });
        const tokens = await Promise.all(getVolumes);
        commit('setTokensVolume', tokens);
      }

      return response;
    } catch (e) {
      return error(e.code || 500, 'getAllTokens', e);
    }
  },
  async getToken({ commit }, { address, commonLimit }) {
    try {
      const response = await this.$axios.$get(`/token/${address}`, {
        params: { commonLimit },
      });
      commit('setCurrentToken', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getToken', e);
    }
  },
  async getTokenTransfers({ commit }, { address, query }) {
    try {
      const response = await this.$axios.$get(`/token/${address}/transfers`, { params: { ...query } });
      commit('setCurrentTokenTransfers', response.result);
      return response.result;
    } catch (e) {
      return error(e.code || 500, 'getTokenTransfers', e);
    }
  },
  async getAllTokensTransfers({ commit }, queries) {
    try {
      const response = await this.$axios.$get('/token/transfers', { params: { ...queries } });
      commit('setAllTokenTransfers', response.result);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getAllTokensTransfers', e);
    }
  },
  async getTokenHolders({ commit }, { address, query }) {
    try {
      const response = await this.$axios.$get(`/token/${address}/holders`, { params: { ...query } });
      commit('setCurrentTokenHolders', response.result);
      return response.result;
    } catch (e) {
      return error(e.code || 500, 'getTokenHolders', e);
    }
  },
  async getTokenPrices({ commit }) {
    try {
      const response = await this.$axios.$get(`${process.env.WQ_ORACLE_URL}/oracle/current-prices`);
      commit('setTokenPrices', response.result);
      return response.result;
    } catch (e) {
      return error(e.code || 500, 'getTokenPrices', e);
    }
  },
  async getCirculatingSupply({ commit }) {
    try {
      const response = await this.$axios.$get('/coin/circulating-supply');
      commit('setCirculatingSupply', response.result.supply);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getCirculatingSupply', e);
    }
  },
};
