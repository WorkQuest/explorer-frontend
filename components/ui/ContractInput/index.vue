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
            :label="input.name ? input.name : abiItem.name"
            :name="input.name ? input.name : abiItem.name"
            autocomplete="off"
            labelcolor="black"
            spellcheck="false"
            :placeholder="`${input.name} (${input.type})`"
            :rules="'required'"
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
        </div>
      </validation-observer>
      <div class="outputs">
        <template v-if="abiItem.outputs.length > 0">
          <div
            v-if="abiItem.inputs.length > 0"
            class="outputs__types types"
          >
            <span

              class="types__icon"
            >
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
            v-if="response"
            class="outputs__response response"
          >
            <template v-for="(item, i) in abiItem.outputs">
              <div
                v-if="abiItem.inputs.length > 0"
                :key="`${i}__type`"
                class="response__type"
              >
                [ <strong> {{ abiItem.name }} </strong> {{ $t('ui.contract.method') }} {{ $t('ui.contract.response') }} ]
              </div>
              <div
                :key="`${i}__value`"
                class="response__value"
              >
                <span class="icon-caret_right" /> <em> {{ item.type }}:</em>  {{ response[i] }}
              </div>
            </template>
          </div>
        </template>
      </div>
    </b-collapse>
  </div>
</template>

<script>

const type = ['read', 'write'];
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
      response: null,
      error: null,
      buttonDisabled: false,
      isLoading: false,
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
      // const regex = /\[]/
      // let params
      // const valueExist = this.value.length > 0
      // if (valueExist) {
      //   params = this.value.map((item, index) => {
      //     const isArray = item.search(regex)
      //   })
      // }
      const payload = {
        type: this.type,
        abi: this.abi,
        address: this.address,
        method: this.abiItem.name,
        params: this.value.length > 0 ? this.value : null,
      };
      this.showLoader(true);
      const request = await this.$store.dispatch('main/requestFromBlockchain', payload);
      if (request.ok) {
        this.response = request.result;
      } else {
        this.error = request.data;
      }
      this.showLoader(false);
    },
    showLoader(loading) {
      if (loading) {
        this.response = null;
        this.error = null;
      }
      this.isLoading = loading;
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
}
.response {
  &__type {
    color: #4C5767;
  }
  &__value {
    display: flex;
    align-items: center;
    &>em {
      margin-right: 10px;
    }
  }
}
.types {
  &__error {
    font-size: 12px;
    color: #dc3545;
    padding: 4px;
  }
}
.button {
  width: 150px;
  position: relative;
}
.spinner {
  position: absolute;
  left: 15px;
}
.grey {
  color: #4C5767;
}

</style>
