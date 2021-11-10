<template>
  <div class="info">
    <div
      v-if="token !== ''"
      class="info-wrap"
    >
      <p class="info__header">
        Profile Summary
      </p>
      <p class="info__info">
        <span class="info__title">Contract</span>
        <nuxt-link
          class="info__link"
          :to="'/account/'"
        >
          0xdac17f958d2ee523a2206206994597c13d831ec7
        </nuxt-link>
        <span class="icon-copy" />
      </p>
      <p class="info__info">
        <span class="info__title">Decimals</span>
        6
      </p>
    </div>
    <div
      v-else
      class="info-wrap"
    >
      <p class="info__header">
        More Info
      </p>
      <p class="info__info">
        <span class="info__title">ContractCreator</span>
        <nuxt-link
          class="info__link"
          :to="'/account/'"
        >
          {{ formatItem('0xe24f99419d788003c0d5212f05f47b1572cdc38a', 9, 6) }}
        </nuxt-link>
        at txn
        <nuxt-link
          class="info__link"
          :to="'/account/'"
        >
          {{ formatItem('0xe24f99419d788003c0d5212f05f47b1572cdc38a', 9, 6) }}
        </nuxt-link>
      </p>
      <p class="info__info">
        <span class="info__title">Token Tracker</span>
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
  data: () => ({
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
</style>
