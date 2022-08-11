<template>
  <div class="wrapper">
    <div
      v-if="chartData"
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
    <span v-else>
      {{ $t('ui.loading') }}
    </span>
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
          height: 110,
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
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.updateWidth);
  },
  methods: {
    ...mapActions({
      transactionsByTime: 'statistics/getTransactionsByTime',
    }),
    updateWidth() {
      this.width = window.innerWidth;
      if (window.innerWidth > 1080) {
        this.chartOptions.width = 550;
        this.chartOptions.height = 150;
        this.chartOptions.chartArea.width = 500;
        this.chartOptions.chartArea.height = 110;
      }
      if (window.innerWidth > 1075 && window.innerWidth < 1080) {
        this.chartOptions.width = this.width - 370;
        this.chartOptions.height = this.width - 750;
        this.chartOptions.chartArea.width = this.width - 500;
        this.chartOptions.chartArea.height = this.width - 850;
      }
      if (window.innerWidth > 1000 && window.innerWidth < 1070) {
        this.chartOptions.width = this.width - 370;
        this.chartOptions.height = 350;
        this.chartOptions.chartArea.width = this.width - 500;
        this.chartOptions.chartArea.height = 250;
      }
      if (window.innerWidth > 900 && window.innerWidth < 1000) {
        this.chartOptions.width = this.width - 380;
        this.chartOptions.chartArea.width = this.width - 440;
      }
      if (window.innerWidth > 875 && window.innerWidth < 900) {
        this.chartOptions.width = this.width - 380;
        this.chartOptions.chartArea.width = this.width - 440;
      }
      if (window.innerWidth > 769 && window.innerWidth < 875) {
        this.chartOptions.width = this.width - 380;
        this.chartOptions.chartArea.width = this.width - 440;
      }
      if (window.innerWidth > 710 && window.innerWidth < 769) {
        this.chartOptions.width = this.width - 100;
        this.chartOptions.height = this.width - 500;
        this.chartOptions.chartArea.width = this.width - 150;
        this.chartOptions.chartArea.height = this.width - 600;
      }
      if (window.innerWidth > 640 && window.innerWidth < 710) {
        this.chartOptions.width = this.width - 100;
        this.chartOptions.height = this.width - 450;
        this.chartOptions.chartArea.width = this.width - 150;
        this.chartOptions.chartArea.height = this.width - 550;
      }
      if (window.innerWidth > 481 && window.innerWidth < 640) {
        this.chartOptions.width = this.width - 100;
        this.chartOptions.chartArea.width = this.width - 150;
      }
      if (window.innerWidth > 300 && window.innerWidth < 481) {
        this.chartOptions.width = this.width - 40;
        this.chartOptions.chartArea.width = this.width - 90;
      }
    },
    async createChartData() {
      const dayTo = new Date().toISOString();
      const currentDay = new Date();
      const timestamp = currentDay.setDate(currentDay.getDate() - 14);
      const dayFrom = new Date(timestamp).toISOString();
      const transactionsInfo = await this.transactionsByTime({ dayFrom, dayTo });
      let min = transactionsInfo.result.count[0].count;
      let max = null;
      transactionsInfo.result.count.forEach((item) => {
        if (+item.count > max) {
          max = +item.count;
        } else if (+item.count < min) {
          min = +item.count;
        }
      });
      this.chartOptions.vAxis.ticks = [min, max + 25];
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
</style>
