import { notify } from "@kyvg/vue3-notification";
import { defineStore } from "pinia";

export const useMapStore = defineStore("map-store", {
  state: () => ({
    userLocation: [],
    map: undefined,
    markers:[],
    distance:0,
    duration:0
  }),
  getters: {
    isUserLocationReady: (state) => state.userLocation.length > 0,
    isMapReady: (state) => !!state.map,
    getInstanceGlobalMapbox :  (state) => state.map
  },
  actions: {
    checkInitialCurrentLocation() {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
        },
        (error) => {
          notify({ type: "error", text: error.message });
        }
      );
    },
    setInstanceGlobalMapbox (map) {
      this.map = map
    }
  },
});
