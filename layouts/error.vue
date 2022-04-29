<template>
  <div
    v-if="error"
    class="error"
  >
    <div class="error__wrapper">
      <template v-if="error.statusCode === 404">
        <h1 class="error__title error__notFound">
          {{ $t('errors.pageNotFound') }}
        </h1>
      </template>
      <template v-else>
        <h1 class="error__title error__other">
          {{ $t('errors.other') }}
        </h1>
      </template>

      <div class="error__content">
        {{ error.message }}
      </div>

      <div class="error__footer">
        <base-btn
          class="error__btn"
          :text="$tc('ui.home')"
          @click="toMain"
        />
      </div>
    </div>
  </div>
</template>
<script>

export default {
  name: 'Error',
  props: {
    error: {
      type: Object,
      default: () => {
      },
    },
  },
  methods: {
    toMain() {
      this.$router.push('/');
    },
  },
};
</script>
<style lang="scss" scoped>

.error {
  width: 100%;
  max-width: 1180px;
  margin: auto auto;

  &__wrapper {
    text-align: center;
    display: flex;
    flex-direction: column;
  }

  &__title {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    line-height: 130%;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 34px;
    margin-top: 20px;
  }

  &__footer {
    height: 46px;
    margin: 20px auto;
    width: 220px;
  }
}

</style>
