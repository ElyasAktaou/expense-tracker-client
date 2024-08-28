import axios from 'axios';
console.log(import.meta.env.VITE_API_URL);
const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});

export default http;