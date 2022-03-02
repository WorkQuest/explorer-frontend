<template>
  <div class="fields">
    <validation-observer v-slot="{ handleSubmit }">
      <form @submit.prevent>
        <div class="fields__search-field">
          <base-field
            v-model="search"
            class="fields__input"
            :class="includeFilter ? 'fields__input_filtered' : ''"
            :is-search="true"
            :is-hide-error="true"
            :rules="'required'"
            :placeholder="$tc('ui.forms.searchPlaceholder')"
          />
          <div class="fields__buttons-field">
            <div
              v-if="includeFilter"
              v-click-outside="closeAll"
              class="fields__filters"
            >
              <button
                class="fields__filter"
                @click="showFilters()"
              >
                {{ currentType.name }}
                <span class="icon-caret_down" />
                <transition name="fade">
                  <div
                    v-if="isShowFilters"
                    class="filter"
                  >
                    <div
                      v-for="(item, i) in types"
                      :key="i"
                      class="filter__container"
                    >
                      <div
                        class="filter__items"
                        @click="setFilter(item)"
                      >
                        <span class="filter__text">
                          {{ item.name }}
                        </span>
                      </div>
                    </div>
                  </div>
                </transition>
              </button>
            </div>
            <div class="fields__button-field">
              <base-btn
                class="fields__search-button"
                :text="$tc('ui.forms.search')"
                @click="handleSubmit(onSearch)"
              />
            </div>
          </div>
        </div>
      </form>
    </validation-observer>
  </div>
</template>
<script>

import { mapActions } from 'vuex';
import ClickOutside from 'vue-click-outside';
import { searchTypes } from '~/utils';

export default {
  name: 'SearchFilter',
  directives: {
    ClickOutside,
  },

  props: {
    includeFilter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      search: '',
      isShowFilters: false,
      currentType: {
        value: 'all',
        name: this.$t('ui.forms.filterTypes.all'),
      },
      types: [
        {
          value: 'all',
          name: this.$t('ui.forms.filterTypes.all'),
        },
        {
          value: 'address',
          name: this.$t('ui.forms.filterTypes.address'),
        },
        {
          value: 'txnHash',
          name: this.$t('ui.forms.filterTypes.txnHash'),
        },
        {
          value: 'block',
          name: this.$t('ui.forms.filterTypes.block'),
        },
        {
          value: 'token',
          name: this.$t('ui.forms.filterTypes.token'),
        },
      ],
    };
  },
  methods: {
    ...mapActions({
      searchHandler: 'main/searchHandler',
    }),
    showFilters() {
      this.isShowFilters = !this.isShowFilters;
    },
    closeAll() {
      this.isShowFilters = false;
    },
    setFilter(item) {
      this.currentType = item;
    },
    async onSearch() {
      if (this.search) {
        const q = this.search.trim();
        let type = null;
        if (this.includeFilter) {
          type = /^[A-Za-z]+$/.test(q) && this.currentType.value === 'all'
            ? searchTypes.tokens
            : searchTypes[this.currentType.value];
        }
        try {
          const payload = { q, type };
          const response = await this.searchHandler(payload);
          if (response.ok) {
            await this.$router.push(response.result);
          } else {
            this.$nuxt.error({ statusCode: 404, message: e.message });
          }
        } catch (e) {
          this.$nuxt.error({ statusCode: 500, message: e.message });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.fields {
  display: flex;
  align-items: center;
  &__search-field {
    @include container;
    background: $white;
    height: 83px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-radius: 6px;
  }
  &__input {
    flex-basis: 100%;
    &_filtered {
      flex-basis: 60%;
    }
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
    cursor: pointer;
    position: relative;
    padding: 11px 20px;
    border-radius: 6px;
    &:hover {
      border: $black0 1px solid;
    }
  }
  &__button-field {
    height: 83px;
    display: flex;
    align-items: center;
    border-left: $black0 1px solid;
  }
  &__search-button {
    width: 220px !important;
    margin-left: 20px;
  }
}
.icon-caret_down:before {
  color: $black400;
  font-size: 20px;
  margin-left: 17px;
}
.filter {
  position: absolute;
  top: 50px;
  background: $white;
  box-shadow: 0 17px 17px rgba(0, 0, 0, 0.05), 0 5.125px 5.125px rgba(0, 0, 0, 0.03), 0 2.12866px 2.12866px rgba(0, 0, 0, 0.025), 0 0.769896px 0.769896px rgba(0, 0, 0, 0.0174206);
  border-radius: 6px;
  min-width: 200px;
  z-index: 10000000;
  &__items {
    padding: 10px 15px;
    display: grid;
    grid-template-columns: 1fr;
    color: $black500;
    &:hover {
      color: $black800;
    }
  }
}

@include _991 {
  .mobile {
    display: flex;
  }
  .fields {
    &__search-field {
      background: $white;
      border-radius: 6px;
      padding: 10px 14px;
      height: auto;
    }
    &__buttons-field {
      display: none;
    }
    &__input {
      &_filtered {
        flex-basis: 100%;
      }
    }
  }
}
</style>
