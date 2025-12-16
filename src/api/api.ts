
import axios, { AxiosInstance } from "axios";

// Puedes colocar aquí la URL base de tu API (por ejemplo la de AWS)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://44.197.239.208:8000/api";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
