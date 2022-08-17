<template>
  <div class="wrapper">
    <div
      v-if="chartData.length"
      class="wrapper__content content"
    >
      <GChart
        type="LineChart"
        :data="chartData"
        :options="chartOptions"
        class="content-chart"
      />
      <div class="content-days">
        <span
          v-for="day in historyDays"
          :key="day"
          class="content-days_day"
        >
          {{ day }}
        </span>
      </div>
    </div>
    <div
      v-else
      class="loader-cont"
    >
      <loader
        class="loader-cont__loader"
        is-mini-loader
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { GChart } from 'vue-google-charts/legacy';

export default {
  name: 'Chart',
  components: {
    GChart,
  },
  data() {
    return {
      chartData: [],
      chartOptions: {
        curveType: 'function',
        width: 550,
        height: 170,
        tooltip: {
          isHtml: true,
        },
        chartArea: {
          width: 460,
          height: 200,
        },
        legend: {
          position: 'none',
        },
        hAxis: {
          baselineColor: '#FFF',
          gridlines: {
            color: '#FFF',
          },
          textPosition: 'none',
          textStyle: {
            fontSize: '12',
            color: '#AAB0B9',
          },
        },
        vAxis: {
          baselineColor: '#FFF',
          gridlines: {
            color: '#FFF',
          },
          textStyle: {
            fontSize: '12',
            color: '#AAB0B9',
          },
        },
      },
    };
  },
  computed: {
    historyDays() {
      const day1 = new Date().setDate(new Date().getDate() - 14);
      const day2 = new Date().setDate(new Date().getDate() - 7);
      const day3 = new Date().setDate(new Date().getDate() - 1);
      return [
        this.$moment(day1).format('DD MMMM'),
        this.$moment(day2).format('DD MMMM'),
        this.$moment(day3).format('DD MMMM'),
      ];
    },
  },
  created() {
    window.addEventListener('resize', this.updateWidth);
  },
  async mounted() {
    await this.createChartData();
    this.updateWidth();
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateWidth);
  },
  methods: {
    ...mapActions({
      transactionsByTime: 'statistics/getTransactionsByTime',
    }),
    updateWidth() {
      const width = window.innerWidth;
      if (width > 1080) {
        this.chartOptions.width = 550;
        this.chartOptions.height = 170;
        this.chartOptions.chartArea.width = 500;
        this.chartOptions.chartArea.height = 200;
      } else if (width > 1075 && width < 1080) {
        this.chartOptions.width = width - 370;
        this.chartOptions.height = width - 750;
        this.chartOptions.chartArea.width = width - 500;
        this.chartOptions.chartArea.height = width - 850;
      } else if (width > 1000 && width < 1070) {
        this.chartOptions.width = width - 370;
        this.chartOptions.height = 320;
        this.chartOptions.chartArea.width = width - 500;
        this.chartOptions.chartArea.height = 380;
      } else if (width > 900 && width < 1000) {
        this.chartOptions.width = width - 380;
        this.chartOptions.chartArea.width = width - 440;
      } else if (width > 875 && width < 900) {
        this.chartOptions.width = width - 380;
        this.chartOptions.chartArea.width = width - 440;
      } else if (width > 769 && width < 875) {
        this.chartOptions.width = width - 380;
        this.chartOptions.chartArea.width = width - 440;
      } else if (width > 710 && width < 769) {
        this.chartOptions.width = width - 100;
        this.chartOptions.chartArea.width = width - 150;
      } else if (width > 640 && width < 710) {
        this.chartOptions.width = width - 100;
        this.chartOptions.chartArea.width = width - 150;
      } else if (width > 481 && width < 640) {
        this.chartOptions.width = width - 100;
        this.chartOptions.chartArea.width = width - 150;
      } else {
        this.chartOptions.width = width - 40;
        this.chartOptions.chartArea.width = width - 90;
      }
    },
    async createChartData() {
      const dayTo = new Date().toISOString();
      const currentDay = new Date();
      const timestamp = currentDay.setDate(currentDay.getDate() - 14);
      const dayFrom = new Date(timestamp).toISOString();
      const transactionsInfo = await this.transactionsByTime({ dayFrom, dayTo });
      if (!transactionsInfo.ok) return;
      // added count = 0 for days without transactions
      const normalArray = [];
      for (let i = 14; i > 0; i -= 1) {
        normalArray.push({
          date: this.$moment(new Date().setDate(new Date().getDate() - i)).format('YYYY-MM-DD'),
          count: '0',
        });
      }
      normalArray.forEach((item) => {
        const temp = transactionsInfo.result.count.find((el) => el.date === item.date);
        if (!temp) return;
        item.count = temp.count;
      });
      console.log('normal arr after for each', normalArray);
      // min and max for Y-axis in chart
      let min = normalArray[0].count;
      let max = null;
      normalArray.forEach((item) => {
        if (+item.count > max) {
          max = +item.count;
        } else if (+item.count < min) {
          min = +item.count;
        }
      });

      this.chartOptions.vAxis.ticks = [min, max + 25];
      this.chartData = normalArray.reduce((acc, item) => [...acc, [this.$moment(new Date(item.date)).format('DD MMMM, YYYY'), +item.count]], [['Date', 'Transactions']]);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  &-days {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding-left: 35px;
    @include _1080 {
      justify-content: space-around;
      padding-left: 0;
    }
    @include _767 {
      justify-content: space-between;
      padding: 0 50px;
    }
    @include _575 {
      padding: 0 50px 0 35px;
    }
    @include _480 {
      padding: 0 35px;
    }
    &_day {
      font-size: 12px;
      line-height: 16px;
      color: #AAB0B9;
    }
  }
}

.loader-cont {
  margin: 60px auto 0;
  height: 20px;
  width: 20px;
  position: relative;

  &__loader {
    position: absolute !important;
    background: transparent !important;
  }
}
</style>
