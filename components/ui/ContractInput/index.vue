<template>
  <div class="input">
    <div class="header">
      <div class="header__name">
        <h6 class="header__header">
          {{ number + '. ' + abiItem.name }}
        </h6>
      </div> <div class="header__arrow">
        <span class="icon-chevron_down" />
      </div>
    </div>
    <div class="inputs">
      {{ abiItem }}
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
};
</script>

<style scoped lang="scss">
.input {
  margin-bottom: 10px;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #F7F8FA;
  padding: 10px;
  &__header {
    margin-bottom: 0;
    line-height: 100%;
  }
}
</style>
