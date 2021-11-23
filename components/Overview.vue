<template>
  <div class="overview">
    <div
      v-if="token !== ''"
      class="overview-wrap"
    >
      <p class="overview__header">
        {{ $t('ui.token.overview') }}
      </p>
      <p class="overview__info">
        <span class="overview__title">{{ $t('ui.token.maxSupply') }}</span>
        30 910 401 959,97513 {{ token }}
      </p>
      <p class="overview__info">
        <span class="overview__title">{{ $t('ui.token.holders') }}</span>
        3 321 050
      </p>
      <p class="overview__info">
        <span class="overview__title">{{ $t('ui.token.transfers') }}</span>
        115 777 329
      </p>
    </div>
    <div
      v-else
      class="overview-wrap"
    >
      <p class="overview__header">
        {{ $t('ui.token.overview') }}
      </p>
      <p class="overview__info">
        <span class="overview__title">{{ $t('ui.token.balance') }}</span>
        0.487487673208130346 WUSD
      </p>
      <p class="overview__info">
        <span class="overview__title">WUSD {{ $t('ui.tx.value') }}</span>
        $0.43 (@ $0.89/WUSD)
      </p>
      <div class="overview__token">
        {{ $t('ui.token.token') }}
      </div>
      <div class="overview__input">
        {{ $t('ui.token.placeholder') }}
        <span
          class="icon-caret_down"
          @click="toggleChoice"
        />
      </div>
      <ChoiceToken
        v-if="isChoosing"
        v-click-outside="hideChoice"
        class="overview__select"
      />
    </div>
  </div>
</template>
<script>
import ClickOutside from 'vue-click-outside';
import ChoiceToken from '~/components/ChoiceToken.vue';

export default {
  name: 'Overview',
  components: {
    ChoiceToken,
  },
  directives: {
    ClickOutside,
  },
  props: {
    token: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isChoosing: false,
    };
  },
  methods: {
    toggleChoice() {
      this.isChoosing = !this.isChoosing;
      document.querySelector('.primary').classList.toggle('modal-active');
    },
    hideChoice() {
      this.isChoosing = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.overview {
  background: $white;
  border-radius: 6px;
  max-width: 578px;
  &-wrap {
    margin: 20px;
    position: relative;
  }
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

@include _767 {
  .overview {
    @include container;
    &__title {
      display: block;
    }
  }
}
</style>
