<template>
  <div class="table">
    <b-table
      :items="items"
      :fields="fields"
      borderless
      thead-class="table__header"
      caption-top
      sort-icon-left
      :responsive="true"
      tbody-tr-class="table__row"
    >
      <template
        #table-caption
      >
        <div class="table__titles">
          <span class="table__title">{{ $props.title }}</span>
        </div>
      </template>
      <template #cell(number)="el">
        <p>
          {{ el.item.number }}
        </p>
      </template>
      <template #cell(token)="el">
        <span>{{ el.item.token }}</span>
      </template>

      <template #cell(volume)="el">
        <p>
          {{ el.item.volume }}
        </p>
      </template>
      <template #cell(holders)="el">
        <span>{{ el.item.holders }} </span>
      </template>
    </b-table>
  </div>
</template>

<script>
import BigNumber from 'bignumber.js';

export default {
  props: {
    title: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
    fields: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
  },
  methods: {
    cutValueData(value) {
      return new BigNumber(value).shiftedBy(-18).toString();
    },
  },
};
</script>

<style lang="scss">
.table {
  overflow-x: hidden;
  font-size: 16px;
  line-height: 130%;
  background: #FFFFFF;
  border-radius: 6px;
  &__titles {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0 30px 0 20px;
  }
  &__title {
    margin: 10px;
    color: $black800;
  }
  &__link {
    text-decoration: none;
    color: $blue;
    &:hover {
      text-decoration: none;
      color: $blue;
    }
  }
  &__success {
    color: $green;
  }
  &__failed {
    color: $red;
  }
  &__grey {
    color: $black500;
    font-size: 14px;
  }
  &__blue {
    color: $blue;
  }
  &__header {
    @include text-simple;
    background: rgba(0, 131, 199, 0.1);
    height: 27px;
    line-height: 17px;
    color: $blue;
    font-style: normal;
    font-size: 12px;
    word-break: break-word;
  }
  &__row {
    line-height: 40px;
  }
  @include _991 {
    .table {
      &__row {
        font-size: 12px;
      }
      &__header {
        font-size: 10px;
      }
    }
  }
  @include _767 {
  }
}
</style>
