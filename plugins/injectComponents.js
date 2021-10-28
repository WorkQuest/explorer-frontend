import Vue from 'vue';

import CtmModal from '~/components/CtmModal';
import Loader from '~/components/ui/Loader';
import BaseButton from '~/components/ui/BaseButton';
import BaseInput from '~/components/ui/BaseInput';
import BaseDD from '~/components/ui/BaseDD';
import BaseCheckbox from '~/components/ui/BaseCheckbox';
import BaseTable from '~/components/ui/BaseTable';
import SearchFilterField from '~/components/SearchFilterField/index.vue';

Vue.component('ctm-modal', CtmModal);
Vue.component('base-btn', BaseButton);
Vue.component('base-field', BaseInput);
Vue.component('base-dd', BaseDD);
Vue.component('base-checkbox', BaseCheckbox);
Vue.component('loader', Loader);
Vue.component('base-table', BaseTable);
Vue.component('search-filter', SearchFilterField);
