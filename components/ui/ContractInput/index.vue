<template>
  <div class="contract-input">
    <div class="contract-input__header header">
      <div class="header__name">
        <h6 class="header__header">
          {{ number + '. ' + abiItem.name }}
        </h6>
      </div>
      <div
        class="header__arrow"
        @click="collapseHandler()"
      >
        <span
          v-if="isVisible"
          class="icon icon-chevron_down"
        />
        <span
          v-if="!isVisible"
          class="icon icon-chevron_right"
        />
      </div>
    </div>
    <b-collapse
      :id="abiItem.name"
      v-model="isVisible"
      visible
      class="contract-input__body body"
    >
      <validation-observer
        v-if="abiItem.inputs.length > 0"
        v-slot="{ handleSubmit }"
        tag="div"
        class="inputs"
      >
        <template v-for="(input, i) in abiItem.inputs">
          <base-field
            :key="`${i}_abiInput`"
            v-model="value[i]"
            type="text"
            :label="input.name ? input.name : `${abiItem.name}`"
            :name="input.name ? input.name : `${abiItem.name}`"
            autocomplete="off"
            labelcolor="black"
            spellcheck="false"
            :placeholder="`${input.name ? input.name : abiItem.name} (${input.type})`"
            :rules="{
              required: true,
              isArray: checkType(input.type) ? value : false
            }"
          />
        </template>
        <div class="inputs__footer">
          <base-btn
            :text="$tc(`ui.contract.buttons.${type}`)"
            :mode="'outline'"
            :disabled="isLoading"
            class="button"
            @click="handleSubmit(contractHandler)"
          >
            <b-spinner
              v-if="isLoading"
              small
              type="grow"
              class="spinner"
            />
          </base-btn>
          <base-btn
            v-if="hash"
            :disabled="isLoading"
            class="button"
            :link="`/transactions/${hash}`"
          >
            {{ $t('ui.contract.viewTransactions') }}
          </base-btn>
        </div>
      </validation-observer>
      <div class="outputs">
        <template v-if="abiItem.outputs.length > 0 && type === 'read'">
          <div
            v-if="abiItem.inputs.length > 0"
            class="outputs__types types"
          >
            <span class="types__icon">
              &boxur;
            </span>
            <span
              v-for="(output, i) in abiItem.outputs"
              :key="`${i}_abiOutput`"
              class="types__name"
            >
              {{ output.name }} <em v-if="abiItem.inputs.length > 0">{{ output.type }}</em>
            </span>
            <span
              v-if="error"
              class="types__error"
            >
              {{ error }}
            </span>
          </div>
          <div
            v-if="response.length > 0"
            class="outputs__response response"
          >
            <template v-if="abiItem.inputs.length > 0">
              [ <strong> {{ abiItem.name }} </strong> {{ $t('ui.contract.method') }} {{ $t('ui.contract.response') }} ]
            </template>
            <template v-for="(item, i) in abiItem.outputs">
              <div
                v-if="abiItem.inputs.length > 0"
                :key="`${i}__type`"
                class="response__type"
              />
              <div
                :key="`${i}__value`"
                class="response__value"
              >
                <span class="icon-dot_03_m" /> <strong> {{ item.name }}  </strong> <em> {{ item.type }}:</em>  {{ response[i] }}
              </div>
            </template>
          </div>
        </template>
        <template v-if="abiItem.outputs.length > 0 && type !== 'read'">
          <div class="outputs__write">
            <span
              v-if="error"
              class="types__error"
            >
              {{ error }}
            </span>
          </div>
        </template>
        <template v-else>
          <div class="outputs__write">
            <span
              v-if="error"
              class="types__error"
            >
              {{ error }}
            </span>
          </div>
        </template>
      </div>
    </b-collapse>
  </div>
</template>

<script>

import { isArrayType, splitString } from '~/utils';

const type = ['read', 'write', 'nonpayable'];
const abiType = ['function', 'constructor', 'event', 'fallback'];

export default {
  name: 'ContractInput',
  props: {
    type: {
      type: String,
      default: '',
      validator: (value) => type.includes(value),
    },
    abiItem: {
      type: Object,
      default: () => {},
      validator: (value) => abiType.includes(value.type),
    },
    number: {
      type: Number,
      default: 0,
    },
    address: {
      type: String,
      default: '',
    },
    abi: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      isVisible: true,
      value: [],
      response: [],
      error: null,
      buttonDisabled: false,
      isLoading: false,
      hash: '',
    };
  },
  async mounted() {
    if (this.abiItem.inputs.length === 0 && this.type === 'read') {
      await this.contractHandler();
    }
  },
  methods: {
    collapseHandler() {
      this.isVisible = !this.isVisible;
    },
    async contractHandler() {
      const params = this.value.map((item, index) => {
        const isArray = isArrayType(this.abiItem.inputs[index].type);
        return isArray ? splitString(item) : item;
      });
      const payload = {
        type: this.type,
        abi: this.abi,
        address: this.address,
        method: this.abiItem.name,
        params: this.value.length > 0 ? params : null,
      };
      this.showLoader(true);
      const request = await this.$store.dispatch('main/requestFromBlockchain', payload);
      if (request.ok) {
        const { result } = request;
        if (this.type === 'read' && this.abiItem.outputs.length > 1) {
          this.response = [...result];
        } else {
          this.response.push(result);
        }
        if (this.type !== 'read') {
          this.hash = result.transactionHash;
        }
      } else if (this.type === 'read') {
        this.error = request.data;
      } else {
        this.error = request.msg;
        this.hash = request.data?.receipt?.transactionHash || '';
      }
      this.showLoader(false);
    },
    showLoader(loading) {
      if (loading) {
        this.response = [];
        this.hash = '';
        this.error = null;
      }
      this.isLoading = loading;
    },
    checkType(stringType) {
      return isArrayType(stringType);
    },
  },
};
</script>

<style scoped lang="scss">
.contract-input {
  margin-bottom: 10px;
  border: 1px solid #e6e9ec;
  border-radius: 6px;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #F7F8FA;
    padding: 10px;
  }
  &__body {
    padding: 10px;
  }
}
.header {
  &__header {
    margin-bottom: 0;
    line-height: 100%;
  }
  &__arrow {
    transition: 0.3s ease-in-out;
    cursor: pointer;
  }
}
.inputs {
  display: flex;
  flex-direction: column;
  &__footer {
    display: flex;
    align-items: center;
  }
}
.outputs {
  display: flex;
  flex-direction: column;
  &__types {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  &__write {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    margin-bottom: 10px;
  }
}
.response {
  &__type {
    color: #4C5767;
  }
  &__value {
    display: flex;
    align-items: flex-start;
    & > span {
      margin-top: 5px;
  }
    & > strong, em {
      margin-right: 10px;
    }
  }
}
.types {
  &__name {
    margin-right: 10px;
  }
  &__error {
    font-size: 12px;
    color: #dc3545;
    padding: 4px;
    overflow-wrap: anywhere;
  }
}
.button {
  width: 150px;
  position: relative;
  margin-right: 10px;
  text-decoration: none;
}
.view {
  width: 150px;
  color: $black600;
}
.spinner {
  position: absolute;
  left: 15px;
}
.grey {
  color: #4C5767;
}

</style>
