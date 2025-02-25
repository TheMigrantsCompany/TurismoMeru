import axios from "axios";

// Configura la URL base de todas las llamadas de Axios
axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;
axios.defaults.headers.common["Content-Type"] = "application/json";

// Opcional: Agregar interceptores para manejar tokens o logging
axios.interceptors.request.use(
  (config) => {
    // Aquí podrías añadir un token de autenticación si es necesario
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Agregar interceptor para debug
axios.interceptors.request.use((request) => {
  console.log("Starting Request:", request.url);
  return request;
});

// Mejorar el interceptor para más detalles
axios.interceptors.response.use(
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

export default axios;
