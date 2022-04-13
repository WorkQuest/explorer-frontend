<template>
  <div

    class="txs__logs logs"
  >
    <template v-if="Array.isArray(logs) && logs.length === 0">
      <empty-data :description="$tc('ui.tx.noLogs')" />
    </template>

    <div class="content">
      <p
        v-if="Array.isArray(logs) && logs.length > 0"
        class="content__header"
      >
        {{ $t('ui.tx.logs') }}
      </p>

      <div class="content__table log">
        <p
          v-if="Array.isArray(logs) && logs.length > 0"
          class="log__title"
        >
          {{ $t('ui.tx.transactionFull') }}
        </p>
        <span
          v-if="hash"
          class="log__number"
        >
          {{ hash }}
        </span>
        <template v-for="(item, index) in logs">
          <template v-if="item.first_topic">
            <p
              :key="`${index}_title`"
              class="log__title"
            >
              {{ $t('ui.tx.topics') }}
            </p>
            <div
              :key="`${index}_firstTopic`"
              class="log__topic"
            >
              <div class="topic">
                <p class="topic__index">
                  0
                </p>
                <p class="topic__item">
                  {{ item.first_topic }}
                </p>
              </div>
              <div
                v-if="item.second_topic"
                :key="`${index}_secondTopic`"
                class="topic"
              >
                <p class="topic__index">
                  1
                </p>
                <p class="topic__item">
                  {{ item.second_topic }}
                </p>
              </div>
              <div
                v-if="item.third_topic"
                :key="`${index}_thirdTopic`"
                class="topic"
              >
                <p class="topic__index">
                  2
                </p>
                <p class="topic__item">
                  {{ item.third_topic }}
                </p>
              </div>
              <div
                v-if="item.fourth_topic"
                :key="`${index}_fourthTopic`"
                class="topic"
              >
                <p class="topic__index">
                  3
                </p>
                <p class="topic__item">
                  {{ item.fourth_topic }}
                </p>
              </div>
            </div>
            <p
              :key="`${index}_dataTitle`"
              class="log__title"
            >
              {{ $t('ui.tx.data') }}
            </p>
            <div
              :key="`${index}_dataContent`"
              class="log__data"
            >
              <div class="log__data">
                {{ item.data }}
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TxLogs',
  props: {
    logs: {
      type: Array,
      default: () => [],
    },
    hash: {
      type: String,
      default: '',
    },
  },
};
</script>

<style scoped lang="scss">
.content {
  display: flex;
  flex-direction: column;
  &__header {
     @include text-simple;
     font-size: 20px;
     margin-bottom: 20px;
  }
  &__table {
     display: grid;
     grid-template-columns: max-content 1fr;
     grid-gap: 10px;
  }
}

.log {
  &__title {
    @include text-simple;
    font-weight: 600;
    text-align: right;
    margin: 0;
  }
  &__topic {
    display: flex;
    flex-direction: column;
  }
  &__data {
    @include text-simple;
    margin-bottom: 20px;
    overflow-wrap: anywhere;
    max-width: 600px;
    text-align: justify;
  }
  &__number {
    @include text-simple;
    color: $blue;
    margin-bottom: 5px;
    overflow-wrap: anywhere;
  }
}

.topic {
  display: flex;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 5px;
  }
  &__index {
    @include text-simple;
    background: $black100;
    color: $black600;
    text-align: center;
    border-radius: 3px;
    width: 21px;
    height: 21px;
    margin-right: 10px;
    font-size: 12px;
    padding-right: 5px;
    padding-left: 5px;
  }
  &__item {
    @include text-simple;
    overflow-wrap: anywhere;
  }
}

@include _991 {
  .log__title {
    text-align: left;
  }
  .content__table {
    grid-template-columns: 1fr
  }
}
</style>
