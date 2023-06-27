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
        height: 150,
        tooltip: {
          isHtml: true,
        },
        chartArea: {
          width: 460,
          height: 140,
          top: 4,
          bottom: 4,
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
          ticks: [200, 500, 800],
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
      const day3 = new Date();
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
        this.chartOptions.height = 150;
        this.chartOptions.chartArea.width = 500;
        this.chartOptions.chartArea.height = 140;
      } else if (width > 1075 && width < 1080) {
        this.chartOptions.width = width - 370;
        this.chartOptions.height = width - 750;
        this.chartOptions.chartArea.width = width - 500;
        this.chartOptions.chartArea.height = width - 850;
      } else if (width > 1000 && width < 1070) {
        this.chartOptions.width = width - 370;
        this.chartOptions.height = 350;
        this.chartOptions.chartArea.width = width - 500;
        this.chartOptions.chartArea.height = 250;
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
      let min = transactionsInfo.result.count[0].count;
      let max = null;
      transactionsInfo.result.count.forEach((item) => {
        if (+item.count > max) {
          max = +item.count;
        } else if (+item.count < min) {
          min = +item.count;
        }
      });
      this.chartOptions.vAxis.ticks = [min, max];
      this.chartData = transactionsInfo.result.count.reduce((acc, item) => [...acc, [this.$moment(new Date(item.date)).format('DD MMMM, YYYY'), +item.count]], [['Date', 'Transactions']]);
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  &-days {
    display: flex;
    width: 100%;
    justify-content: space-around;
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
