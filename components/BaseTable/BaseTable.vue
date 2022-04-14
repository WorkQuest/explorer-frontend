<template>
  <div class="table-wrapper">
    <div
      v-if="tableBusy"
      class="skeleton-table"
    >
      <div
        v-if="title"
        class="table__titles"
      >
        <span class="table__title">{{ title }}</span>
      </div>
      <b-skeleton-table
        :rows="skeleton.rows"
        :columns="skeleton.columns"
        :hide-header="false"
        :show-footer="false"
        class="skeleton-table"
        :table-props="{ bordered: false, striped: false, outlined: false, small: false }"
      />
    </div>
    <b-table
      v-else
      :items="items"
      :fields="fields"
      borderless
      thead-class="table__header"
      tbody-tr-class="table__row"
      caption-top
      sort-icon-right
      responsive="xl"
      show-empty
      stacked="md"
    >
      <template
        v-if="!tableBusy"
        #empty
      >
        <empty-data :description="emptyDescription" />
      </template>

      <template
        v-if="$props.title || $slots['table-caption']"
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

      <template #cell(age)="el">
        <span>{{ el.value }}</span>
      </template>

      <template #cell(address)="el">
        <nuxt-link
          class="table__link"
          :to="`/address/${el.value}`"
        >
          {{ el.value }}
        </nuxt-link>
      </template>

      <template #cell(amount)="el">
        {{ el.value }}
      </template>

      <template #cell(block.timestamp)="el">
        <span>{{ formatDataFromNow(el.item.block.timestamp) }}</span>
      </template>

      <template #cell(blockNumber)="el">
        <nuxt-link
          class="table__link"
          :to="`/blocks/${el.value}`"
        >
          {{ el.value }}
        </nuxt-link>
      </template>

      <template #cell(addressFrom)="el">
        <nuxt-link
          v-if="el.value"
          class="table__link"
          :to="`/address/${el.value}`"
        >
          {{ formatItem(el.value, 9, 6) }}
        </nuxt-link>
      </template>

      <template #cell(addressTo)="el">
        <nuxt-link
          v-if="el.value"
          class="table__link"
          :to="`/address/${el.value}`"
        >
          {{ formatItem(el.value, 9, 6) }}
        </nuxt-link>
      </template>

      <template #cell(gasUsed)="el">
        <template v-if="Array.isArray(el.value)">
          <span
            v-for="(item, key) in el.value"
            :key="`gasUsed-${key}`"
            :class="item.class"
          >
            {{ item.value }}
          </span>
        </template>
        <template v-else>
          {{ el.value }}
        </template>
      </template>

      <template #cell(gasLimit)="el">
        {{ el.value }}
      </template>

      <template #cell(hash)="el">
        <span
          v-if="el.item.status === 0"
          class="icon-error icon-error_outline"
        />
        <nuxt-link
          class="table__link"
          :to="`/tx/${el.value}`"
        >
          {{ formatItem(el.value, 9, 6) }}
        </nuxt-link>
      </template>

      <template #cell(holders)="el">
        {{ el.value }}
      </template>

      <template #cell(index)="el">
        {{ el.value + el.index }}
      </template>

      <template #cell(method)="el">
        {{ el.value }}
      </template>

      <template #cell(percentage)="el">
        {{ el.value }} %
      </template>

      <template #cell(token)="el">
        <div class="token-item__header">
          <img
            v-if="type === 'tokens'"
            :src="require(`~/assets/img/tokens/empty-token.svg`)"
            width="15"
            height="15"
            class="token-item__image"
            :alt="el.item.symbol"
          >
          <nuxt-link
            class="token-item__title table__link"
            :to="`/tokens/${el.value.link}`"
          >
            <span class="table__token token token-item__name"> {{ el.value.name }}</span>
            <span class="table__token token token-item__symbol"> ({{ el.value.symbol }}) </span>
          </nuxt-link>
        </div>
        <p class="token-item__description">
          {{ el.item.description }}
        </p>
      </template>

      <template #cell(transactionsCount)="el">
        <template v-if="el.item.number">
          <nuxt-link
            class="table__link"
            :to="{ path: '/tx', query: { block: el.item.number }}"
          >
            {{ el.item.transactionsCount }}
          </nuxt-link>
        </template>
        <template v-else>
          {{ el.value }}
        </template>
      </template>

      <template #cell(value)="el">
        <span> {{ el.value }} </span>
      </template>

      <template #cell(volume)="el">
        <span> {{ el.value }} </span>
      </template>
    </b-table>
  </div>
</template>

<script>

export default {
  name: 'BaseTable',
  props: {
    title: {
      type: String,
      default: '',
    },
    type: {
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
    tableBusy: {
      type: Boolean,
      default: false,
    },
    skeleton: {
      type: Object,
      default: () => ({ rows: 5, columns: 5 }),
    },
  },
  computed: {
    emptyDescription() {
      if (this.type === 'transfers') {
        return this.$t('ui.token.noTransfers');
      }
      if (this.type === 'holders') {
        return this.$t('ui.token.noHolders');
      }
      if (this.type === 'blocks') {
        return this.$t('ui.block.noBlocks');
      }
      if (this.type === 'transactions') {
        return this.$t('ui.tx.noTxs');
      }
      return this.$t('ui.noData');
    },
  },
};
</script>

<style scoped lang="scss">
.grey {
  color: $black400;
}
.icon-error {
  color: $red;
}
</style>