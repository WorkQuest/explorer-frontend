<template>
  <GChart
    type="LineChart"
    :data="chartData"
    :options="chartOptions"
  />
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
        height: 200,
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
  beforeDestroy() {
    window.removeEventListener('resize', this.updateWidth);
  },
  created() {
    window.addEventListener('resize', this.updateWidth);
  },
  async mounted() {
    await this.createChartData();
  },
  methods: {
    ...mapActions({
      transactionsByTime: 'tx/getTransactionsByTime',
    }),
    updateWidth() {
      this.width = window.innerWidth;
      if (window.innerWidth > 600) {
        this.chartOptions.width = 530;
        this.chartOptions.chartArea.width = 480;
      }
      if (window.innerWidth > 510 && window.innerWidth < 600) {
        this.chartOptions.width = 450;
        this.chartOptions.chartArea.width = 400;
      }
      if (window.innerWidth > 400 && window.innerWidth < 509) {
        this.chartOptions.width = 350;
        this.chartOptions.chartArea.width = 290;
      }
      if (window.innerWidth > 300 && window.innerWidth < 399) {
        this.chartOptions.width = 250;
        this.chartOptions.chartArea.width = 200;
      }
    },
    async createChartData() {
      const dayTo = new Date().toISOString();
      const currentDay = new Date();
      const timestamp = currentDay.setDate(currentDay.getDate() - 14);
      const dayFrom = new Date(timestamp).toISOString();
      const transactionsInfo = await this.transactionsByTime({ dayFrom, dayTo });
      let min = transactionsInfo.result.count[0].count;
      let max = transactionsInfo.result.count[0].count;
      transactionsInfo.result.count.forEach((item) => {
        if (+item.count > max) {
          max = +item.count;
        } else if (+item.count < min) {
          min = +item.count;
        }
      });
      this.chartOptions.vAxis.ticks = [min, max + 25];
      this.chartData = transactionsInfo.result.count.reduce((acc, item) => [...acc, [this.$moment(new Date(item.date)).format('DD MMMM'), +item.count]], [['Year', 'Transactions']]);
    },
  },
};
</script>
