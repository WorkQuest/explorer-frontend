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
    >
      <template #table-busy>
        <div class="text-center text-danger my-2">
          <strong>Loading...</strong>
        </div>
      </template>
      <template
        #table-caption
      >
        <div class="table__titles">
          <span class="table__title">{{ $props.title }}</span>
          <nuxt-link
            class="table__link"
            :to="`${type}`"
          >
            {{ headerlink }}
          </nuxt-link>
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
      <template #cell(timestamp)="el">
        <span>{{ formatDataFromNow(el.item.timestamp) }}</span>
      </template>
      <!-- blocks -->
      <template #cell(reward)="el">
        <span>{{ el.item.size }} {{ el.item.symbol }}</span>
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
      <template #cell(fromAddress)="el">
        <nuxt-link
          class="table__link"
          :to="`/address/${el.item.fromAddress}`"
        >
          {{ formatItem(el.item.fromAddress, 9, 6) }}
        </nuxt-link>
      </template>
      <template #cell(toAddress)="el">
        <nuxt-link
          class="table__link"
          :to="`/address/${el.item.toAddress}`"
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
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
    }),
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
    @include link;
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
    height: 27px;
    color: $blue;
    word-break: break-word;
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
