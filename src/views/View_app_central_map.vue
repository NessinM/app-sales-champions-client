<template lang="pug">
#map-box-central.h-full.w-full.relative(v-if="isUserLocationReady")
  v-map-card-search-places(class="!absolute !left-5 !z-10 !top-5")
  v-map-button-current-location(class="!absolute !right-5 !z-10 !top-5")
v-dialog(
  v-else,
  :model-value="true",
  :scrim="false",
  persistent="",
  width="auto"
)
  v-card(color="primary")
    v-card-text
      small.font-bold Obteniendo localización ....
      v-progress-linear.my-2(indeterminate="", color="white")
</template>
<script>
import { defineComponent, onMounted } from "vue";
import { useMapStore } from "@/store";
import mapboxgl from "mapbox-gl";
import { notify } from "@kyvg/vue3-notification";
import { useTheme } from "vuetify/lib/framework.mjs";
import { storeToRefs } from "pinia";
import CardSearchPlacesInMap from "@/components/map_card_search_places_component.vue";
import ButtonSetCurrentLocation from "@/components/map_button_set_current_location_component.vue";
export default defineComponent({
  name: "ViewAppSeguimientoDeUsuarios",
  components: {
    "v-map-card-search-places": CardSearchPlacesInMap,
    "v-map-button-current-location": ButtonSetCurrentLocation,
  },
  setup() {
    const theme = useTheme();
    const mapStore = useMapStore();
    const { userLocation, isUserLocationReady } = storeToRefs(mapStore);

    const initMap = () => {
      const instanceMap = new mapboxgl.Map({
        container: document.getElementById("map-box-central"), // container ID
        style: "mapbox://styles/mapbox/streets-v12", // style URL
        // style: "mapbox://styles/mapbox/dark-v9", // style URL
        center: userLocation.value, // starting position [lng, lat]
        zoom: 13, // starting zoom
      });

      const size = 200;

      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),
        onAdd: function () {
          const canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext("2d");
        },
        render: function () {
          const duration = 800;
          const t = (performance.now() % duration) / duration;

          const radius = (size / 2) * 0.3;
          const outerRadius = (size / 2) * 0.7 * t + radius;
          const context = this.context;

          // Draw the outer circle.
          context.clearRect(0, 0, this.width, this.height);
          context.beginPath();
          context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
          );

          // covert HEX t rgba
          let hex = theme.current.value.colors.primary;
          let values = hex.match(/\w\w/g);
          let [r, g, b] = values.map((k) => parseInt(k, 16));

          context.fillStyle = `rgba(${r}, ${g}, ${b}, ${1 - t})`;
          // context.fillStyle = `${convertColorHexToRgba}, ${1 - t})`;
          context.fill();

          // Draw the inner circle.
          context.beginPath();
          context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
          // context.fillStyle = "rgba(255, 100, 100, 1)";
          context.fillStyle = theme.current.value.colors.primary;
          context.strokeStyle = "white";
          context.lineWidth = 2 + 4 * (1 - t);
          context.fill();
          context.stroke();

          // Update this image's data with data from the canvas.
          this.data = context.getImageData(0, 0, this.width, this.height).data;

          // Continuously repaint the map, resulting
          // in the smooth animation of the dot.
          instanceMap.triggerRepaint();

          // Return `true` to let the map know that the image was updated.
          return true;
        },
      };

      instanceMap.on("load", () => {
        instanceMap.setFog({
          range: [0.5, 10],
          color: "hsl(0, 0%, 100%)",
          "high-color": [
            "interpolate",
            ["exponential", 1.2],
            ["zoom"],
            0,
            "hsl(207, 100%, 50%)",
            8,
            "hsl(38, 63%, 84%)",
          ],
          "space-color": [
            "interpolate",
            ["exponential", 1.2],
            ["zoom"],
            5.5,
            "hsl(240, 46%, 11%)",
            6,
            "hsl(199, 61%, 87%)",
          ],
          "horizon-blend": [
            "interpolate",
            ["exponential", 1.2],
            ["zoom"],
            5.5,
            0.05,
            6,
            0.1,
          ],
          "star-intensity": [
            "interpolate",
            ["exponential", 1.2],
            ["zoom"],
            5.5,
            0.1,
            6,
            0,
          ],
        });

        instanceMap.addImage("pulsing-dot", pulsingDot, { pixelRatio: 2 });

        instanceMap.addSource("dot-point", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: [
              {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: userLocation.value, // icon position [lng, lat]
                },
              },
            ],
          },
        });
        instanceMap.addLayer({
          id: "layer-with-pulsing-dot",
          type: "symbol",
          source: "dot-point",
          layout: {
            "icon-image": "pulsing-dot",
          },
        });
      });

      instanceMap.on("mouseenter", "places", (e) => {
        instanceMap.getCanvas().style.cursor = "pointer";
        const coordinates = e.features[0].geometry.coordinates.slice();
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
      });

      mapStore.setInstanceGlobalMapbox(instanceMap);
    };

    onMounted(() => {
      if (isUserLocationReady.value) return initMap();
      notify({ type: "error", text: "La localizacion todavia no esta lista" });
    });

    return {
      userLocation,
      isUserLocationReady,
    };
  },
});
</script>
