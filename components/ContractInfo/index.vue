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
        <div class="content__details">
          <div class="details__info">
            {{ $t('ui.contract.name') }}: <b> {{ contractName }} </b>
          </div>
          <div class="details__info">
            {{ $t('ui.contract.compiler') }}: <b> {{ compilerVersion }} </b>
          </div>
          <div class="details__info">
            {{ $t('ui.contract.optimization') }}:
            <b> {{ optimizationEnabled }} {{ optimizationStatus }} </b>
          </div>
          <div class="details__info">
            {{ $t('ui.contract.other') }}:  <b> {{ evmVersion || $t('ui.contract.default') }} </b>
          </div>
        </div>
        <h5 class="content__title">
          {{ $t('ui.contract.contractSourceCode') }}
        </h5>
        <editor
          ref="editor"
          v-model="contractCode"
          class="content__code"
          :lang="lang"
          :width="editorWidth"
          :height="editorHeight"
          :theme="theme"
          contenteditable="false"
          @init="editorInit"
        />
        <div class="content__abi">
          <h5 class="content__title">
            {{ $t('ui.contract.abi') }}
          </h5>
          <textarea
            :value="JSON.stringify(contractAbi)"
            class="content__code"
            readonly="true"
            rows="200"
          />
        </div>
        <div class="content__bytecode">
          <h5 class="content__title">
            {{ $t('ui.contract.bytecode') }}
          </h5>
          <textarea
            :value="bytecode"
            class="content__code"
            readonly="true"
            rows="100"
          />
        </div>
        <div class="content__deployedBytecode">
          <h5 class="content__title">
            {{ $t('ui.contract.deployedBytecode') }}
          </h5>
          <textarea
            :value="deployedBytecode"
            class="content__code"
            readonly="true"
            rows="100"
          />
        </div>
      </div>
      <div
        v-if="activeTab ==='read'"
        class="content__read"
      >
        <contract-input
          v-for="(item, i) in filteredAbi"
          :key="`${i}__read`"
          :type="activeTab"
          :abi-item="item"
          :number="i + 1"
          :address="address"
          :abi="JSON.parse(JSON.stringify(contractAbi))"
          :is-connected-web3="isConnectedWeb3"
        />
      </div>
      <div
        v-if="activeTab==='write'"
        class="content__write"
      >
        <div class="connection">
          <span
            class="icon-dot_03_m connection__icon"
            :class="{'connection__icon_connected': isConnectedWeb3}"
          />
          <base-btn
            mode="outline"
            class="connection__button"
            :text="$tc('ui.contract.buttons.connectWallet')"
            :disabled="isConnectedWeb3"
            @click="connectWallet()"
          />
          <span class="connection__address">{{ walletAddress }}</span>
        </div>
        <contract-input
          v-for="(item, i) in filteredAbi"
          :key="`${i}__write`"
          :type="activeTab"
          :abi-item="item"
          :number="i + 1"
          :address="address"
          :abi="JSON.parse(JSON.stringify(contractAbi))"
          :is-connected-web3="isConnectedWeb3"
        />
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
    address: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      activeTab: contractProps[this.type][0],
      tabs: contractProps[this.type],
      content: '',
      theme: 'clouds',
      lang: 'solidity',
      editorWidth: '100%',
      editorHeight: '400px',
    };
  },
  computed: {
    ...mapGetters({
      accountInfo: 'account/getAccountInfo',
      isWalletConnected: 'main/getIsWalletConnected',
      isDefaultChainId: 'main/getIsDefaultChainId',
      walletAddress: 'main/getWalletAddress',
    }),
    contractCode() {
      return this.accountInfo.smartContract?.contract_source_code || '';
    },
    compilerVersion() {
      return this.accountInfo.smartContract?.compiler_version || '';
    },
    contractName() {
      return this.accountInfo.smartContract?.name || '';
    },
    optimization() {
      return this.accountInfo.smartContract?.optimization || false;
    },
    optimizationRuns() {
      return this.accountInfo.smartContract?.optimization_runs || '';
    },
    evmVersion() {
      return this.accountInfo.smartContract?.evm_version || '';
    },
    contractAbi() {
      return this.accountInfo.smartContract?.abi?.abi ? this.accountInfo.smartContract?.abi.abi : '';
    },
    bytecode() {
      return this.accountInfo.smartContract?.abi?.bytecode || '';
    },
    deployedBytecode() {
      return this.accountInfo.smartContract?.abi?.deployedBytecode || '';
    },
    filteredAbi() {
      if (this.activeTab === 'read') {
        return JSON.parse(JSON.stringify(this.contractAbi.filter((item) => item.type === 'function' && item.stateMutability === 'view')));
      }
      if (this.activeTab === 'write') {
        return JSON.parse(JSON.stringify(this.contractAbi.filter((item) => item.type === 'function' && item.stateMutability !== 'view')));
      }
      return [];
    },
    optimizationStatus() {
      return this.optimization && this.optimizationRuns
        ? `${this.$t('ui.contract.with')} ${this.optimizationRuns} ${this.$t('ui.contract.runs')}` : '';
    },
    optimizationEnabled() {
      return this.optimization ? this.$t('ui.contract.yes') : this.$t('ui.contract.no');
    },
    isConnectedWeb3() {
      return (this.isWalletConnected && this.isDefaultChainId);
    },
  },
  beforeDestroy() {
    this.$store.commit('main/resetConnection');
  },
  methods: {
    tabHandler(tab) {
      this.activeTab = tab;
    },
    editorInit() {
      require('brace/ext/language_tools');
      require(`brace/theme/${this.theme}`);
      require('ace-mode-solidity');
      const { editor } = this.$refs.editor;
      editor.textInput.setReadOnly(true);
      editor.setShowPrintMargin(false);
    },
    async connectWallet() {
      await this.$store.dispatch('main/connectWallet');
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
    padding: 0 20px 20px 20px;
  }
}

.content {
  &__title {
    padding: 5px 0;
    margin-bottom: 5px;
  }
  &__details {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 25px;
    margin-bottom: 25px;
  }
  &__code {
    width: 100%;
    border: 1px solid transparent;
    white-space: pre-wrap;
    overflow-wrap: break-word;
    font-size: 12px;
    max-height: 400px;
    padding: 10px;
    background: #F7F8FA;
    border-radius: 6px;
    margin-bottom: 10px;
  }
  &__abi, &__bytecode, &__deployedBytecode {
    & > textarea {
      height: 200px;
    }
  }
}

.connection {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  &__button {
    max-width: 200px;
    margin-right: 10px;
  }
  &__icon {
    font-size: 30px;
    color: red;
    margin-right: 10px;
    &_connected {
      color: green;
    }
  }
}

</style>
