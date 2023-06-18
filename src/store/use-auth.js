import { defineStore } from "pinia";
import http from "@/plugins/axios";
import { useCookies } from "@vueuse/integrations/useCookies";

const cookies = useCookies(["locale"]);

export const useAuthStore = defineStore("auth-store", {
  state: () => ({
    __ATkn: cookies.get("__ATkn"),
    __RTkn: cookies.get("__RTkn"),
    __LGin: cookies.get("__LGin"),
  }),
  getters: {
    getSessionUserLogged: (state) => state.__LGin,
  },
  actions: {
    async fetchHandleLogin(payload) {
      await http.API_ROUTE.post("/auth/login", payload);
    },
    async fetchHandleLogout() {
      await http.API_ROUTE.get("/auth/logout");
    },
    async fetchHandleUserRegister(payload) {
      const response = await http.API_ROUTE.post("/auth/register", payload);
      console.log("response -> fetchHandleUserRegister", response);
    },
    async fetchHandleGetRefreshToken() {
      const response = await http.API_ROUTE.get("/auth/refresh", {});
      console.log("response -> fetchHandleGetRefreshToken", response);
    },
  },
});
