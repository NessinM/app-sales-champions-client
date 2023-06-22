<template lang="pug">
#map-box-geocom.h-full.w-full.relative(v-if="isUserLocationReady")
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
        container: document.getElementById("map-box-geocom"), // container ID
        style: "mapbox://styles/mapbox/streets-v12", // style URL
        // style: "mapbox://styles/mapbox/dark-v9", // style URL
        center: userLocation.value, // starting position [lng, lat]
        zoom: 13, // starting zoom
      });

      const size = 200;

      // This implements `StyleImageInterface`
      // to draw a pulsing dot icon on the map.
      const pulsingDot = {
        width: size,
        height: size,
        data: new Uint8Array(size * size * 4),

        // When the layer is added to the map,
        // get the rendering context for the map canvas.
        onAdd: function () {
          const canvas = document.createElement("canvas");
          canvas.width = this.width;
          canvas.height = this.height;
          this.context = canvas.getContext("2d");
        },

        // Call once before every frame where the icon will be used.
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

      // new mapboxgl.Popup({ closeOnClick: false })
      //   .setLngLat(userLocation.value)
      //   .setHTML(
      //     `
      //     <div class="flex flex-col justify-center items-center">
      //         <div class="!z-5 relative flex flex-col rounded-[20px] max-w-[300px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 flex flex-col w-full !p-4 3xl:p-![18px] bg-white undefined">
      //             <div class="h-full w-full">
      //                 <div class="relative w-full">
      //                     <img src="https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/Nft3.3b3e6a4b3ada7618de6c.png" class="mb-3 h-full w-full rounded-xl 3xl:h-full 3xl:w-full" alt="">
      //                     <button class="absolute top-3 right-3 flex items-center justify-center rounded-full bg-white p-2 text-brand-500 hover:cursor-pointer">
      //                         <div class="flex h-full w-full items-center justify-center rounded-full text-xl hover:bg-gray-50">
      //                             <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="32" d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0018 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81z"></path></svg>
      //                         </div>
      //                     </button>
      //                 </div>
      //                 <div class="mb-3 flex items-center justify-between px-1 md:items-start">
      //                     <div class="mb-2">
      //                         <p class="text-lg font-bold text-navy-700"> Abstract Colors </p>
      //                         <p class="mt-1 text-sm font-medium text-gray-600 md:mt-2">By Esthera Jackson </p>
      //                     </div>
      //                     <div class="flex flex-row-reverse md:mt-2 lg:mt-0">
      //                         <span class="z-0 ml-px inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#E0E5F2] text-xs text-navy-700 ">+5</span><span class="z-10 -mr-3 h-8 w-8 rounded-full border-2 border-white">
      //                             <img class="h-full w-full rounded-full object-cover" src="https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/avatar1.eeef2af6dfcd3ff23cb8.png" alt="">
      //                         </span>
      //                         <span class="z-10 -mr-3 h-8 w-8 rounded-full border-2 border-white">
      //                             <img class="h-full w-full rounded-full object-cover" src="https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/avatar2.5692c39db4f8c0ea999e.png" alt="">
      //                         </span>
      //                         <span class="z-10 -mr-3 h-8 w-8 rounded-full border-2 border-white">
      //                             <img class="h-full w-full rounded-full object-cover" src="https://horizon-tailwind-react-git-tailwind-components-horizon-ui.vercel.app/static/media/avatar3.9f646ac5920fa40adf00.png" alt="">
      //                         </span>
      //                     </div>
      //                 </div>
      //                 <div class="flex items-center justify-between md:items-center lg:justify-between ">
      //                     <div class="flex">
      //                         <p class="!mb-0 text-sm font-bold text-brand-500">Current Bid: 0.91 <span>ETH</span></p>
      //                     </div>
      //                     <button href="" class="linear rounded-[20px] bg-brand-900 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700">Place Bid</button>
      //                 </div>
      //             </div>
      //         </div>
      //     </div>
      //   `
      //   )
      //   .addTo(instanceMap);

      // new mapboxgl.Marker({
      //   color: theme.current.value.colors.primary,
      // })
      //   .setLngLat(userLocation.value)
      //   .setPopup(popupCurrentLocation)
      //   .addTo(instanceMap);

      instanceMap.on("mouseenter", "places", (e) => {
        // Change the cursor style as a UI indicator.
        instanceMap.getCanvas().style.cursor = "pointer";

        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
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
