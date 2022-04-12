<template>
  <div class="paginator">
    <div class="paginator__item">
      <button
        class="paginator__link"
        :class="{'paginator__link_disabled': value === 1}"
        :disabled="value === 1"
        :title="$tc('paginator.toFirstPage')"
        @click="firstPage()"
      >
        <span class="paginator__icon icon-fast_rewind" />
      </button>
    </div>
    <div class="paginator__item">
      <button
        class="paginator__link paginator__link_inverted"
        :class="{'paginator__link_disabled': value === 1}"
        :disabled="value === 1"
        :title="$tc('paginator.toPreviousPage')"
        @click="prevPage()"
      >
        <span class="paginator__icon icon-play_arrow" />
      </button>
    </div>
    <div class="paginator__item">
      <input
        v-model="input"
        class="paginator__input"
        :placeholder="`${$tc('paginator.page')} ${value} ${$tc('paginator.of')} ${totalPages}`"
        type="number"
        step="1"
        min="1"
        :title="`${$tc('paginator.page')} ${value} ${$tc('paginator.of')} ${totalPages}`"
        :max="totalPages"
        @keyup.enter="setPage(input)"
        @focusout="setPage(input)"
      >
    </div>
    <div class="paginator__item">
      <button
        class="paginator__link"
        :class="{'paginator__link_disabled': value === totalPages}"
        :disabled="value === totalPages"
        :title="$tc('paginator.toNextPage')"
        @click="nextPage()"
      >
        <span class="paginator__icon icon-play_arrow" />
      </button>
    </div>
    <div class="paginator__item">
      <button
        class="paginator__link"
        :class="{'paginator__link_disabled': value === totalPages}"
        :disabled="value === totalPages"
        :title="$tc('paginator.toLastPage')"
        @click="lastPage()"
      >
        <span class="paginator__icon icon-fast_forward" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Paginator',
  props: {
    totalPages: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      input: '',
    };
  },
  methods: {
    setPage(value) {
      if (+value > 0 && this.value !== +value && +value <= this.totalPages) {
        this.$emit('input', Math.ceil(+value));
        this.input = '';
      } else {
        this.input = '';
      }
    },
    firstPage() {
      if (this.value !== 1) {
        this.setPage(1);
      }
    },
    prevPage() {
      if (this.value > 1) {
        this.setPage(this.value - 1);
      }
    },
    nextPage() {
      if (this.value < this.totalPages) {
        this.setPage(this.value + 1);
      }
    },
    lastPage() {
      if (this.value !== this.totalPages) {
        this.setPage(this.totalPages);
      }
    },
  },
};
</script>

<style scoped lang="scss">
.paginator {
  display: flex;
  align-items: center;
  border-radius: 6px;
  justify-content: flex-end;
  &__item {
    margin-left: 2px;
    margin-right: 2px;
    background-color: $white;
    padding: 5px 10px;
    border-radius: 6px;
    &:first-child {
      margin-left: 0;
    }
  }
  &__icon {
    color: $blue;
  }
  &__link {
    &_disabled {
      pointer-events: none;
      & > span {
        color: $black200;
      }
    }
    &_inverted > span:before {
      display: inline-block;
      transform: scale(-1);
    }
  }
  &__input {
    padding: 0 10px;
    border-width: 0;
    background-color: transparent;
    width: auto;
    min-width: 170px;
    text-align: center;
    &:focus::placeholder {
      color: transparent;
    }
    &::placeholder {
      font-size: 13px;
    }
  }
}
</style>
