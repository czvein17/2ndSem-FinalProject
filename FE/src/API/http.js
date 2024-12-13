// axiosInstance.js
import { QueryClient } from "@tanstack/react-query";
import axios from "axios";

export const queryClient = new QueryClient();

const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Add a response interceptor
http.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.error("API call error:", error.response);

    return Promise.reject(error);
  }
);

export default http;
