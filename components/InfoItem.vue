<template>
  <div class="item">
    <p
      v-if="isInfoLoading"
      class="item__header"
    >
      <b-skeleton width="50%" />
    </p>
    <p
      v-if="!isInfoLoading"
      class="item__header"
    >
      {{ title }}
    </p>
    <p
      v-if="isInfoLoading"
      class="item__info"
    >
      <b-skeleton width="30%" />
    </p>
    <p
      v-else-if="!isInfoLoading && item === 'link' "
      class="item__info"
    >
      <nuxt-link
        class="item__link"
        :to="`/blocks/${info}`"
      >
        {{ info }}
      </nuxt-link>
    </p>
    <p
      v-else-if="!isInfoLoading && item === 'transactionsCount'"
      class="item__link"
    >
      <nuxt-link
        class="item__link"
        :to="{ path: '/tx', query: { block: currentBlock.number }}"
      >
        {{ info }} {{ $t('ui.txs') }}
      </nuxt-link>
    </p>
    <p
      v-else-if="!isInfoLoading && info && item === 'address'"
      class="item__info item__info_blue"
    >
      <nuxt-link
        class="item__link"
        :to="{ path: '/address/'+info }"
      >
        {{ info }}
      </nuxt-link>
      <button-copy
        :value="info"
        icon-color="primary"
      />
    </p>
    <div
      v-else-if="!isInfoLoading && item === 'tokenTransfers' && info.length"
      class="item__info tokens-transferred-wrapper"
    >
      <div
        v-for="(row,i) in info"
        :key="i"
        class="tokens-transferred"
      >
        <span class="tokens-transferred__title">{{ $t('ui.tx.from') }}</span>
        <nuxt-link
          :to="{ path: '/address/'+row.from }"
          class="tokens-transferred__value tokens-transferred__value_blue"
        >
          {{ row.from }}
        </nuxt-link>
        <span class="tokens-transferred__title">{{ $t('ui.tx.to') }}</span>
        <nuxt-link
          :to="{ path: '/address/'+row.to }"
          class="tokens-transferred__value tokens-transferred__value_blue"
        >
          {{ row.to }}
        </nuxt-link>
        <span class="tokens-transferred__title">{{ $t('ui.tx.for') }}</span> <span class="tokens-transferred__value">{{ row.amount }}</span>
        <nuxt-link
          :to="{path: '/tokens/'+row.tokenAddress }"
          class="tokens-transferred__link"
        >
          <img
            :src="row.tokenIconUrl"
            :alt="row.token"
            width="20px"
            height="20px"
          >
          {{ row.token }}
        </nuxt-link>
      </div>
    </div>
    <p
      v-else-if="!isInfoLoading && item === 'status'"
      class="item__info status"
      :class="{'status_green': info === 1, 'status_red': info === 0}"
    >
      {{ info === 1 ? this.$t('ui.tx.transactionSuccess') : this.$t('ui.tx.transactionFail') }}
    </p>

    <p
      v-else-if="!isInfoLoading && item === 'timestamp'"
      class="item__info"
    >
      <slot name="timestamp" />
    </p>
    <p
      v-else
      class="item__info"
    >
      {{ info }}
    </p>
    <p v-if="isInfoLoading">
      <b-skeleton width="60%" />
    </p>
    <p
      v-else-if="!isInfoLoading && note"
      class="item__note"
      :class="{'item__note_red': info === 0}"
    >
      <span v-if="info === 0 && note">&boxur;</span> {{ note }}
    </p>
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
    info: {
      type: [String, Number, Array],
      default: '',
    },
    note: {
      type: String,
      default: '',
    },
    item: {
      type: String,
      default: '',
    },
    isInfoLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      currentBlock: 'blocks/getCurrentBlock',
    }),
  },
};
</script>
<style lang="scss" scoped>
.btn {
  &__copy {
    position: absolute;
    margin: -5px 0 0 10px;

    height: 35px;
    width: 35px;
    align-items: center;
    justify-items: center;
    background: $white;
    border: 1px solid $black0;
    padding: 5px;
    border-radius: 6px;
    transition: .5s;

    &:hover {
      background: $black100;
    }
  }
}

.item {

  &__header {
    @include text-simple;
    font-weight: 600;
    font-size: 18px;
    margin-bottom: 10px;
  }

  &__info {
    @include text-simple;
    word-break: break-all;
    font-size: 18px;
    line-height: 130%;
    &_blue {
      color: $blue;
    }

  }

  &__note {
    @include text-simple;
    font-size: 14px;
    color: $black300;
    &_red {
      color: $red;
    }
  }

  &__link {
    @include text-simple;
    @include link;
    font-size: 18px;
    color: $blue;
  }
}

.status {
  border-radius: 3px;
  width: 58px;
  font-size: 12px;
  text-align: center;
  padding: 4px;
  &_green {
    background: $green100;
    color: $green;
  }
  &_red {
    background: rgba(223, 51, 51, 0.1);
    color: $red;
  }
}

.icon-copy {
  color: $blue;
  font-size: 20px;
  cursor: pointer;
}

.tokens-transferred {
  display: flex;
  margin-left: 25px;

  &__title {
    margin-right: 5px;
    font-weight: 500;
  }
  &__value {
    max-width: fit-content;
    width: 150px;
    margin-right: 15px;
    margin-bottom: 10px;

    font-size: 18px;

    overflow: hidden;
    text-overflow: ellipsis;
    word-break: unset;
    white-space: nowrap;
    text-decoration: none;

    &_blue {
      color: $blue;
    }
  }
  &__link {
    display: flex;
    text-decoration: none;
    color: $blue;
    & img {
      width: 23px;
      height: 23px;
      margin-right: 5px;
    }
  }
}

@include _1024 {
  .tokens-transferred {
    margin-top: 15px;
  }

  .item {
    &__link {
      font-size: 17px;
    }
  }
}

@include _991 {
  .item {
    &__link {
      font-size: 20px;
    }
  }
}

@include _575 {
  .tokens-transferred {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-gap: 10px;

    &__value {
      width: 100%;
    }

    &__link {
      grid-column: span 2;
      padding-bottom: 10px;
      border-bottom: 1px solid $black100;
    }
  }
}

</style>
