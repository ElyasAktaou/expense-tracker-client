<template>
  <v-card height="400px" v-if="!loading">
    <VueApexCharts type="pie" :options="chartOptions" :series="chartSeries" height="350" />
  </v-card>
  <v-skeleton-loader v-else height="400px"></v-skeleton-loader>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';
import VueApexCharts from 'vue3-apexcharts';


const store = useTransactionsStore();

// Fetch total expenses by category
onMounted(() => {
  store.getPieChartData();
});

const loading = computed(() => store.loadingPieChart);

// Use a getter to retrieve total expenses by category
const totalExpensesByCategory = computed(() => store.totalExpensesByCategory);

// Extract categories and amounts for the pie chart
const chartSeries = computed(() => totalExpensesByCategory.value?.map((item) => item.totalExpense));
const chartLabels = computed(() => totalExpensesByCategory.value?.map((item) => item.category));

// Chart options
const chartOptions = computed(() => ({
  labels: chartLabels.value,
  legend: {
    position: 'bottom',
  },
}));
</script>