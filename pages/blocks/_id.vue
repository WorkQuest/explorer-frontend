<template>
  <div class="block">
    <search-filter class="block__search" />
    <base-field
      v-model="search"
      class="block__search_mobile"
      :is-search="true"
      :is-hide-error="true"
      :placeholder="$t('ui.forms.searchPlaceholder')"
    />
    <div class="block__content">
      <nuxt-link
        to="/blocks"
        class="block__back"
      >
        <span class="icon-short_left" />
        {{ $t('ui.back') }}
      </nuxt-link>
      <h3 class="block__title">
        {{ $t('ui.block.blockInfo') }}
      </h3>
      <div class="block__info">
        <div class="block__number-field">
          <span
            class="icon-caret_left"
            @click="turnLeft"
          />
          <span class="block__block">{{ $t('ui.block.block') }}</span>
          <span class="block__number">#{{ block.id }}</span>
          <span
            class="icon-caret_right"
            @click="turnRight"
          />
        </div>
        <div class="block__columns">
          <Item
            :title="$t('ui.timestamp')"
            info="16 secs ago"
            :note="block.timestamp"
          />
          <Item
            :title="$t('ui.txs')"
            :info="block.txsCount"
            :note="$t('ui.block.inThisBlock')"
            item="transaction"
          />
          <Item
            :title="$t('ui.block.reward')"
            info="0.316538333801617818 MATIC"
          />
          <Item
            :title="$t('ui.block.gasUsed')"
            :info="block.gasUsed"
          />
          <Item
            :title="$t('ui.block.gasLimit')"
            :info="block.gasLimit"
          />
          <Item
            :title="$t('ui.block.size')"
            :info="block.size"
          />
          <Item
            :title="$t('ui.block.hash')"
            :info="block.hash"
          />
        </div>
        <div class="block__columns_mobile columns">
          <div class="columns__time">
            <span class="columns__timestamp">
              16 sec ago
            </span>
            <div class="columns__subtitle">
              {{ $t('ui.timestamp') }}
            </div>
            <span class="columns__info">
              {{ block.timestamp }}
            </span>
          </div>
          <p class="columns__subtitle">
            {{ $t('ui.block.reward') }}
          </p>
          <p class="columns__info">
            0.316538333801617818 MATIC
          </p>
          <p class="columns__subtitle">
            {{ $t('ui.txs') }}
          </p>
          <nuxt-link
            class="columns__link_small"
            :to="{ path: '/transactions', query: { block: block.id }}"
          >
            {{ block.txsCount }} txns
          </nuxt-link>
          <p class="columns__info_grey">
            {{ $t('ui.block.inThisBlock') }}
          </p>
          <p class="columns__subtitle">
            {{ $t('ui.block.gasUsed') }}
            <span class="columns__info">
              {{ block.gasUsed }} (99,5%)
            </span>
          </p>
          <p class="columns__subtitle">
            {{ $t('ui.block.gasLimit') }}
            <span class="columns__info">
              {{ block.gasLimit }}
            </span>
          </p>
          <p class="columns__subtitle">
            {{ $t('ui.block.size') }}
            <span class="columns__info">
              {{ block.size }} {{ $t('ui.block.bytes') }}
            </span>
          </p>
          <p class="columns__subtitle">
            {{ $t('ui.block.hash') }}
          </p>
          <p class="columns__info">
            {{ block.hash }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Item from '~/components/InfoItem.vue';

export default {
  name: 'Block',
  components: {
    Item,
  },
  data() {
    return {
      blocks: {},
      block: {},
      search: '',
    };
  },
  computed: {
  },
  async mounted() {
    this.SetLoader(true);
    const blocksRes = await this.$axios.get('/v1/blocks');
    // eslint-disable-next-line prefer-destructuring
    this.blocks = blocksRes.data.result.blocks;
    // eslint-disable-next-line prefer-destructuring
    this.block = this.blocks[0];
    this.SetLoader(false);
  },
  methods: {
    turnLeft() {
      // eslint-disable-next-line prefer-destructuring
      this.block = this.blocks[0];
    },
    turnRight() {
      // eslint-disable-next-line prefer-destructuring
      this.block = this.blocks[1];
    },
  },
};
</script>
<style lang="scss" scoped>
.block {
    @include container;
    &__search {
        margin: 25px 0;
        &_mobile {
        display: none;
      }
    }
    &__back {
        @include text-simple;
        @include normal-font-size;
        text-decoration: none;
        font-size: 18px;
        color: $black600;
        cursor: pointer;
        &:hover {
          text-decoration: none;
        }
    }
    &__title {
        @include text-simple;
        font-weight: 600;
        font-size: 28px;
        line-height: 36px;
        margin: 15px 0 10px 0;
    }
    &__info {
        padding: 25px 20px 20px 20px;
        background: $white;
        border-radius: 6px;
        word-wrap: break-word;
    }
    &__block {
        @include text-simple;
        margin-left: 10px;
    }
    &__number {
        @include text-simple;
        color: $black400;
        margin-right: 10px;
    }
    &__columns {
        display: grid;
        grid-template-columns: 367px 367px 367px;
        grid-gap: 23px;
        margin-top: 25px;
        &:last-child {
          grid-column-start: 1;
          grid-column-end: 2;
        }
    }
}
.icon-short_left {
    font-size: 18px;
    color: $black600;
}
.icon-caret_left, .icon-caret_right {
    font-size: 16px;
    color: $black600;
    padding: 7px;
    border: 1px solid $black0;
    border-radius: 6px;
    cursor: pointer;
}
.columns {
  display: none;
}

@include _991 {
  .block {
    &__columns {
      grid-template-columns: 220px 220px 220px;
    }
  }
}
@include _767 {
  .block {
    &__search {
      display: none;
      &_mobile {
        display: block;
        background: $white;
        border-radius: 6px;
        padding: 10px 14px;
        margin: 25px 16px;
      }
    }
    &__columns {
      display: none;
    }
    &__number {
      color: $blue;
    }
    &__back, &__title {
      margin-left: 20px;
    }
  }
  .columns {
    padding: 20px 0;
    display: block;
    &__separator {
        border: none;
    }
    &__number {
      font-weight: 600;
      font-size: 14px;
      color: $black300;
    }
    &__link {
      @include link;
      font-size: 20px;
      font-weight: normal;
    }
    &__timestamp {
      font-weight: normal;
      font-size: 14px;
      color: $black400;
      float: right;
    }
    &__subtitle {
      font-weight: 600;
      grid-column: 1/2;
      margin-top: 11px;
    }
    &__link_small {
      @include text-simple;
      @include normal-font-size;
      @include link;
    }
    &__info {
      font-weight: normal;
      &_grey {
        color: $black400;
        padding-bottom: 15px;
        border-bottom: 1px solid $black100;
      }
    }
  }
}
</style>
