<template>
  <div>
    <v-card>
      <v-card-title>
        Dernières opérations
      </v-card-title>
      <v-card-text>
        <v-data-table :items="transactions" :headers="headers" :loading="loading"></v-data-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, computed } from 'vue';
import { useTransactionsStore } from '@/stores/transactions';

const store = useTransactionsStore();

const transactions = computed(() => store.latestTransactions);
const loading = computed(() => store.loadingLatestTransactions);

onMounted(() => {
  // Fetch the latest transactions
  store.getLatestTransactions();
});


const headers = [
  { title: 'Date', value: 'date', key: 'date' },
  { title: 'Libellé', value: 'label', key: 'label' },
  { title: 'Description', value: 'description', key: 'description' },
  { title: 'Montant', value: 'amount', key: 'amount' },
  { title: 'Catégorie', value: 'category', key: 'category' },
  { title: 'Actions', value: 'actions' },
];

</script>

<style scoped>
/* Add your custom styles here */
</style>
