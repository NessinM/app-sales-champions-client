import axios from "axios";
import { enviroments } from "@/helps/constants";
// import { connectionError, validationError } from "@/helps/errors";

const API_ROUTE = axios.create({
  baseURL: enviroments.API_ROUTE,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },
});

const API_UPLOAD = axios.create({
  baseURL: enviroments.API_ROUTE_UPLOAD,
  withCredentials: false,
  headers: {
    Accept: "multipart/form-data",
    "Content-Type": "multipart/form-data",
    "Access-Control-Allow-Origin": "*"
  },
});

API_ROUTE.interceptors.response.use(({ data }) => Promise.resolve(data),
async ({ response, config }) => {
  const { data } = response
  const originalConfig = config;

  if (response?.status === 307) {
    window.location.reload()
    return
  }

  if (response?.status === 401 && !originalConfig._retry) {
    try {
      originalConfig._retry = true
      await API_ROUTE.get("/auth/refresh")
      axios(originalConfig)
    } catch (error) {
      return Promise.reject(error)
    }
  } else {
    return Promise.reject(data)
  }
})

export default { API_ROUTE, API_UPLOAD };
