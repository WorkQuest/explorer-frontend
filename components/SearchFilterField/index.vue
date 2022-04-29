<template>
  <validation-observer
    v-slot="{ handleSubmit }"
    tag="div"
    class="search"
  >
    <base-field
      v-model="search"
      class="search__field"
      :class="includeFilter ? 'fields__input_filtered' : ''"
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
</template>
<script>

import { mapActions } from 'vuex';
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
      if (this.search) {
        const q = this.search.trim();
        let type = null;
        if (this.includeFilter) {
          type = /^[A-Za-z]+$/.test(q) && this.currentType === 0
            ? searchTypes.tokens
            : Object.values(searchTypes)[this.currentType];
        }
        const payload = { q, type };
        const response = await this.searchHandler(payload);
        if (response.ok) {
          await this.$router.push(response.result);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.search {
  display: grid;
  grid-template-areas: "field field field field field dd btn btn";
  background-color: $white;
  height: 83px;
  width: 100%;
  min-width: 0;
  grid-gap: 5px;
  padding: 20px;
  border-radius: 6px;
  align-items: center;
  margin-top: 30px;
  margin-bottom: 25px;

  &__field {
    width: 6fr;
    grid-area: field;
  }

  &__dd {
    width: 1fr;
    grid-area: dd;
  }

  &__btn {
    width: 4fr;
    grid-area: btn;
  }
}

@include _991 {
  .search {
    height: auto;
    grid-template-areas: "field field" "dd btn";

    &__field {
      margin-bottom: 5px;
    }
  }
}
</style>
