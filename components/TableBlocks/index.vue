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
          :to="`blocks/${el.item.id}`"
        >
          {{ el.item.id }}
        </nuxt-link>
      </template>
      <template #cell(timestamp)="el">
        <span>{{ el.item.timestamp }}</span>
      </template>
      <template #cell(reward)="el">
        <span>{{ el.item.reward }} {{ el.item.symbol }}</span>
      </template>
      <template #cell(txsCount)="el">
        <nuxt-link
          class="table__link"
          :to="'/account/+el.item.fromAddress'"
        >
          {{ el.item.txsCount }} txns
        </nuxt-link>
      </template>
      <template #cell(gasUsed)="el">
        <span>{{ el.item.gasUsed }} </span>
        <span class="table__grey">95,5%</span>
      </template>
      <!-- transaction -->
      <!-- <template #cell(hash)="el">
        <nuxt-link
          class="table__link"
          :to="`#${el.item.hash}`"
        >
          {{ formatItem(el.item.hash, 9, 6) }}
        </nuxt-link>
        <span class="table__grey">{{ el.item.timestamp }}</span>
      </template>
      <template #cell(fromAddress)="el">
        <nuxt-link
          class="table__link"
          :to="'/account/+el.item.fromAddress'"
        >
          {{ formatItem(el.item.fromAddress, 9, 6) }}
        </nuxt-link>
      </template>
      <template #cell(toAddress)="el">
        <nuxt-link
          class="table__link"
          :to="'/account/+el.item.fromAddress'"
        >
          {{ formatItem(el.item.toAddress, 9, 6) }}
        </nuxt-link>
      </template>
      <template #cell(value)="el">
        <span>{{ el.item.value }} {{ el.item.symbol }}</span>
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
      </template> -->

      <!-- <template #cell(block)="el">
        <a :href="`#${el.item.block}`">{{ el.item.block }}</a>
      </template> -->
      <!-- <template #cell(transaction_fee)="el">
        <span class="table__grey">{{ formatItem(el.item.transaction_fee, 9, 6) }}</span>
      </template> -->
    </b-table>
  </div>
</template>

<script>
// export function formatTxHash(hash) {
//   return `${hash.slice(0, 5)}...${hash.slice(hash.length - 6, hash.length)}`;
// }
// export function formatAddress(address) {
//   return `${address.substring(0, 5)}...${address.substring(address.length - 6, address.length)}`;
// }
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
  },
  methods: {
  },
};
</script>

<style lang="scss">

</style>
