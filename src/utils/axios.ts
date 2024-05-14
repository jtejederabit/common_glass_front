import axios, { AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
});


instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Error de petició: ", error)
    return Promise.reject(error);
  }
);

export default instance;
