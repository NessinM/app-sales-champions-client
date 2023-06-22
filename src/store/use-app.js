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
        title: "Mapa central",
        icon: "$mdiMapMarkerPath",
        to: "/central-map",
      },
    ],
  }),
  getters: {
    getOptionsMenuSideBar: (state) => state.menu,
  },
  actions: {
    // customer
    async fetchGetListCustomers(payload = {}) {
      const { data } = await http.API_ROUTE.get("/customer/", payload);
      return data;
    },
    async fetchGetOneCustomer(customerId) {
      const { data } = await http.API_ROUTE.get(`/customer/${customerId}`, {});
      return data;
    },
    async fetchCreateCustomer(payload = {}) {
      const { data } = await http.API_ROUTE.post(`/customer`, payload);
      return data;
    },
    async fetchUpdateCustomer(customerId, payload = {}) {
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

    // location
    async fetchGetListCustomerLocations(customerId, payload = {}) {
      const { data } = await http.API_ROUTE.get("/customer-location/", {
        params: {
          customerId,
          ...payload,
        },
      });
      return data;
    },
    async fetchCreateCustomerLocation(customerId, payload = {}) {
      const { data } = await http.API_ROUTE.post(`/customer-location/`, {
        customerId,
        ...payload,
      });
      return data;
    },
    async fecthUpdateCustomerLocation(customerLocationId, payload = {}) {
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

    // conatact
    async fetchGetListCustomerContacts(customerId, payload = {}) {
      const { data } = await http.API_ROUTE.get("/customer-contact/", {
        params: {
          customerId,
          ...payload,
        },
      });
      return data;
    },
    async fetchCreateCustomerContact(customerId, payload = {}) {
      const { data } = await http.API_ROUTE.post(`/customer-contact/`, {
        customerId,
        ...payload,
      });
      return data;
    },
    async fecthUpdateCustomerContact(customerContactId, payload = {}) {
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

    //event

    async fetchGetListEvents(payload = {}) {
      const { data } = await http.API_ROUTE.get("/event", payload);
      return data;
    },
    async fetchGetOneEvent(eventId) {
      const { data } = await http.API_ROUTE.get(`/event/${eventId}`, {});
      return data;
    },
    async fetchCreateEvent(payload = {}) {
      const fecha_inicio = new Date(payload.fecha_inicio);
      const fecha_final = new Date(payload.fecha_inicio);
      console.log("fecha_inicio", fecha_inicio);
      console.log("fecha_final", fecha_final);
      const { data } = await http.API_ROUTE.post("/event", payload);
      return data;
    },
    async fetchUpdateEvent(eventId, payload = {}) {
      const { data } = await http.API_ROUTE.put(`/event/${eventId}`, payload);
      return data;
    },
  },
});
