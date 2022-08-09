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
      console.log('this.width :', this.width);
      if (window.innerWidth > 1080) {
        this.chartOptions.width = 530;
        this.chartOptions.height = 200;
        this.chartOptions.chartArea.width = 480;
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
        this.chartOptions.chartArea.width = this.width - 500;
      }
      if (window.innerWidth > 900 && window.innerWidth < 1000) {
        this.chartOptions.width = this.width - 380;
        this.chartOptions.chartArea.width = this.width - 440;
      }
      if (window.innerWidth > 875 && window.innerWidth < 900) {
        this.chartOptions.width = this.width - 380;
        this.chartOptions.chartArea.width = this.width - 440;
      }
      if (window.innerWidth > 768 && window.innerWidth < 875) {
        this.chartOptions.width = this.width - 380;
        this.chartOptions.chartArea.width = this.width - 440;
      }
      if (window.innerWidth > 710 && window.innerWidth < 765) {
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
      if (window.innerWidth > 300 && window.innerWidth < 640) {
        this.chartOptions.width = this.width - 100;
        this.chartOptions.chartArea.width = this.width - 150;
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
      this.chartData = transactionsInfo.result.count.reduce((acc, item) => [...acc, [this.$moment(new Date(item.date)).format('DD MMMM, YYYY'), +item.count]], [['Date', 'Transactions']]);
    },
  },
};
</script>
