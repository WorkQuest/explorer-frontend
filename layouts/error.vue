<template>
  <div
    v-if="error"
    class="error"
  >
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
</template>
<script>

export default {
  name: 'Error',
  props: {
    error: {
      type: Object,
      default: () => {},
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
  margin: auto auto;
  width: 1180px;
  text-align: center;
  &__title {
    font-family: 'Inter', sans-serif;
    font-style: normal;
    line-height: 130%;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 34px;
    margin-top: 20px;
  }
  &__content {
    margin-top: 20px;
  }
  &__footer {
    margin: 20px auto;
    width: 220px;
  }
}

</style>
