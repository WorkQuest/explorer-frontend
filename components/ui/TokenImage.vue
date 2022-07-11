<template>
  <div>
    <b-skeleton
      v-if="isLoading"
      type="avatar"
      :style="dimensions"
    />
    <img
      v-show="isLoaded"
      :src="imageLink"
      :width="iconSizes[size]"
      :height="iconSizes[size]"
      class="image"
      :class="`image__${size}`"
      :alt="symbol || $t('ui.token.token')"
      @load="loadHandler"
    >
  </div>
</template>

<script>

const sizeProps = ['big', 'small'];

export default {
  name: 'TokenImage',
  props: {
    link: {
      type: String,
      default: '',
    },
    symbol: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'small',
      validator: (value) => sizeProps.includes(value),
    },
  },
  data() {
    return {
      defaultLink: 'tokens/logo_gray.svg',
      iconSizes: {
        small: 15,
        big: 30,
      },
      isLoaded: false,
      isLoading: !!this.link,
      isError: !!this.link,
    };
  },
  computed: {
    dimensions() {
      return {
        width: `${this.iconSizes[this.size]}px`,
        height: `${this.iconSizes[this.size]}px`,
      };
    },
    imageLink() {
      if (this.link) {
        return this.link;
      }
      return require(`~/assets/img/${this.defaultLink}`);
    },
  },
  methods: {
    loadHandler() {
      this.isLoaded = true;
      this.isLoading = false;
      this.isError = false;
    },
  },
};
</script>

<style scoped lang="scss">
.image {
  overflow: hidden;
  object-fit: contain;
  &__small {
    width: 20px;
    height: 20px;
  }
  &__big {
    width: 30px;
    height: 30px;
  }
}
</style>
