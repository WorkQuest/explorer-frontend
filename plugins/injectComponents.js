import Vue from 'vue';

import CtmModal from '~/components/CtmModal';
import Loader from '~/components/ui/Loader';
import BaseButton from '~/components/ui/BaseButton';
import BaseInput from '~/components/ui/BaseInput';
import BaseDD from '~/components/ui/BaseDD';
import BaseCheckbox from '~/components/ui/BaseCheckbox';
// import BaseTable from '~/components/ui/BaseTable';
import BasePager from '~/components/ui/BasePager';
import SearchFilterField from '~/components/SearchFilterField/index.vue';
import Transaction from '~/components/mobile/transaction.vue';
import Overview from '~/components/Overview';
import MoreInfo from '~/components/MoreInfo';
import TableTxs from '~/components/TableTxs';
import TableTokens from '~/components/TableTokens';
import Holder from '~/components/mobile/holder';
import InfoItem from '~/components/InfoItem';
import Block from '~/components/mobile/block';
import EmptyData from '~/components/ui/EmptyData';
import ContractInfo from '~/components/ContractInfo';
import ContractInput from '~/components/ui/ContractInput';

Vue.component('ctm-modal', CtmModal);
Vue.component('base-btn', BaseButton);
Vue.component('base-field', BaseInput);
Vue.component('base-dd', BaseDD);
Vue.component('base-checkbox', BaseCheckbox);
Vue.component('loader', Loader);
// Vue.component('base-table', BaseTable);
Vue.component('base-pager', BasePager);
Vue.component('search-filter', SearchFilterField);
Vue.component('transaction', Transaction);
Vue.component('overview', Overview);
Vue.component('more-info', MoreInfo);
Vue.component('table-txs', TableTxs);
Vue.component('table-tokens', TableTokens);
Vue.component('holder', Holder);
Vue.component('info-item', InfoItem);
Vue.component('block', Block);
Vue.component('empty-data', EmptyData);
Vue.component('contract-info', ContractInfo);
Vue.component('contract-input', ContractInput);
