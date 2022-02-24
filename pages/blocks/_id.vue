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
    <div
      v-if="currentBlock"
      class="block__content"
    >
      <button
        class="block__back"
        @click="$router.go(-1)"
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
            :disabled="isLoading"
            type="button"
            @click="changeBlock(+currentBlock.number - 1)"
          >
            <span class="icon-caret_left" />
            <span class="block__block">{{ $t('ui.block.block') }}</span>
          </button>
          <span
            v-if="currentBlock.number"
            class="block__number"
          >#{{ currentBlock.number }}</span>
          <button
            type="button"
            :disabled="isLoading"
            @click="changeBlock(+currentBlock.number + 1)"
          >
            <span class="icon-caret_right" />
          </button>
        </div>
        <div class="block__columns">
          <info-item
            v-for="(item, i) in blockColumns"
            :key="i"
            :title="item.title"
            :info="item.info"
            :note="item.note"
            :item="item.item"
          />
        </div>
        <div class="block__columns_mobile columns">
          <div class="columns__time">
            <span class="columns__timestamp">
              {{ formatDataFromNow(currentBlock.timestamp) }}
            </span>
            <div class="columns__subtitle">
              {{ $t('ui.timestamp') }}
            </div>
            <span class="columns__info">
              {{ ($moment(currentBlock.timestamp).format('MMM-DD-YYYY, h:mm')) }}
            </span>
          </div>
          <p class="columns__subtitle">
            {{ $t('ui.block.reward') }}
          </p>
          <p class="columns__info">
            <!--        TODO: Вывести награду -->
            0.316538333801617818 MATIC
          </p>
          <p class="columns__subtitle">
            {{ $t('ui.txs') }}
          </p>
          <nuxt-link
            class="columns__link_small"
            :to="{ path: '/transactions', query: { block: currentBlock.number }}"
          >
            {{ currentBlock.transactions.length }} txns
          </nuxt-link>
          <p class="columns__info_grey">
            {{ $t('ui.block.inThisBlock') }}
          </p>
          <p class="columns__subtitle">
            {{ $t('ui.block.gasUsed') }}
            <span class="columns__info">
              <!--        TODO: Вывести проценты -->
              {{ currentBlock.gas_used }} (99,5%)
            </span>
          </p>
          <p class="columns__subtitle">
            {{ $t('ui.block.gasLimit') }}
            <span class="columns__info">{{ currentBlock.gas_limit }}</span>
          </p>
          <p class="columns__subtitle">
            {{ $t('ui.block.size') }}
            <span class="columns__info">{{ currentBlock.size }} {{ $t('ui.block.bytes') }}</span>
          </p>
          <p class="columns__subtitle">
            {{ $t('ui.block.hash') }}
          </p>
          <p class="columns__info">
            {{ currentBlock.hash }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';

BigNumber.config({ EXPONENTIAL_AT: 60 });

export default {
  name: 'Block',
  data() {
    return {
      search: '',
      limit: 10,
      offset: 0,
      index: 0,
    };
  },
  computed: {
    ...mapGetters({
      currentBlock: 'blocks/getCurrentBlock',
      isLoading: 'main/getIsLoading',
    }),
    blockColumns() {
      const fee = new BigNumber(this.currentBlock.base_fee_per_gas).multipliedBy(this.currentBlock.gas_used).shiftedBy(-18).toString();
      return [
        {
          title: this.$t('ui.timestamp'),
          info: this.formatDataFromNow(this.currentBlock.timestamp),
          note: `(${this.$moment(this.currentBlock.timestamp).format('MMM-DD-YYYY HH:MM:SS A +UTC')})`,
        },
        {
          title: this.$t('ui.txs'),
          info: Array.isArray(this.currentBlock.transactions) ? this.currentBlock.transactions.length : 0,
          note: this.$t('ui.block.inThisBlock'),
          item: 'transaction',
        },
        // TODO Rewards
        { title: this.$t('ui.block.reward'), info: `${fee} WUSD` },
        { title: this.$t('ui.block.gasUsed'), info: this.currentBlock.gas_used },
        { title: this.$t('ui.block.gasLimit'), info: this.NumberFormat(this.currentBlock.gas_limit) },
        { title: this.$t('ui.block.size'), info: `${this.currentBlock.size} bytes` },
        { title: this.$t('ui.block.hash'), info: this.currentBlock.hash },
      ];
    },
    payload() {
      return {
        limit: this.limit,
        offset: this.offset,
      };
    },
  },
  async mounted() {
    await this.SetLoader(true);
    await this.$store.dispatch('blocks/getBlockById', this.$route.params.id);
    await this.SetLoader(false);
  },
  beforeDestroy() {
    this.$store.commit('blocks/resetBlock');
  },
  methods: {
    async changeBlock(blockId) {
      await this.SetLoader(true);
      await this.$router.push(`${blockId}`);
      await this.SetLoader(false);
    },
  },
};
</script>
<style lang="scss" scoped>
.block {
  @include container;
  transition: .5s ease-in;

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

.columns {
  display: none;
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
