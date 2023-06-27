import { defineStore } from "pinia";
import http from "@/plugins/axios";
import { enviroments } from "@/helps/constants";

export const useUploadStore = defineStore("upload-store", {
  state: () => ({}),
  getters: {},
  actions: {
    async fetchSaveImageCustomersLocation(user, file) {
      // const app = enviroments.API_UPLOAD.toLowerCase()
      const app = enviroments.APP_NAME.toLowerCase();
      let params = {
        app,
        empresa: "datacont",
        carpeta: `imagenes-ubicaciones-cliente`,
        usuario: user,
      };

      let form = new FormData();
      form.append("file", file);

      const { data } = await http.API_UPLOAD.post("", form, { params });
      return data;
    },
  },
});
