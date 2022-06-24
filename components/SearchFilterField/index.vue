<template>
  <div class="search">
    <validation-observer
      v-slot="{ handleSubmit }"
      tag="div"
      class="search__wrapper"
    >
      <base-field
        v-model="search"
        class="search__field"
        :is-search="true"
        :is-hide-error="true"
        rules="required"
        :auto-focus="true"
        :placeholder="$tc('ui.forms.searchPlaceholder')"
        @enter="handleSubmit(onSearch)"
      />
      <base-dd
        v-model="currentType"
        class="search__dd"
        :items="types"
      />
      <base-btn
        class="search__btn"
        :text="$tc('ui.forms.search')"
        @click="handleSubmit(onSearch)"
      />
    </validation-observer>
  </div>
</template>
<script>

import { mapActions, mapGetters } from 'vuex';
import { searchTypes } from '~/utils';

export default {
  name: 'SearchFilter',

  props: {
    includeFilter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      search: '',
      currentType: 0,
    };
  },
  computed: {
    types() {
      return [
        this.$t('ui.forms.filterTypes.all'),
        this.$t('ui.forms.filterTypes.address'),
        this.$t('ui.forms.filterTypes.txnHash'),
        this.$t('ui.forms.filterTypes.block'),
        this.$t('ui.forms.filterTypes.token'),
      ];
    },
  },
  methods: {
    ...mapActions({
      searchHandler: 'main/searchHandler',
    }),
    async onSearch() {
      if (!this.search) return;
      const q = this.search.trim();
      let type = null;
      if (this.includeFilter) {
        type = /^[A-Za-z]+$/.test(q) && this.currentType === 0
          ? searchTypes.token
          : Object.values(searchTypes)[this.currentType];
      }
      const payload = { q, type, nuxt: this.$nuxt };
      const response = await this.searchHandler(payload);
      if (!response.ok) {
        await this.$router.push('/error');
        return;
      }
      await this.$router.push(response.result);
    },
  },
};
</script>
<style lang="scss" scoped>
.search {
  max-width: 1200px;

  &__wrapper {
    height: auto;
    background-color: $white;
    min-width: 0;
    border-radius: 6px;
    margin-top: 30px;
    margin-bottom: 25px;
    display: grid;
    grid-template-areas: "field field field field field dd btn btn";
    grid-gap: 5px;
    padding: 20px;
    align-items: center;
  }

  &__field {
    width: 6fr;
    grid-area: field;
  }

  &__dd {
    width: 1fr;
    height: 100%;
    grid-area: dd;
  }

  &__btn {
    width: 4fr;
    height: 100%;
    grid-area: btn;
  }
}

@include _767 {
  .search {
    &__wrapper {
      grid-template-areas: "field field field" "dd . btn";
      grid-gap: 20px;
    }

    &__field, &__dd, &__btn {
      height: 45px;
    }
  }
}

@include _480 {
  .search {
    &__wrapper {
      grid-template-areas: "field field" "dd btn";
      grid-gap: 20px;
    }
  }
}
</style>
