<template>
  <div class="item">
    <p class="item__header">
      {{ title }}
    </p>
    <p
      v-if="item === 'link'"
      class="item__info"
    >
      <nuxt-link
        class="item__link"
        :to="`blocks/${info}`"
      >
        {{ info }}
      </nuxt-link>
    </p>
    <p
      v-else-if="item === address"
      class="item__info item__info_blue"
    >
      {{ info }}
      <span class="icon-copy" />
    </p>
    <p
      v-else-if="item === status"
      class="item__info"
      :class="{'item__info_green': status === 1, 'item__info_red': status === 2}"
    >
      {{ info }}
    </p>
    <p
      v-else
      class="item__info"
    >
      {{ info }}
    </p>
    <p class="item__note">
      {{ note }}
    </p>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    info: {
      type: String || Number,
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
    item: {
      type: String,
      default: '',
    },
  },
};
</script>
<style lang="scss" scoped>
.item {
    &__header {
        @include text-simple;
        font-weight: 600;
        font-size: 18px;
    }
    &__info {
        @include text-simple;
    }
    &__note {
        @include text-simple;
        font-size: 14px;
        color: $black300;
    }
}
</style>
