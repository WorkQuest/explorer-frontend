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
      show-empty
    >
      <template #table-busy>
        <div class="text-center">
          <strong>{{ $t('ui.loading') }}</strong>
        </div>
      </template>
      <template
        #table-caption
      >
        <div class="table__titles">
          <span class="table__title">{{ $props.title }}</span>
          <base-btn
            class="table__link"
            @click="toPage()"
          >
            {{ headerlink }}
          </base-btn>
        </div>
      </template>
      <!-- common -->
      <template #cell(id)="el">
        <nuxt-link
          class="table__link"
          :to="`/blocks/${el.item.id}`"
        >
          {{ el.item.id }}
        </nuxt-link>
      </template>
      <template #cell(number)="el">
        <nuxt-link
          class="table__link"
          :to="`/blocks/${el.item.number}`"
        >
          {{ el.item.number }}
        </nuxt-link>
      </template>
      <template #cell(timestamp)="el">
        <span>{{ formatDataFromNow(el.item.timestamp) }}</span>
      </template>
      <!-- blocks -->
      <template #cell(reward)="el">
        <span>{{ +el.item.base_fee_per_gas * +el.item.gas_used }} {{ symbol }}</span>
      </template>
      <template #cell(transactions)="el">
        <nuxt-link
          class="table__link"
          :class="el.item.transactions.length === 0 ? 'table__link_disabled' : ''"
          :to="{ path: '/transactions', query: { block: el.item.number }}"
        >
          {{ Array.isArray(el.item.transactions) ? el.item.transactions.length : '' }} txns
        </nuxt-link>
      </template>
      <template #cell(gas_used)="el">
        <span>{{ el.item.gas_used }} </span>
        <span class="table__grey">{{ `(${((el.item.gas_used / el.item.gas_limit) * 100).toFixed(2)}%)` }}</span>
      </template>
      <!-- transaction -->
      <template #cell(hash)="el">
        <nuxt-link
          class="table__link"
          :to="`/transactions/${el.item.hash}`"
        >
          {{ formatItem(el.item.hash, 9, 6) }}
        </nuxt-link>
        <span
          v-if="el.item.timestamp"
          class="table__grey"
        >{{ formatDataFromNow(el.item.timestamp) }}</span>
      </template>
      <template #cell(from_address_hash.hex)="el">
        <nuxt-link
          class="table__link"
          :to="`/address/${el.item.from_address_hash.hex}`"
        >
          {{ formatItem(el.item.from_address_hash.hex, 9, 6) }}
        </nuxt-link>
      </template>
      <template #cell(to_address_hash.hex)="el">
        <nuxt-link
          v-if="el.item.to_address_hash"
          class="table__link"
          :to="`/address/${el.item.to_address_hash.hex}`"
        >
          {{ formatItem(el.item.to_address_hash.hex, 9, 6) }}
        </nuxt-link>
      </template>
      <template #cell(value)="el">
        <span>{{ Floor(cutValueData(el.item.value)) }} {{ symbol }}</span>
      </template>
      <template #cell(status)="el">
        <span
          v-if="el.item.status === 'Success'"
          class="table__success"
        >{{ el.item.status }}</span>
        <span
          v-else
          class="table__failed"
        >{{ el.item.status }}</span>
      </template>
      <template #empty>
        <empty-data />
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
/** @param {array} item.transactions  */
/** @param {{ hex: string, bech32: string }=} [item.to_address_hash]  */
/** @param {{ hex: string, bech32: string }} item.from_address_hash  */

export default {
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
      decimals: 'tokens/getWUSDTokenDecimals',
    }),
  },
  methods: {
    async toPage() {
      await this.$router.push('/');
      if (this.type) await this.$router.push(`/${this.type}`);
    },
    cutValueData(value) {
      return new BigNumber(value).shiftedBy(-this.decimals).toString();
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
    color: $blue !important;
    border: none !important;
    background: $white !important;
    width: 200px !important;

    &:hover {
      color: $blue;
    }

    &_disabled {
      pointer-events: none;
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
    @include normal-font-size;
    background: rgba(0, 131, 199, 0.1);
    font-weight: 500;
    height: 27px;
    color: $blue;
    word-break: break-word;
    & > tr > th {
      font-weight: 500;
    }
  }
}

@include _991 {
  .table {
    &__header, &__row {
      font-size: 10px;
    }

    &__link {
      font-size: 12px;
    }

    &__grey {
      font-size: 10px;
    }
  }
}
</style>
