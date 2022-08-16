import BigNumber from 'bignumber.js';
import { error } from '~/utils';

export default {
  async getPriceByTimestamp({ commit, dispatch }, unix) {
    try {
      const response = await this.$axios.$get(`${process.env.WQ_ORACLE_URL}/oracle/WQT/price?timestamp=${unix}`);
      if (response.result) {
        const shiftedByPrice = new BigNumber(response.result).shiftedBy(-18).toString();
        const price = Number(shiftedByPrice).toFixed(4);
        commit('setPrice', price);
      } else {
        const date = this.$moment().format('DD-MM-YYYY');
        dispatch('getPriceInCoingecko', date);
      }
      return response;
    } catch (e) {
      return error(e.code || 500, 'getPriceByTimestamp', e);
    }
  },
  async getPriceInCoingecko({ commit }, date) {
    try {
      const response = await this.$axios.$get(`https://api.coingecko.com/api/v3/coins/work-quest/history?date=${date}`);
      const price = Number(r.market_data.current_price.usd).toFixed(4);
      commit('setPrice', price);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getPriceInCoingecko', e);
    }
  },
  async getTransactionsByTime({ commit }, date) {
    try {
      const response = await this.$axios.$get(`/transactions/count?fromDate=${date.dayFrom}&toDate=${date.dayTo}`);
      return response;
    } catch (e) {
      return error(e.code || 500, 'getTransactionsByTime', e);
    }
  },
};
