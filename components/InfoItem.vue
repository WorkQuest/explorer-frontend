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
      type: [String, Number],
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
      font-size: 18px;
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
</style>
