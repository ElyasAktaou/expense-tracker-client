<template>
  <v-card>
    <v-card-title>
      Revenus
    </v-card-title>
    <v-card-text>
      <v-row>
        <v-col>
          <v-icon>mdi-currency-usd</v-icon>
        </v-col>
        <v-col>
          <h2 v-if="!loading">$ {{ totalIncome }}</h2>
          <v-skeleton-loader v-else width="100px" type="text"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';

const store = useTransactionsStore();

const totalIncome = computed(() => store.totalIncome);
const loading = computed(() => store.loadingTotalIncome);

onMounted(() => {
  store.getTotalIncomeForCurrentYear();
});

</script>