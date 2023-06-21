import { notify } from "@kyvg/vue3-notification";
import { defineStore } from "pinia";

export const usePlaceStore = defineStore("upload-places", {
  state: () => ({
    userLocation: [],
  }),
  getters: {
    isUserLocationReady: (state) => state.userLocation.length > 0,
  },
  actions: {
    getInitialLocation() {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [coords.longitude, coords.latitude];
        },
        (error) => {
          notify({ type: "error", text: error.message });
        }
      );
    },
  },
});
