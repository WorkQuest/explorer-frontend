<template>
  <button
    v-clipboard:copy="value"
    v-clipboard:success="ClipboardSuccessHandler"
    v-clipboard:error="ClipboardErrorHandler"
    class="btn__copy"
    type="button"
  >
    <span
      class="icon-copy"
      :style="iconColorStyle"
    />
  </button>
</template>

<script>
export default {
  name: 'ButtonCopy',
  props: {
    value: {
      type: String,
      default: '',
    },
    iconColor: {
      type: String,
      default: '#0083C7',
    },
    buttonClass: {
      type: String,
      default: '',
    },
  },
  computed: {
    iconColorStyle() {
      return {
        '--color': `var(--${this.iconColor})`,
      };
    },
  },
};
</script>

<style lang="scss" scoped>
.btn {
  &__copy {
    height: 35px;
    width: 35px;
    align-items: center;
    justify-items: center;
    border: 1px solid $black0;
    padding: 5px;
    border-radius: 6px;
    transition: .5s;

    &:hover {
      background: $black100;
    }
  }
}
.icon-copy {
  color: var(--color);
  font-size: 20px;
  cursor: pointer;
}
</style>
