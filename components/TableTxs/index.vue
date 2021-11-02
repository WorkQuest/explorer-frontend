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
      <template #cell(id)="el">
        <nuxt-link
          class="table__link"
          :to="`/transactions/${el.item.id}`"
        >
          {{ formatItem(el.item.id, 9, 6) }}
        </nuxt-link>
      </template>
      <template #cell(timestamp)="el">
        <span>{{ el.item.timestamp }}</span>
      </template>

      <template #cell(blockNumber)="el">
        <nuxt-link
          class="table__link"
          :to="`/blocks/${el.item.blockNumber}`"
        >
          {{ el.item.blockNumber }}
        </nuxt-link>
      </template>
      <template #cell(gasUsed)="el">
        <span>{{ el.item.gasUsed }} </span>
      </template>
      <template #cell(fromAddress)="el">
        <nuxt-link
          class="table__link"
          to="'/account/+el.item.fromAddress'"
        >
          {{ formatItem(el.item.fromAddress, 9, 6) }}
        </nuxt-link>
      </template>

      <template #cell(toAddress)="el">
        <nuxt-link
          v-if="el.item.toAddress"
          class="table__link"
          to="'/account/+el.item.fromAddress'"
        >
          {{ formatItem(el.item.toAddress, 9, 6) }}
        </nuxt-link>
      </template>
      <!-- <template #cell(status)="el">
        <span
          v-if="el.item.status === 'Success'"
          class="table__success"
        >{{ el.item.status }}</span>
        <span
          v-else
          class="table__failed"
        >{{ el.item.status }}</span>
      </template> -->
      <template #cell(value)="el">
        <span>{{ cutValueData(el.item.value) }} WUSD</span>
      </template>
      <template #cell(transaction_fee)="el">
        <span class="table__grey">{{ formatItem(el.item.gasUsed, 9, 6) }}</span>
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
    headerlink: {
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
    //thead, tbody tr {
    //  display:table;
    //  width: 920px;
    //  min-width: 710px;
    //  table-layout:fixed;
    //}
    //thead {
    //  width: calc( 940px - 1em );
    //  min-width: calc( 710px - 1em );
    //}
  }
  @include _767 {
    //thead, tbody tr {
    //  display:table;
    //  width: 700px;
    //  min-width: 540px;
    //  table-layout:fixed;
    //}
    //thead {
    //  width: calc( 700px - 1em );
    //  min-width: calc( 540px - 1em );
    //}
  }
}
</style>
