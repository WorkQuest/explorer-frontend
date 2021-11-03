<template>
  <div class="block">
    <search-filter class="block__search" />
    <div class="block__content">
      <div class="block__back">
        <span class="icon-short_left" />
        {{ $t('ui.back') }}
      </div>
      <h3 class="block__title">
        {{ $t('ui.block.blockInfo') }}
      </h3>
      <div class="block__info">
        <div class="block__number-field">
          <span class="icon-caret_left" />
          <span class="block__block">{{ $t('ui.block.block') }}</span>
          <span class="block__number">#{{ block.id }}</span>
          <span class="icon-caret_right" />
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
  data: () => ({
    block: {},
  }),
  computed: {
  },
  async mounted() {
    this.SetLoader(true);
    const blocksRes = await this.$axios.get('/v1/blocks');
    // eslint-disable-next-line prefer-destructuring
    this.block = blocksRes.data.result.blocks[0];
    this.SetLoader(false);
  },
};
</script>
<style lang="scss" scoped>
.block {
    @include container;
    &__search {
        margin: 30px 0;
    }
    &__back {
        @include text-simple;
        @include normal-font-size;
        font-size: 18px;
        color: $black600;
        cursor: pointer;
    }
    &__title {
        @include text-simple;
        font-weight: 600;
        font-size: 28px;
        line-height: 36px;
        margin: 15px 0 10px 0;
    }
    &__info {
        padding: 25px 0 20px 20px;
        background: $white;
        border-radius: 6px;
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
</style>
