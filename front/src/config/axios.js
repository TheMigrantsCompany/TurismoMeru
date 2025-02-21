import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
if (!API_URL) {
  console.error("VITE_API_URL no está definida en el archivo .env");
}

console.log("Configurando API con URL:", API_URL); // Debug

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Agregar interceptor para debug
api.interceptors.request.use((request) => {
  console.log("Starting Request:", request.url);
  return request;
});

// Mejorar el interceptor para más detalles
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // La respuesta fue hecha y el servidor respondió con un código de estado
      // que cae fuera del rango 2xx
      console.error("Error de respuesta:", {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      console.error("Error de solicitud:", error.request);
    } else {
      // Algo sucedió al configurar la petición que provocó un error
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
