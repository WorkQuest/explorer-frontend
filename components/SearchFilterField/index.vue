<template>
  <div class="fields">
    <div class="fields__search-field">
      <base-field
        v-model="search"
        class="fields__input"
        :is-search="true"
        :is-hide-error="true"
        :placeholder="$t('ui.forms.searchPlaceholder')"
      />
      <div class="fields__buttons-field">
        <div class="fields__filters">
          <span class="fields__filter">
            {{ $t('ui.forms.filters') }}
            <span class="icon-caret_down" />
          </span>
        </div>
        <div class="fields__button-field">
          <base-btn
            class="fields__search-button"
            :text="$t('ui.forms.search')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.fields {
    display: flex;
    align-items: center;
  &__search-field {
    background: $white;
    width: 1180px;
    height: 83px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-radius: 6px;
  }
  &__input {
    flex-basis: 60%;
  }
  &__buttons-field {
    display: flex;
  }
  &__filters {
    width: 200px;
    height: 83px;
    border-left: 1px $black0 solid;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__filter {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &__button-field {
    height: 83px;
    display: flex;
    align-items: center;
    border-left: $black0 1px solid;
  }
  &__search-button {
    width: 220px;
    margin-left: 20px;
  }
}
</style>
