import axios, { AxiosInstance } from 'axios';

const instance: AxiosInstance = axios.create({
  baseURL: 'https://common-glass-server.vercel.app/api',
});


instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    console.log("Error de petició: ", error)
    return Promise.reject(error);
  }
);

export default instance;
