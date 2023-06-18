import axios from "axios";
import { enviroments } from "@/helps/constants";
// import { useAuthStore } from '@/store'
// import { connectionError, validationError } from "@/helps/errors";

// const { fetchHandleLogout } = useAuthStore()

const API_ROUTE = axios.create({
  baseURL: enviroments.API_ROUTE,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

const API_UPLOAD = axios.create({
  baseURL: enviroments.API_ROUTE_UPLOAD,
  withCredentials: false,
  headers: {
    Accept: "multipart/form-data",
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*",
  },
});

API_ROUTE.interceptors.response.use(
  (response) => {
    const data = response?.data;
    return Promise.resolve(data);
  },
  async (error) => {
    const originalConfig = error.config;
    if (
      error.response &&
      error.response.status === 307 &&
      !originalConfig._retry
    ) {
      window.location.reload();
      return;
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalConfig._retry
    ) {
      originalConfig._retry = true;
      try {
        await API_ROUTE.get("/auth/refresh");
        const { data } = await axios(originalConfig);
        return data;
      } catch (_error) {
        return Promise.reject(_error);
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default { API_ROUTE, API_UPLOAD };
