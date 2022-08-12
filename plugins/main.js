import Vue from 'vue';
import moment from 'moment';
import BigNumber from 'bignumber.js';
import { getKeyByValue, isValidBech32 } from '~/utils';

BigNumber.set({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
BigNumber.config({ EXPONENTIAL_AT: 60 });

Vue.mixin({

  methods: {
    cropTxt(str) {
      if (str.length > 66) str = `${str.slice(0, 10)}...${str.slice(-10)}`;
      return str;
    },
    async SetLoader(value) {
      await this.$store.dispatch('main/setLoading', value);
    },
    async ClipboardSuccessHandler(value) {
      await this.$store.dispatch('main/showToast', {
        title: 'Copied successfully',
        text: value,
      });
    },
    async ClipboardErrorHandler(value) {
      await this.$store.dispatch('main/showToast', {
        title: 'Copy error',
        text: value,
      });
    },
    Floor: (value, precision = 4) => {
      const form = 10 ** precision;
      return new BigNumber(Math.floor(value * form) / form || 0).toString();
    },
    Ceil: (value, precision = 4) => {
      const form = 10 ** precision;
      return Math.ceil(value * form) / form || 0;
    },
    NumberFormat(value, fixed) {
      return (+value && new Intl.NumberFormat('ru', { maximumFractionDigits: fixed || 8 }).format(value || 0)) || 0;
    },
    formatItem(item, endFromBegining, startToEnd) {
      if (item) return `${item.slice(0, endFromBegining)}...${item.slice(item.length - startToEnd, item.length)}`;
      return '';
    },
    setTotalPages(itemsNum, itemsPerPage) {
      return Math.ceil(itemsNum / itemsPerPage);
    },
    formatDataFromNow(data) {
      return moment(data).fromNow();
    },
    ConvertFromDecimals(value, decimals, decimalPlaces = null) {
      if (!value || !decimals) {
        return 0;
      }
      if (decimalPlaces) {
        return new BigNumber(value).shiftedBy(-decimals).decimalPlaces(decimalPlaces);
      }
      return new BigNumber(value).shiftedBy(-decimals).toString();
    },
    FormatSmallNumber(number) {
      if (!number) {
        return 0;
      }
      const num = new BigNumber(number);
      if (num.isLessThan(0.000001)) {
        return '> 0,000001';
      }
      if (num.isGreaterThan(999999999)) {
        return `~ ${num.decimalPlaces(0)}`;
      }
      if (num.isGreaterThan(0.000001)) {
        return `${num.decimalPlaces(6)}`;
      }
      return `${num.decimalPlaces(4)}`;
    },
    IsValidBech32Address(address) {
      return isValidBech32(address);
    },
    GetSortKeyByValue(table, value) {
      return getKeyByValue(table, value);
    },
    IsStorageHaveKey(key) {
      return sessionStorage.getItem(key);
    },
    SaveToStorage(key, value) {
      sessionStorage.setItem(key, JSON.stringify(value));
    },
    GetFromStorage(key) {
      let value;
      try {
        value = JSON.parse(sessionStorage.getItem(key));
      } catch (e) {
        value = null;
      }
      return value;
    },
    DeleteFromStorage(key) {
      sessionStorage.removeItem(key);
    },
    FormattingLargeNumber(number) {
      const num = new BigNumber(number);
      if (num.isLessThan(999999999999) && num.isGreaterThan(999999999)) {
        return '> 1 billion';
      }
      if (num.isGreaterThan(999999999999)) {
        return '> 1 trillion';
      }
      return number.toFixed(2);
    },
  },
});
