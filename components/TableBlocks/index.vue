<template>
  <div class="table">
    <b-table
      :items="items"
      :fields="fields"
      borderless
      thead-class="table__header"
      caption-top
      sort-icon-right
      :responsive="true"
      tbody-tr-class="table__row"
      :busy="isLoading"
      :empty-text="$t('ui.block.noBlocks')"
      show-empty
      stacked="md"
    >
      <template #table-busy>
        <div class="text-center">
          <strong>{{ $t('ui.loading') }}</strong>
        </div>
      </template>
      <template
        v-if="$props.title || $scopedSlots['table-caption']"
        #table-caption
      >
        <slot name="table-caption" />
        <div
          v-if="title"
          class="table__titles"
        >
          <span class="table__title">{{ $props.title }}</span>
        </div>
      </template>
      <template #cell(number)="el">
        <nuxt-link
          class="table__link"
          :to="`blocks/${el.item.number}`"
        >
          {{ el.item.number }}
        </nuxt-link>
      </template>
      <template #cell(timestamp)="el">
        <span>{{ formatDataFromNow(el.item.timestamp) }}</span>
      </template>
      <template #cell(reward)="el">
        <span>{{ +el.item.base_fee_per_gas * +el.item.gas_used }} {{ symbol }}</span>
      </template>
      <template #cell(transactionsCount)="el">
        <nuxt-link
          class="table__link"
          :class="el.item.transactionsCount === 0 ? 'table__link_disabled' : ''"
          :to="{ path: '/tx', query: { block: el.item.number }}"
        >
          {{ el.item.transactionsCount }}
        </nuxt-link>
      </template>
      <template #cell(gas_used)="el">
        <span>{{ el.item.gas_used }} </span>
      </template>
      <template #cell(reward)="el">
        <span>{{ +el.item.base_fee_per_gas * +el.item.gas_used }} {{ symbol }}</span>
      </template>
      <template #empty>
        <empty-data :description="$tc('ui.block.noBlocks')" />
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

/** @param {array} items[] */
/** @param {Object} item */
/** @param {string} item.gas_used  */
/** @param {number} item.block_number  */
/** @param {string} item.base_fee_per_gas  */
/** @param {string} item.transactionsCount  */
/** @param {{ hex: string, bech32: string }=} [item.to_address_hash]  */
/** @param {{ hex: string, bech32: string }} item.from_address_hash  */

export default {
  name: 'TableBlocks',
  props: {
    title: {
      type: String,
      default: '',
    },
    type: {
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
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      symbol: 'tokens/getWUSDTokenSymbol',
    }),
  },
};
</script>
