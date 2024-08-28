<template>
  <v-container id="appContainer">

    <v-row>
      <v-col>
        <!-- welcome -->
        <h1 class="heading">Welcome to your personal finance app</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <!-- kpi card current balance -->
        <CurrentBalance/>
      </v-col>
      <v-col>
        <!-- kpi card total income -->
        <TotalIncome/>
      </v-col>
      <v-col>
        <!-- kpi card total expenses -->
        <TotalExpense/>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="8">
        <TransactionsBarChart />
      </v-col>
      <v-col cols="4">
        <ExpensesCategoriesPieChart />
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <TransactionsList />
      </v-col>
    </v-row>
      <!-- floating action button add transaction -->
      <v-fab id="newTransactionFab" icon="mdi-plus" app location="#appContainer"  color="primary" @click="showDialog=true"></v-fab>
  </v-container>
  <v-dialog v-if="showDialog" v-model="showDialog">
    <NewTransactionForm @close="showDialog=false"/>
  </v-dialog>
  <!-- <HelloWorld /> -->
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import TransactionsList from '@/components/TransactionsList.vue';
import NewTransactionForm from '@/components/NewTransactionForm.vue';
import {useTransactionsStore} from '@/stores/transactions';

const store = useTransactionsStore();

const balance = computed(() => store.balance);
const totalIncome = computed(() => store.totalIncome);
const totalExpenses = computed(() => store.totalExpenses);

const showDialog = ref(false);
</script>

<style scoped>
  /* #newTransactionFab {
    bottom: 20px;
    right: 20px;
  } */
</style>