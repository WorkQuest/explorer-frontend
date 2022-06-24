<template>
  <div class="block">
    <button
      class="block__back"
      @click="back()"
    >
      <span class="icon-short_left" />
      {{ $t('ui.back') }}
    </button>
    <h3 class="block__title">
      {{ $t('ui.block.blockInfo') }}
    </h3>
    <div class="block__info">
      <div class="block__number-field">
        <button
          :disabled="isBlockLoading"
          type="button"
          @click="changeBlock(previousBlockNumber ? +previousBlockNumber : 0)"
        >
          <span class="icon-caret_left" />
        </button>
        <span class="block__block">{{ $t('ui.block.block') }}</span>
        <span
          v-if="isBlockLoading"
          class="block__number"
        >
          #<b-skeleton />
        </span>
        <span
          v-else-if="currentBlockNumber"
          class="block__number"
        >#{{ currentBlockNumber }}</span>
        <button
          type="button"
          :disabled="isBlockLoading"
          @click="changeBlock(nextBlockNumber ? +nextBlockNumber : 0)"
        >
          <span class="icon-caret_right" />
        </button>
      </div>
      <div class="block__columns">
        <template v-if="isBlockLoading">
          <info-item
            v-for="(item, i) in blockColumns"
            :key="`block-item-loader-${i}`"
            :title="item.title"
            :is-info-loading="true"
          />
        </template>
        <template v-else>
          <info-item
            v-for="(item, i) in blockColumns"
            :key="`block-item-${i}`"
            :title.sync="item.title"
            :info.sync="item.info"
            :note.sync="item.note"
            :item.sync="item.item"
            :is-block-loading="isBlockLoading"
          >
            <template
              v-if="item.item === 'timestamp'"
              #timestamp
            >
              {{ dateFromNow }}
            </template>
          </info-item>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Block',
  data() {
    return {
      search: '',
      limit: 10,
      offset: 0,
      index: 0,
      timer: null,
      time: Date.now(),
      minute: 60000,
      isBlockLoading: true,
    };
  },
  computed: {
    ...mapGetters({
      currentBlock: 'blocks/getCurrentBlock',
      symbol: 'tokens/getWQTTokenSymbol',
      decimals: 'tokens/getWQTTokenDecimals',
    }),
    blockColumns() {
      const gasUsedValue = this.currentBlock?.gas_used || 0;
      const gasLimitValue = this.currentBlock?.gas_limit || 1;
      const gasUsed = `${gasUsedValue} (${(gasUsedValue / gasLimitValue) * 100}%)`;
      return [
        {
          title: this.$t('ui.timestamp'),
          info: this.dateFromNow,
          note: `(${this.$moment(this.currentBlock.timestamp)
            .format('MMM-DD-YYYY HH:mm:ss A +UTC')})`,
          item: 'timestamp',
        },
        {
          title: this.$t('ui.txs'),
          info: this.currentBlock.transactionsCount,
          note: this.$t('ui.block.inThisBlock'),
          item: 'transactionsCount',
        },
        {
          title: this.$t('ui.block.gasUsed'),
          info: gasUsed,
        },
        {
          title: this.$t('ui.block.gasLimit'),
          info: this.NumberFormat(this.currentBlock.gas_limit),
        },
        {
          title: this.$t('ui.block.size'),
          info: `${this.currentBlock.size} bytes`,
        },
        {
          title: this.$t('ui.block.hash'),
          info: this.currentBlock.hash,
        },
      ];
    },
    payload() {
      return {
        limit: this.limit,
        offset: this.offset,
      };
    },
    historyPath() {
      return sessionStorage.getItem('backRoute');
    },
    dateFromNow() {
      return this.time && this.formatDataFromNow(this.currentBlock.timestamp);
    },
    currentBlockNumber() {
      return this.currentBlock?.number || 0;
    },
    nextBlockNumber() {
      return (+this.currentBlock?.number + 1) || 0;
    },
    previousBlockNumber() {
      return (+this.currentBlock?.number - 1) || 0;
    },
  },
  async beforeCreate() {
    this.isBlockLoading = true;
    await this.$store.dispatch('blocks/getBlockById', this.$route.params.id);
    this.isBlockLoading = false;
  },
  async mounted() {
    clearInterval(Number(this.timer));
    this.timer = setInterval(() => {
      this.time = Date.now();
    }, this.minute);
  },
  beforeDestroy() {
    clearInterval(Number(this.timer));
    this.$store.commit('blocks/resetBlock');
  },
  methods: {
    async changeBlock(blockId) {
      if (blockId) {
        await this.$router.push(`${blockId}`);
      }
    },
    back() {
      if (this.historyPath) {
        this.$router.push(this.historyPath);
      } else {
        this.$router.push('/blocks');
      }
    },
  },
};
</script>
<style lang="scss" scoped>

.block {
  animation: show 1s 1;
  @include container;

  &__search {
    margin: 25px 0;
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
    margin-right: 5px;
  }

  &__number {
    @include text-simple;
    color: $black400;
    margin-right: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;

    & > .b-skeleton.b-skeleton-text {
      min-width: 75px !important;
      height: 24px !important;
      margin-bottom: 0 !important;
    }

    &-field {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  &__columns {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 23px;
    margin-top: 25px;
  }

  &__columns > :last-child {
    grid-column-start: 1;
    grid-column-end: 4;
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

@include _767 {
  .block {
    background: $white;
    padding-top: 22px;

    &__columns {
      display: flex;
      flex-direction: column;
    }

    &__number {
      color: $blue;
    }

    &__back, &__title {
      margin-left: 20px;
    }
  }
  ::v-deep .item {
    &__header {
      margin-bottom: 0;
    }

    &:nth-child(1) {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    &:nth-child(1) .item__info {
      order: -1;
      position: absolute;
      right: -5px;
      top: 4px;
      color: $black300;
      font-size: 14px;
    }

    &:nth-child(3) {
      display: flex;
      align-items: center;
    }

    &:nth-child(3) .item__header {
      margin-right: 10px;
    }

    &:nth-child(4) {
      display: flex;
      align-items: center;
    }

    &:nth-child(4) .item__header {
      margin-right: 10px;
    }

    &:nth-child(5) {
      display: flex;
      align-items: center;
    }

    &:nth-child(5) .item__header {
      margin-right: 10px;
    }
  }
}

</style>
