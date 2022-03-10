import Vue from 'vue';
import moment from 'moment';
import VueTippy, { TippyComponent } from 'vue-tippy';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';

Vue.use(VueTippy);
Vue.component('tippy', TippyComponent);
BigNumber.config({ EXPONENTIAL_AT: 60 });

Vue.mixin({

  methods: {
    async ShowModal(payload) {
      await this.$store.dispatch('modals/show', {
        key: modals.default,
        ...payload,
      });
    },
    cropTxt(str) {
      if (str.length > 66) str = `${str.slice(0, 10)}...${str.slice(-10)}`;
      return str;
    },
    async SetLoader(value) {
      await this.$store.dispatch('main/setLoading', value);
    },
    async CloseModal() {
      await this.$store.dispatch('modals/hide');
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
    ShowError(label) {
      this.$bvToast.toast(label, {
        title: 'Ошибка',
        variant: 'warning',
        solid: true,
        toaster: 'b-toaster-bottom-right',
        appendToast: true,
      });
    },
    Floor: (value, precision = 4) => {
      const form = 10 ** precision;
      return Math.floor(value * form) / form || 0;
    },
    Ceil: (value, precision = 4) => {
      const form = 10 ** precision;
      return Math.ceil(value * form) / form || 0;
    },
    GetFormTimestamp(timestamp, format = 'DD.MM.YY H:mm') {
      if (timestamp !== 0 && timestamp !== '-' && timestamp !== '' && timestamp !== undefined) {
        // timestamp = +timestamp * 1000;
        timestamp = +timestamp;
        return moment(new Date(timestamp)).format(format);
      }
      return '-';
    },
    Require(img) {
      // eslint-disable-next-line global-require
      return require(`~/assets/img/${img}`);
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
    formatData(data) {
      return moment(data).format('dd mm yy');
    },
    formatDataFromNow(data) {
      return moment(data).startOf('hour').fromNow();
    },
    ConvertFromDecimals(value, decimals) {
      if (!value || !decimals) {
        return 0;
      }
      return new BigNumber(value).shiftedBy(-decimals).toString();
    },
  },
});
