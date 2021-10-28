<template>
  <div class="home">
    <div
      class="home__header"
    >
      <div class="home__content">
        <h3
          class="home__title"
        >
          {{ $t('home.title') }}
        </h3>
        <SearchFilterField />
        <!-- <div class="home__fields">
          <div class="home__search-field">
            <base-field
              v-model="search"
              class="home__input"
              :is-search="true"
              :is-hide-error="true"
              :placeholder="$t('ui.forms.searchPlaceholder')"
            />
            <div class="home__buttons-field">
              <div class="home__filters">
                <span class="home__filter">
                  {{ $t('home.filters') }}
                  <span class="icon-caret_down" />
                </span>
              </div>
              <div class="home__button-field">
                <base-btn
                  class="home__search-button"
                  :text="$t('ui.forms.search')"
                />
              </div>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <div class="home__table home__content">
      <base-table
        :title="$t('ui.latestBlocks')"
        :items="testBlocks"
        :fields="[
          {
            key: 'id', label: this.$t('ui.block.blockNumber'), sortable: true,
          },
          {
            key: 'timestamp', label: this.$t('ui.block.age'), sortable: true,
          },
          {
            key: 'txsCount', label: this.$t('ui.block.txsCount'), sortable: true,
          },
          {
            key: 'reward', label: this.$t('ui.block.reward'), sortable: true,
          }
        ]"
      />
    </div>
    <div class="home__table home__content">
      <base-table
        :title="$t('ui.txs') + ` (${txsCount})`"
        :items="txs"
        :fields="[
          {
            key: 'id', label: this.$t('ui.tx.hash'), sortable: false,
          },
          {
            key: 'fromAddress', label: this.$t('ui.tx.from'), sortable: false,
          },
          {
            key: 'toAddress', label: this.$t('ui.tx.to'), sortable: false,
          }
        ]"
      />
    </div>
  </div>
</template>
<script>
import SearchFilterField from '~/components/SearchFilterField/index.vue';

export default {
  name: 'Home',
  layout: 'default',
  components: {},
  data: () => ({
    blocksCount: 0,
    txsCount: 0,
    blocks: [],
    txs: [],
    testBlocks: [
      {
        id: 17102304,
        timestamp: '25 secs ago',
        txsCount: 209,
        reward: '0.06646 WUSD',
      },
      {
        id: 17102305,
        timestamp: '25 secs ago',
        txsCount: 209,
        reward: '0.06646 WUSD',
      },
    ],
  }),
  created() {
    // this.$router.push('/');
  },
  async mounted() {
    this.SetLoader(true);
    const [blocksRes, txsRes] = await Promise.all([
      this.$axios.get('/v1/blocks'),
      this.$axios.get('/v1/txs'),
    ]);
    this.blocks = blocksRes.data.result.blocks;
    this.blocksCount = blocksRes.data.result.count;
    this.txs = txsRes.data.result.txs;
    this.txsCount = txsRes.data.result.count;
    this.SetLoader(false);
    console.log('BLOCKS', this.blocks);
  },
};
</script>
<style lang="scss" scoped>
.home {
  &__table {
  }
  &__header {
    background: $darkblue;
    height: 350px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px;
  }
  &__content {
    width: 1180px;
    margin: 0 auto;
  }
  &__title {
    @include text-simple;
    @include normal-font-size;
    margin-bottom: 20px;
    font-weight: 600;
    font-size: 34px;
    color:  $white;
  }
  // &__fields {
  //   display: flex;
  //   align-items: center;
  // }
  // &__search-field {
  //   background: $white;
  //   width: 1180px;
  //   height: 83px;
  //   display: flex;
  //   justify-content: space-between;
  //   align-items: center;
  //   padding: 0 20px;
  //   border-radius: 6px;
  // }
  // &__input {
  //   flex-basis: 60%;
  // }
  // &__buttons-field {
  //   display: flex;
  // }
  // &__filters {
  //   width: 200px;
  //   height: 83px;
  //   border-left: 1px $black0 solid;
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  // }
  // &__filter {
  //   display: flex;
  //   justify-content: center;
  //   align-items: center;
  // }
  // &__button-field {
  //   height: 83px;
  //   display: flex;
  //   align-items: center;
  //   border-left: $black0 1px solid;
  // }
  // &__search-button {
  //   width: 220px;
  //   margin-left: 20px;
  // }
  &__header-button {
    width: 46px;
    height: 63px;
    margin-left: 10px;
    display: none;
  }
}
.icon-caret_down:before {
  color: $black400;
  font-size: 20px;
  margin-left: 17px;
}
</style>
