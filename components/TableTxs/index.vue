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
        v-if="isOnly"
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
          :to="'/address/'+el.item.fromAddress"
        >
          {{ formatItem(el.item.fromAddress, 9, 6) }}
        </nuxt-link>
      </template>

      <template #cell(toAddress)="el">
        <nuxt-link
          v-if="el.item.toAddress"
          class="table__link"
          :to="'/address/'+el.item.toAddress"
        >
          {{ formatItem(el.item.toAddress, 9, 6) }}
        </nuxt-link>
      </template>
      <template #cell(value)="el">
        <span>{{ cutValueData(el.item.value) }} WUSD</span>
      </template>
      <template #cell(transaction_fee)="el">
        <span class="table__grey">{{ formatItem(el.item.gasUsed, 9, 6) }}</span>
      </template>
      <template #cell(token)="el">
        <nuxt-link
          class="table__link"
          :to="`/tokens/${el.item.token}`"
        >
          {{ formatItem(el.item.token, 10, 6) }}
        </nuxt-link>
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
    isOnly: {
      type: Boolean,
      default: true,
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

</style>
