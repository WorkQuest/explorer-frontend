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
        <span>{{ formatDataFromNow(el.item.timestamp) }}</span>
      </template>
      <template #cell(reward)="el">
        <span>{{ el.item.reward }} {{ el.item.symbol }}</span>
      </template>
      <template #cell(txsCount)="el">
        <nuxt-link
          class="table__link"
          :to="{ path: '/transactions', query: { block: 13542487 }}"
        >
          {{ el.item.txsCount }} txns
        </nuxt-link>
      </template>
      <template #cell(gasUsed)="el">
        <span>{{ el.item.gasUsed }} </span>
        <span class="table__grey">95,5%</span>
      </template>
    </b-table>
  </div>
</template>

<script>
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
