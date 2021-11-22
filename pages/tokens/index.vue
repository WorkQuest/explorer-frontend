<template>
  <div class="tokens">
    <search-filter class="tokens__search" />
    <TableTokens
      class="tokens__table"
      :title="$t('ui.token.tracker')"
      :items="tracker"
      :tokens="tokens"
      :fields="tableHeaders"
    />
    <base-field
      v-model="search"
      class="tokens__search_mobile"
      :is-search="true"
      :is-hide-error="true"
      :placeholder="$t('ui.forms.searchPlaceholder')"
    />
    <div class="tokens__content">
      <p class="tokens__title">
        {{ $t('ui.token.tracker') }}
      </p>
      <div
        v-for="(token, index) in tracker"
        :key="index"
        class="token"
        :class="{token__separator: (index === tracker.length - 1)}"
      >
        <p class="token__token">
          {{ $t('ui.token.token') }}
        </p>
        <div class="token__header">
          <img
            :src="require(`~/assets/img/tokens/${token.token}.svg`)"
            width="15"
            class="token__image"
          >
          <nuxt-link
            :to="{ path: `tokens/`+token.token, params: { token: token.token }}"
            class="token__title table__link"
          >
            {{ tokens[`${token.token}`].name }} ({{ token.token }})
          </nuxt-link>
        </div>
        <p class="token__description">
          {{ tokens[`${token.token}`].description }}
        </p>
        <div
          v-if="token.volume"
          class="token__subtitle"
        >
          {{ $t('ui.token.volume') }}
          <span class="token__info">
            $ {{ token.volume }}
          </span>
        </div>
        <div
          v-if="token.holders"
          class="token__subtitle"
        >
          {{ $t('ui.token.holders') }}
          <span class="token__info">
            {{ token.holders }}
          </span>
        </div>
      </div>
    </div>

    <base-pager
      v-if="totalPagesValue > 1"
      v-model="currentPage"
      class="tokens__pager"
      :total-pages="totalPagesValue"
    />
  </div>
</template>

<script>
import TableTokens from '~/components/TableTokens/index.vue';

export default {
  name: 'TokensTracker',
  components: {
    TableTokens,
  },
  data() {
    return {
      currentPage: 1,
      search: '',
      tracker: [
        {
          number: 1,
          token: 'USDT',
          volume: 43369072176.00,
          holders: 3320602,
        },
        {
          number: 2,
          token: 'BUSD',
          volume: 43369072177.00,
          holders: 3320603,
        },
        {
          number: 3,
          token: 'GHST',
          volume: 43369072179.00,
          holders: 3320600,
        },
      ],
      tokens: {
        USDT: {
          name: 'Tether USD',
          description: 'Tether gives you the joint benefits of open blockchain technology and traditional currency by converting your cash into a stable digital currency equivalent.',
        },
        BUSD: {
          name: 'Binance USD',
          description: 'Binance USD (BUSD) is a dollar-backed stablecoin issued and custodied by Paxos Trust Company, and regulated by the New York State Department of Financial Services. BUSD is available directly for sale 1:1 with USD on Paxos.com and will be listed for trading on Binance.',
        },
        GHST: {
          name: 'Aavegotchi Ghost Token',
          description: 'Aavegotchis are crypto-collectibles living on the Ethereum blockchain, backed by the ERC721 standard used in popular blockchain games. $GHST is the official utility token of the Aavegotchi ecosystem and can be used to purchase portals, wearables, and consumables.',
        },
      },
    };
  },
  computed: {
    totalPagesValue() {
      return this.setTotalPages(this.tokens.length, 20);
    },
    tableHeaders() {
      return [
        {
          key: 'number', label: '#', sortable: true,
        },
        {
          key: 'token', label: this.$t('ui.token.token'), sortable: true,
        },
        {
          key: 'volume', label: this.$t('ui.token.volume'), sortable: true,
        },
        {
          key: 'holders', label: this.$t('ui.token.holders'), sortable: true,
        },
      ];
    },
  },
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
};
</script>

<style lang="scss" scoped>
.tokens {
  &__search {
    margin: 25px 0;
    &_mobile {
      display: none;
    }
  }
  &__table {
    @include container;
  }
  &__content {
    display: none;
  }
}

@include _767 {
  .tokens {
    &__table {
      display: none;
    }
    &__content {
      display: block;
      background:$white;
      padding: 16px;
    }
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
    &__title {
      @include text-simple;
      @include normal-font-size;
    }
    &__pager {
      margin: 16px;
    }
  }
  .token {
    padding: 20px 0;
    border-bottom: 1px solid $black100;
     &__separator {
        border: none;
        padding-bottom: 5px;
    }
    &__token {
      @include text-simple;
      @include normal-font-size;
      font-weight: 600;
      font-size: 14px;
      color: $black300;
    }
    &__header {
    display: flex;
    }
    &__title {
      @include text-simple;
      @include normal-font-size;
      @include link;
      font-size: 20px;
      margin: 5px;
    }
    &__description {
      @include text-simple;
      @include normal-font-size;
      font-size: 12px;
      color: $black300;
      max-width: 100%;
      margin: 0;
    }
    &__subtitle {
      font-weight: 600;
      grid-column: 1/3;
      margin-top: 11px;
    }
    &__info {
      font-weight: normal;
      margin-left: 10px;
    }
  }
}
</style>
