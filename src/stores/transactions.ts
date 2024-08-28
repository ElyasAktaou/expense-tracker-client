import { defineStore } from 'pinia';
import http from '@/services/http';

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    // transactions: [
    //   // Create 12 salary income transactions of 10000 each one for each month of the year
    //   ...Array.from({ length: 12 }, (_, i) => ({
    //     id: i,
    //     date: new Date(`${new Date().getFullYear()}-${i + 1}-01`),
    //     name: 'Salary',
    //     type: 'income',
    //     amount: 10000,
    //     category: 'Salary',
    //     business: {
    //       name: 'Company',
    //       address: '123 Main St',
    //       logo: 'https://via.placeholder.com/150',
    //     },
    //   })),
    //   // Create 12 rent expense transactions of 1000 each one for each month of the year
    //   ...Array.from({ length: 12 }, (_, i) => ({
    //     id: i + 12,
    //     date: new Date(`${new Date().getFullYear()}-${i + 1}-01`),
    //     name: 'Rent',
    //     type: 'expense',
    //     amount: 3000,
    //     category: 'Rent',
    //     business: {
    //       name: 'Landlord',
    //       address: '456 Elm St',
    //       logo: 'https://via.placeholder.com/150',
    //     },
    //   })),
    //   // create 12 grocery expense transactions of random amount between 1200 and 1800 each one for each month of the year
    //   ...Array.from({ length: 12 }, (_, i) => ({
    //     id: i + 24,
    //     date: new Date(`${new Date().getFullYear()}-${i + 1}-01`),
    //     name: 'Grocery',
    //     type: 'expense',
    //     amount: Math.floor(Math.random() * 600 + 1200),
    //     category: 'Grocery',
    //     business: {
    //       name: 'Grocery Store',
    //       address: '789 Oak St',
    //       logo: 'https://via.placeholder.com/150',
    //     },
    //   })),
    // ] as Transaction[],
    latestTransactions: [] as Transaction[],
    totalExpensesByCategory: [] as { category: string; totalExpense: number }[],
    barChartData: [] as { month: string; income: number; expense: number }[],
    totalExpensesByMonth: [] as number[],
    totalIncomeByMonth: [] as number[],
    currentBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    loadingCurrentBalance: false,
    loadingTotalIncome: false,
    loadingTotalExpense: false,
    loadingLatestTransactions: false,
    loadingBarChart: false,
    loadingPieChart: false,
  }),
  getters: {
    // totalExpensesByCategory(state): { [key: string]: number } {
    //   const total: { [key: string]: number } = {};
    //   state.transactions.filter(t => t.type === "expense").forEach(transaction => {
    //     total[transaction.category] = (total[transaction.category] || 0) + transaction.amount;
    //   });
    //   return total;
    // },
    // return an array of categories with the total amount of expense for each category, excluding the categories with total amount 0
    // totalExpensesByCategory(state): { [key: string]: number } {
    //   const total: {[key: string]: number} = {};
    //   state.transactions
    //     .filter(t => t.type === 'expense')
    //     .forEach(transaction => {
    //       total[transaction.category] = (total[transaction.category] || 0) + transaction.amount;
    //     });
    //   return total;
    // },
    // totalExpensesByMonth(state): number[] {
    //   return Array.from({ length: 12 }, (_, i) => state.transactions.filter(t => t.type === "expense" && new Date(t.date).getMonth() === i).reduce((total, transaction) => total + transaction.amount, 0));
    // },
    // totalIncomeByMonth(state): number[] {
    //   return Array.from({ length: 12 }, (_, i) => state.transactions.filter(t => t.type === "income" && new Date(t.date).getMonth() === i).reduce((total, transaction) => total + transaction.amount, 0));
    // },

  },
  actions: {
    async reload() {
      await Promise.allSettled([
        this.getLatestTransactions(),
        this.getBarChartData(),
        this.getPieChartData(),
        this.getCurrentBalance(),
        this.getTotalIncomeForCurrentYear(),
        this.getTotalExpenseForCurrentYear(),
      ]);
    },
    async getLatestTransactions() {
      this.loadingCurrentBalance = true;
      const { data } = await http.get('/transactions');
      this.latestTransactions = data;
      this.loadingCurrentBalance = false
    },
    async getPieChartData() {
      this.loadingPieChart = true;
      const { data } = await http.get('/transactions/total-expense-by-category');
      this.totalExpensesByCategory = data.pieChartData;
      this.loadingPieChart = false;
    },
    async getBarChartData() {
      this.loadingBarChart = true;
      const { data } = await http.get('/transactions/income-expense-totals-by-month');
      this.barChartData = data.barChartData;
      this.loadingBarChart = false;
    },
    async getCurrentBalance() {
      this.loadingCurrentBalance = true;
      const { data } = await http.get('/transactions/current-balance');
      this.currentBalance = data.balance;
      this.loadingCurrentBalance = false
    },
    async getTotalIncomeForCurrentYear() {
      this.loadingTotalIncome = true;
      const { data } = await http.get('/transactions/total-income');
      this.totalIncome = data.totalIncome;
      this.loadingTotalIncome = false;
    },
    async getTotalExpenseForCurrentYear() {
      this.loadingTotalExpense = true;
      const { data } = await http.get('/transactions/total-expense');
      this.totalExpense = data.totalExpense;
      this.loadingTotalExpense = false;
    },
    async addTransaction(transaction: Transaction) {
      await http.post('/transactions', transaction);
      this.reload();
    },
    async removeTransaction(transactionId: String) {
      await http.delete(`/transactions/${transactionId}`);
      this.reload();
    },
  },
});

interface Transaction {
  id?: number;  
  date: Date;
  name: string;
  description?: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  // business: Business;
  // Add more properties as needed
}

// interface Business {
//   name: string;
//   address: string;
//   logo: string;
// }