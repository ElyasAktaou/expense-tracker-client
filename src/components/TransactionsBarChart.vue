<template>
  <v-card height="400px" v-if="!loading">
    <VueApexCharts
    type="bar"
    :options="chartOptions"
    :series="series"
    height="350"
    />
  </v-card>
  <v-skeleton-loader v-else height="400px"></v-skeleton-loader>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';
import VueApexCharts from 'vue3-apexcharts';

const store = useTransactionsStore();

onMounted(() => {
  store.getBarChartData();
});

const loading = computed(() => store.loadingBarChart);

const barChartData = computed(() => store.barChartData); 

const labels = computed(() => barChartData.value.map((item) => item.month));
const totalIncomeByMonth = computed(() => barChartData.value.map((item) => item.totalIncome));
const totalExpenseByMonth = computed(() => barChartData.value.map((item) => item.totalExpense));

// Create a chartOptionns object for a double bar chart one bar for income and one for expenses for each month
const chartOptions = ref({
  chart: {
    type: 'bar'
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%',
      endingShape: 'rounded'
    },
  },
  dataLabels: {
    enabled: false
  },
  stroke: {
    show: true,
    width: 2,
    colors: ['transparent']
  },
  xaxis: {
    // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    categories: labels.value
  },
  yaxis: {
    title: {
      text: 'Amount'
    }
  },
  fill: {
    opacity: 1
  },
  tooltip: {
    y: {
      formatter: function (val) {
        return '$ ' + val + ' dollars';
      }
    }
  }
});

// Create a series object with two arrays one for income and one for expenses
const series = ref([
  {
    name: 'Income',
    // return array of 12 months with the sum of income for each month
    data: totalIncomeByMonth
  },
  {
    name: 'Expenses',
    data: totalExpenseByMonth
  }
]);

</script>