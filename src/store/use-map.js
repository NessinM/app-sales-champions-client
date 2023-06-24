import { notify } from "@kyvg/vue3-notification";
import { defineStore } from "pinia";
import http from "@/plugins/axios";
import mapboxgl from "mapbox-gl";
// import { useTheme } from "vuetify/lib/framework.mjs";

// const theme = useTheme();

export const useMapStore = defineStore("map-store", {
  state: () => ({
    userLocation: [],
    map: undefined,
    markers: [],
    isLoadingFetchPlaces: false,
    places: [],
    distance: 0,
    duration: 0,
  }),
  getters: {
    isUserLocationReady: (state) => state.userLocation.length > 0,
    isMapReady: (state) => !!state.map,
    getInstanceGlobalMapbox: (state) => state.map,
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
    setInstanceGlobalMapbox(map) {
      this.map = map;
    },
    flyOnMap(center = [], zoom = 14) {
      if (!center.length)
        throw { message: "El valor de las coordenadas no es correcto." };

      this.map.flyTo({
        center,
        zoom,
      });
    },
    setPlaceMarkers(places = []) {
      this.markers.forEach((m) => m.remove());
      this.markers = [];

      if (!this.map) return;

      for (const place of places) {
        const [lng, lat] = place.center;

        const popupPlace = new mapboxgl.Popup({ closeOnClick: false })
          .setLngLat([lng, lat])
          .setHTML(
            `
              <strong>${place.text}</strong>
              <span class="text-slate-300">${place.place_name}</span>
            `
          )
          .addTo(this.map);

        const marker = new mapboxgl.Marker({
          color: "#e768a2",
          // color: theme.current.value.colors.primary,
        })
          .setLngLat([lng, lat])
          .setPopup(popupPlace)
          .addTo(this.map);

        this.markers.push(marker);
      }
    },
    async fetchSearchPlacesByTerm(payload) {
      this.isLoadingFetchPlaces = true;

      if (!payload.length || !this.userLocation.length) {
        this.isLoadingFetchPlaces = false;
        this.places = [];
        return;
      }

      const { data } = await http.API_MAP.get(
        `/geocoding/v5/mapbox.places/${payload}.json`,
        {
          params: {
            limit: 5,
            language: "es",
            proximity: this.userLocation.join(","),
          },
        }
      );

      if (data?.features.length) {
        this.places = data?.features;
      }

      this.isLoadingFetchPlaces = false;
    },
  },
});
