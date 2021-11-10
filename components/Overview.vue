<template>
  <div class="overview">
    <div
      v-if="token !== ''"
      class="overview-wrap"
    >
      <p class="overview__header">
        Overview
      </p>
      <p class="overview__info">
        <span class="overview__title">Max Total Supply</span>
        30 910 401 959,97513 {{ token }}
      </p>
      <p class="overview__info">
        <span class="overview__title">Holders</span>
        3 321 050
      </p>
      <p class="overview__info">
        <span class="overview__title">Transfers</span>
        115 777 329
      </p>
    </div>
    <div
      v-else
      class="overview-wrap"
    >
      <p class="overview__header">
        Overview
      </p>
      <p class="overview__info">
        <span class="overview__title">Balance</span>
        0.487487673208130346 WUSD
      </p>
      <p class="overview__info">
        <span class="overview__title">WUSD Value</span>
        $0.43 (@ $0.89/WUSD)
      </p>
      <div class="overview__token">
        Token
      </div>
      <div class="overview__input">
        Placeholder
        <span
          class="icon-caret_down"
          @click="openChoice"
        />
      </div>
      <ChoiceToken
        v-if="isChoosing"
        class="overview__select"
      />
    </div>
  </div>
</template>
<script>
import ChoiceToken from '~/components/ChoiceToken.vue';

export default {
  name: 'Overview',
  components: {
    ChoiceToken,
  },
  props: {
    token: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    isChoosing: false,
  }),
  methods: {
    openChoice() {
      if (this.isChoosing) {
        this.isChoosing = false;
      } else {
        this.isChoosing = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.overview {
  padding: 20px;
  background: $white;
  border-radius: 6px;
  max-width: 578px;
  position: relative;
  &__header {
    @include text-simple;
    @include normal-font-size;
    font-size: 18px;
    margin-bottom: 20px;
  }
  &__info {
    @include text-simple;
    @include normal-font-size;
    margin-bottom: 15px;
  }
  &__title {
    @include text-simple;
    @include normal-font-size;
    font-weight: 600;
    margin-right: 10px;
  }
  &__token {
    @include text-simple;
    @include normal-font-size;
    margin-bottom: 5px;
  }
  &__input {
    @include text-simple;
    @include normal-font-size;
    padding: 11px 20px 11px 15px;
    background: $black0;
    border-radius: 6px;
    color: $black200;
  }
  &__select {
    position: absolute;
    z-index: 1;
    width: 100%;
    left: 0;
  }
}
.icon-caret_down::before {
  color: $blue;
  font-size: 20px;
  float: right;
  cursor: pointer;
}
</style>
