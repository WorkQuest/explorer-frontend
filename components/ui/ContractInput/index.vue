<template>
  <div class="input">
    <div class="input__header header">
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
          v-if="!isCollapsed"
          class="icon icon-chevron_down"
        />
        <span
          v-if="isCollapsed"
          class="icon icon-chevron_right"
        />
      </div>
    </div>
    {{ abiItem }}
    <div
      v-if="!isCollapsed"
      class="input__body body"
    >
      <template v-if="abiItem.inputs.length > 0">
        <template v-for="(input, i) in abiItem.inputs">
          <base-field
            :key="`${i}_abiInput`"
            type="text"
            :label="input.name"
            labelcolor="black"
            spellcheck="false"
            :placeholder="`${input.name} (${input.type})`"
          />
        </template>
      </template>
      <base-btn
        :text="'Query'"
        :mode="'outline'"
        class="button"
      />
      <div class="output">
        <template v-if="abiItem.outputs.length > 0">
          &boxur;
          <span
            v-for="(output, i) in abiItem.outputs"
            :key="`${i}_abiOutput`"
          >{{ output.name }} <em>{{ output.type }}</em>
            <span v-if="i !== abiItem.outputs.length - 1">,</span>
          </span>
        </template>
      </div>
    </div>
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
  },
  data() {
    return {
      isCollapsed: false,
    };
  },
  methods: {
    collapseHandler() {
      this.isCollapsed = !this.isCollapsed;
    },
  },
};
</script>

<style scoped lang="scss">
.input {
  margin-bottom: 10px;
  border: 1px solid #e6e9ec;
  border-radius: 6px;
  //box-shadow: 0 1px 0 #e6e9ec;
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
  }
}
.inputs {
  display: flex;
  flex-direction: column;
}
.icon {

}
.button {
  width: 150px;
}
</style>
