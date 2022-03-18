<template>
  <div class="contract-info">
    <div class="contract-info__menu">
      <span
        v-for="(tab, i) in tabs"
        :key="`${i}__contract`"
        class="contract-info__tab"
        :class="{ 'contract-info__tab_active': activeTab === tab }"
        @click="tabHandler(tab)"
      >
        {{ $t(`ui.contract.${tab}`) }}
      </span>
    </div>
    <div class="contract-info__content content">
      <div
        v-if="activeTab === 'contract'"
        class="content__contract"
      >
        <editor
          v-model="accountInfo.smartContract.contract_source_code"
          lang="html"
          theme="chrome"
          width="1000"
          height="1000"
          contenteditable="false"
          @init="editorInit"
        />
      </div>
      <div
        v-if="activeTab ==='read'"
        class="content__read"
      >
        read
      </div>
      <div
        v-if="activeTab==='write'"
        class="content__write"
      >
        write
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters } from 'vuex';

const contractProps = {
  token: ['read', 'write'],
  contract: ['contract', 'read', 'write'],
};

export default {
  name: 'ContractInfo',
  components: {
    editor: require('vue2-ace-editor'),
  },
  props: {
    type: {
      type: String,
      default: 'token',
      validator: (value) => Object.keys(contractProps).indexOf(value) !== -1,
    },
  },
  data() {
    return {
      activeTab: 'contract',
      tabs: contractProps[this.type],
      content: '',
    };
  },
  computed: {
    ...mapGetters({
      accountInfo: 'account/getAccountInfo',
    }),
  },
  methods: {
    tabHandler(tab) {
      this.activeTab = tab;
    },
    editorInit() {
      require('brace/ext/language_tools');
    },
  },
};
</script>

<style scoped lang="scss">

.contract-info {
  &__menu {
    margin: 0 0 27px 20px
  }
  &__tab {
    @include text-simple;
    font-size: 15px;
    margin-right: 20px;
    padding-bottom: 5px;
    color: $black500;
    cursor: pointer;
    &_active {
      @include text-simple;
      border-bottom: 2px solid $blue;
    }
  }
  &__content {
    padding: 0 20px;
  }
}

</style>
