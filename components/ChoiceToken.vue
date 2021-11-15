<template>
  <div class="tokens">
    <base-field
      v-model="search"
      is-search="true"
      is-hide-error="true"
      placeholder="Search"
      class="tokens__search"
    />
    <div class="token-wrapper">
      <div
        v-for="n in 10"
        :key="n"
        class="token"
      >
        <p class="token__uniswap">
          <img
            class="token__image"
            src="~/assets/img/app/question.svg"
            alt="question"
          >
          Uniswap V2 (UNI-V2)
        </p>
        <p class="token__code">
          0.58479491 UNI-V2
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChoiceToken',
  data: () => ({
    search: '',
  }),
};
</script>

<style lang="scss" scoped>
.tokens {
    background: $white;
    box-shadow: 0px 47.1676px 61.4131px rgba(10, 27, 61, 0.078707), 0px 26.7219px 32.8344px rgba(10, 27, 61, 0.0629546), 0px 14.4955px 18.4067px rgba(10, 27, 61, 0.0598272), 0px 6.96225px 9.77565px rgba(10, 27, 61, 0.0584222), 0px 2.43911px 4.06787px rgba(10, 27, 61, 0.0492837);
    border-radius: 6px;
    max-height: 499px;
    padding-top: 15px;
    &__search {
      background: $black0;
      border-radius: 6px;
      margin: 15px 10px 15px;
    }
}
.token {
    padding: 15px 0 15px 15px;
    border-bottom: 1px solid $black100;
    &:hover {
      background: $black0;
    }
    &-wrapper {
      height: 394px;
      overflow-y: scroll;
      overflow-x: hidden;
    }
    &__uniswap {
        @include text-simple;
        @include normal-font-size;
        display: flex;
    }
    &__image {
        margin-right: 10px;
    }
    &__code {
        @include text-simple;
        @include normal-font-size;
        font-size: 14px;
        color: $black300;
        margin-top: 10px;
    }
}
</style>
