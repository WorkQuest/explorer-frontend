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
      :empty-text="$t('ui.tx.noTxs')"
      show-empty
    >
      <template #table-busy>
        <div class="text-center">
          <strong>{{ $t('ui.loading') }}</strong>
        </div>
      </template>

      <template
        v-if="isOnly"
        #table-caption
      >
        <div class="table__titles">
          <span class="table__title">{{ $props.title }}</span>
        </div>
      </template>

      <template #cell(hash)="el">
        <nuxt-link
          class="table__link"
          :to="`/transactions/${el.item.hash || el.item.transaction_hash}`"
        >
          {{ formatItem(el.item.hash || el.item.transaction_hash, 9, 6) }}
        </nuxt-link>
      </template>

      <template #cell(method)="">
        <span> {{ $t('ui.token.transfer') }} </span>
      </template>

      <template #cell(timestamp)="el">
        <span>{{ formatDataFromNow(el.item.timestamp) }}</span>
      </template>

      <template #cell(age)="el">
        <span v-if="el.item.block && el.item.block.timestamp">{{ formatDataFromNow(el.item.block.timestamp) }}</span>
      </template>

      <template #cell(block_number)="el">
        <nuxt-link
          class="table__link"
          :to="`/blocks/${el.item.block_number}`"
        >
          {{ el.item.block_number }}
        </nuxt-link>
      </template>

      <template #cell(gas_used)="el">
        <span>{{ el.item.gas_used }} </span>
      </template>

      <template #cell(from_address_hash.hex)="el">
        <nuxt-link
          class="table__link"
          :to="'/address/'+el.item.from_address_hash.hex"
        >
          {{ formatItem(el.item.from_address_hash.hex, 9, 6) }}
        </nuxt-link>
      </template>

      <template #cell(to_address_hash.hex)="el">
        <nuxt-link
          v-if="el.item.to_address_hash"
          class="table__link"
          :to="'/address/'+el.item.to_address_hash.hex"
        >
          {{ formatItem(el.item.to_address_hash.hex, 9, 6) }}
        </nuxt-link>
      </template>

      <template #cell(value)="el">
        <span>{{ Floor(cutValueData(el.item.value)) }} {{ symbol }}</span>
      </template>

      <template #cell(amount)="el">
        <span>{{ Floor(cutValueData(el.item.amount)) }} {{ symbol }}</span>
      </template>

      <template #cell(gas_used)="el">
        <span class="table__grey">{{ el.item.gas_used }}</span>
      </template>

      <template #cell(token)="el">
        <nuxt-link
          class="table__link"
          :to="{ path: `tokens/`+el.item.token, params: { token: el.item.token }}"
        >
          {{ formatItem(tokens[`${el.item.token}`].name, 10, 0) }} ({{ el.item.token }})
        </nuxt-link>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';

/** @param {array} items[] */
/** @param {Object} item */
/** @param {string} item.gas_used  */
/** @param {number} item.block_number  */
/** @param {{ hex: string, bech32: string }=} [item.to_address_hash]  */
/** @param {{ hex: string, bech32: string }} item.from_address_hash  */

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
    tokens: {
      type: Object,
      default: () => {
      },
    },
  },
  computed: {
    ...mapGetters({
      isLoading: 'main/getIsLoading',
      nativeSymbol: 'tokens/getWUSDTokenSymbol',
      nativeDecimals: 'tokens/getWUSDTokenDecimals',
      token: 'tokens/getCurrentToken',
    }),
    isToken() {
      return Object.keys(this.token).length > 0;
    },
    symbol() {
      return this.isToken ? this.token.symbol : this.nativeSymbol;
    },
    decimals() {
      return this.isToken ? this.token.decimals : this.nativeDecimals;
    },
  },
  methods: {
    cutValueData(value) {
      return new BigNumber(value).shiftedBy(-this.decimals).toString();
    },
  },
};
</script>
