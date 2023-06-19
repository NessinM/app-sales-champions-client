import { defineStore } from "pinia";
import http from "@/plugins/axios";

export const useAppStore = defineStore("app-store", {
  state: () => ({
    menu: [
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
        subtitle: "Programacion de visita",
        title: "Programacion de visita",
        icon: "$mdiCalendarBadgeOutline",
        to: "/event-manager",
      },
      {
        subtitle: "Seguimiento de usuarios",
        title: "Mapa de seguimiento",
        icon: "$mdiMapMarkerPath",
        to: "/seguimiento-de-usuarios",
      },
    ],
  }),
  getters: {
    getOptionsMenuSideBar: (state) => state.menu,
  },
  actions: {
    async fetchGetListCustomers(payload) {
      const { data } = await http.API_ROUTE.get("/customer/", payload);
      return data;
    },
    async fetchGetOneCustomer(customerId) {
      const { data } = await http.API_ROUTE.get(`/customer/${customerId}`, {});
      return data;
    },
    async fetchCreateCustomer(payload) {
      const { data } = await http.API_ROUTE.post(`/customer/`, payload);
      return data;
    },
    async fetchUpdateCustomer(customerId, payload) {
      const { data } = await http.API_ROUTE.put(
        `/customer/${customerId}`,
        payload
      );
      return data;
    },
    async fetchGetCustomerOfSunat(document_number) {
      const { data } = await http.API_ROUTE.get(
        `/customer/search/sunat/${document_number}`,
        {}
      );
      return data;
    },
    async fetchCreateCustomerLocation(customerId, payload) {
      const { data } = await http.API_ROUTE.post(`/customer-location/`, {
        customerId,
        ...payload,
      });
      return data;
    },
    async fecthUpdateCustomerLocation(customerLocationId, payload) {
      const { data } = await http.API_ROUTE.put(
        `/customer-location/${customerLocationId}`,
        payload
      );
      return data;
    },
    async fetchGetOneCustomerLocation(customerLocationId) {
      const { data } = await http.API_ROUTE.get(
        `/customer-location/${customerLocationId}`,
        {}
      );
      return data;
    },
    async fetchCreateCustomerContact(customerId, payload) {
      const { data } = await http.API_ROUTE.post(`/customer-contact/`, {
        customerId,
        ...payload,
      });
      return data;
    },
    async fecthUpdateCustomerContact(customerContactId, payload) {
      const { data } = await http.API_ROUTE.put(
        `/customer-contact/${customerContactId}`,
        payload
      );
      return data;
    },
    async fetchGetOneCustomerContact(customerContactId) {
      const { data } = await http.API_ROUTE.get(
        `/customer-contact/${customerContactId}`,
        {}
      );
      return data;
    },
    async fetchGetListEvents(payload) {
      const { data } = await http.API_ROUTE.get("/event/", payload);
      return data;
    },
  },
});
