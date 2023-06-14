import { defineStore } from "pinia";
import http from "@/plugins/axios";

export const useAppStore = defineStore("app-store", {
  state: () => ({
    menu : [
      {
        subtitle: "Listado de usuarios",
        title: "Dashboard",
        icon: "$mdiViewDashboard",
        to: "/",
      },
      {
        subtitle: "Listado de usuarios",
        title: "Adm. de clientes",
        icon: "$mdiAccountGroupOutline",
        to: "/customer-manager",
      },
      {
        subtitle: 'Seguimiento de usuarios',
        title: 'Mapa de seguimiento',
        icon: '$mdiMapMarkerPath',
        to:'/seguimiento-de-usuarios'
      }
    ]
  }),
  getters: {
    getOptionsMenuSideBar: state => state.menu
  },
  actions: {
    async fetchGetListCustomers (payload) {
      const { data } = await http.get("/customer", payload)
      return data
    },
    async fetchGetOneCustomer (customerId) {
      const { data } = await http.get(`/customer/${customerId}`, {})
      return data
    },
    async fetchCreateCustomer (payload) {
      const { data } = await http.post(`/customer/`, payload)
      return data
    },
    async fetchEditCustomer (customerId, payload) {
      const { data } = await http.put(`/customer/${customerId}`, payload)
      return data
    },
    async fetchGetCustomeroOfSunat (document_number) {
      const { data } = await http.get(`/customer/search/sunat/${document_number}`, {})
      return data
    },
    async fetchCreateCustomerLocation (customerId, payload) {
      const { data } = await http.post(`/customer-location/`, { customerId, ...payload })
      return data
    },
  },
});
