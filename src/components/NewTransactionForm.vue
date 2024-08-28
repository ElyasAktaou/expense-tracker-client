<template>
  <v-card>
    <v-card-title>
      Ajouter une transaction
    </v-card-title>
    <v-card-text>
      <v-form>
        <!-- choose expense or income -->
        <v-radio-group v-model="type">
          <v-radio label="Dépense" value="expense"></v-radio>
          <v-radio label="Revenu" value="income"></v-radio>
        </v-radio-group>
        <!-- picture upload -->
        <v-img v-if="file" :src="fileUrl" max-width="300px" class="mx-auto"></v-img>
        <v-file-input v-model="file" @change="onImageChange" label="Ajouter une photo"></v-file-input>
        <v-text-field v-model="label" label="Libellé"></v-text-field>
        <v-text-field v-model="description" label="Description"></v-text-field>
        <v-text-field v-model="amount" label="Montant" type="number"></v-text-field>
        <v-autocomplete
          :loading="loadingCategories"
          v-model="category"
          :items="filteredCategories"
          label="Categorie"
          item-title="label"
          item-value="_id"
        />
        <v-spacer></v-spacer>
        <v-btn variant="plain" color="primary" @click="$emit('close')">Annuler</v-btn>
        <v-btn color="primary" @click="addTransaction" :loading="loadingSubmit">Ajouter</v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted} from 'vue';
import { useTransactionsStore } from '@/stores/transactions';
import http from '@/services/http';
const emit = defineEmits(['close'])

const store = useTransactionsStore();
const label = ref('');
const description = ref('');
const amount = ref(0);
const category = ref('');
const categories = ref([]);
const type = ref('expense');
const file = ref<File | null>(null);
const fileUrl = ref<string | null>(null);
const loadingCategories = ref(false);
const loadingSubmit = ref(false);
// const base64Image = ref<string | null>(null);


onMounted(() => {
  fetchCategories();
});

async function fetchCategories() {
  loadingCategories.value = true;
  const response = await http.get("/categories");
  categories.value = response.data;
  loadingCategories.value = false;
}

const filteredCategories = computed(() => {
  return categories.value.filter((c) => c.type === type.value);
});

const onImageChange = () => {
  if (file.value) {
    const reader = new FileReader();
    reader.onload = (e) => {
      fileUrl.value = e.target.result;
    };
    reader.readAsDataURL(file.value);
  }
  // upload image to server
  uploadImageToServer();
};

async function uploadImageToServer() {
  if (!file.value) {
    return;
  }
  const formData = new FormData();
  formData.append('file', file.value, { headers: { 'Content-Type': 'multipart/form-data' } });
  const response = await http.post('/transactions/ocr', formData);
  return response.data.url;
}

async function addTransaction () {
  loadingSubmit.value = true;
  await store.addTransaction({
    label: name.value,
    description: description.value,
    amount: Number(amount.value),
    category: category.value,
    type: type.value,
    date: new Date(),
  });
  loadingSubmit.value = false;
  emit('close');
}

const apiKey = "AIzaSyDbSfgV4lL2o-rbQN5E1POuLxS8fz0LP5g";

// async function uploadImageToGoogleAI() {
//   if (!file.value) {
//     return;
//   }
//   const i = await convertToBase64(file.value);
//   const genAI = new GoogleGenerativeAI(apiKey);

//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//   const prompt = "Describe this image";
//   const image = {
//     inlineData: {
//       data: i,
//       mimeType: "image/webp",
//     },
//   };

//   const result = await model.generateContent([prompt, image]);
//   console.log(result.response.text());

// }

</script>

<style scoped>
</style>