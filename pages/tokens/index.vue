<template>
  <div
    v-if="!isLoading"
    class="tokens"
  >
    <search-filter class="tokens__search" />
    <table-tokens
      class="tokens__table"
      :title="$tc('ui.token.tracker')"
      :items="tokens"
      :fields="tableHeaders"
    />

    <!--    mobile-->
    <!--    <div class="tokens__content">-->
    <!--      <p class="tokens__title">-->
    <!--        {{ $t('ui.token.tracker') }}-->
    <!--      </p>-->
    <!--      <div-->
    <!--        v-for="(token, index) in tracker"-->
    <!--        :key="index"-->
    <!--        class="token"-->
    <!--        :class="{token__separator: (index === tracker.length - 1)}"-->
    <!--      >-->
    <!--        <p class="token__token">-->
    <!--          {{ $t('ui.token.token') }}-->
    <!--        </p>-->
    <!--        <div class="token__header">-->
    <!--          <img-->
    <!--            :src="require(`~/assets/img/tokens/${token.token}.svg`)"-->
    <!--            width="15"-->
    <!--            class="token__image"-->
    <!--            :alt="token.token"-->
    <!--          >-->
    <!--          <nuxt-link-->
    <!--            :to="{ path: `tokens/`+token.token, params: { token: token.token }}"-->
    <!--            class="token__title table__link"-->
    <!--          >-->
    <!--            {{ tokens[`${token.token}`].name }} ({{ token.token }})-->
    <!--          </nuxt-link>-->
    <!--        </div>-->
    <!--        <p class="token__description">-->
    <!--          {{ tokens[`${token.token}`].description }}-->
    <!--        </p>-->
    <!--        <div-->
    <!--          v-if="token.volume"-->
    <!--          class="token__subtitle"-->
    <!--        >-->
    <!--          {{ $t('ui.token.volume') }}-->
    <!--          <span class="token__info">-->
    <!--            $ {{ token.volume }}-->
    <!--          </span>-->
    <!--        </div>-->
    <!--        <div-->
    <!--          v-if="token.holders"-->
    <!--          class="token__subtitle"-->
    <!--        >-->
    <!--          {{ $t('ui.token.holders') }}-->
    <!--          <span class="token__info">-->
    <!--            {{ token.holders }}-->
    <!--          </span>-->
    <!--        </div>-->
    <!--      </div>-->
    <!--    </div>-->

    <base-pager
      v-if="totalPages > 1"
      v-model="page"
      class="tokens__pager"
      :total-pages="totalPages"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import TableTokens from '~/components/TableTokens';

export default {
  name: 'TokensTracker',
  components: { TableTokens },
  data() {
    return {
      page: 1,
      limit: 10,
      offset: 0,
    };
  },
  computed: {
    ...mapGetters({
      allTokensCount: 'tokens/getAllTokensCount',
      allTokens: 'tokens/getAllTokens',
      isLoading: 'main/getIsLoading',
    }),
    totalPages() {
      return this.setTotalPages(this.allTokensCount, 20);
    },
    payload() {
      return {
        limit: this.limit,
        offset: this.offset,
      };
    },
    tokens() {
      if (this.allTokensCount > 0) {
        return this.allTokens;
      }
      return [];
    },
    tableHeaders() {
      return [
        { key: 'number', label: '#', sortable: true },
        { key: 'contract_address_hash.hex', label: this.$t('ui.token.token'), sortable: true },
        { key: 'total_supply', label: this.$t('ui.token.volume'), sortable: true },
        { key: 'holder_count', label: this.$t('ui.token.holders'), sortable: true },
      ];
    },
  },
  async mounted() {
    await this.SetLoader(true);
    await this.$store.dispatch('tokens/getAllTokens', this.payload);
    await this.SetLoader(false);
  },
};
</script>

<!--{
   "contract_address_hash":{
      "hex":"0x75fc17d0c358f19528d5c24f29b37fa2aa725b1e",
      "bech32":"wq1wh7p05xrtrce22x4cf8jnvml5248ykc7ke2ldp"
   },
   "name":"WQ Ethereum wrapped",
   "symbol":"ETH",
   "total_supply":"1050000000000000000000",
   "decimals":"18",
   "type":"ERC-20",
   "inserted_at":"2022-02-16T16:30:36.447Z",
   "updated_at":"2022-03-04T08:07:25.535Z",
   "holder_count":22,
   "bridged":null,
   "skip_metadata":null
}-->

<style lang="scss" scoped>
.tokens {
  animation: show 1s 1;
  margin: 0 auto;

  &__search {
    margin: 25px 0;
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
      background: $white;
      padding: 16px;
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
