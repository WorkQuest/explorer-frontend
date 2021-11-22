<template>
  <div class="info">
    <div
      v-if="token !== ''"
      class="info-wrap"
    >
      <p class="info__header">
        {{ $t('ui.token.summary') }}
      </p>
      <p class="info__info">
        <span class="info__title">{{ $t('ui.token.contract') }}</span>
        <nuxt-link
          class="info__link"
          :to="'/contract'"
        >
          0xdac17f958d2ee523a2206206994597c13d831ec7
        </nuxt-link>
        <span class="icon-copy" />
      </p>
      <p class="info__info">
        <span class="info__title">{{ $t('ui.token.decimals') }}</span>
        6
      </p>
    </div>
    <div
      v-else
      class="info-wrap"
    >
      <p class="info__header">
        {{ $t('ui.token.more') }}
      </p>
      <p class="info__info">
        <span class="info__title">{{ $t('ui.token.creator') }}</span>
        <nuxt-link
          class="info__link"
          :to="'/account/'"
        >
          {{ formatItem('0xe24f99419d788003c0d5212f05f47b1572cdc38a', 9, 6) }}
        </nuxt-link>
        {{ $t('ui.token.atTxn') }}
        <nuxt-link
          class="info__link"
          :to="'/account/'"
        >
          {{ formatItem('0xe24f99419d788003c0d5212f05f47b1572cdc38a', 9, 6) }}
        </nuxt-link>
      </p>
      <p class="info__info">
        <span class="info__title">{{ $t('ui.token.tracker') }}</span>
        <nuxt-link
          class="info__link"
          :to="'/account/'"
        >
          {{ formatItem('Vault:JetSwappWINGS(vault) 16,032.204453', 26, 0) }}
        </nuxt-link>
      </p>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Info',
  props: {
    token: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.info {
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
  &__link {
    @include link;
  }
}
.icon-copy::before {
  color: $blue;
  font-size: 16px;
  cursor: pointer;
}
@include _767 {
  .info {
    &__title {
      display: block;
    }
    &__info {
      max-width: 300px;
      word-wrap: break-word;
    }
  }
}
</style>
