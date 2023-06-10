<template lang="pug">
.h-screen.mx-auto.w-full.relative
  v-dialog(v-model="dialog", width="500")
    v-card.pa-4
      v-card-title.text-sm
        strong Use Google's location service?
      v-card-text
        small Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
      v-card-actions
        v-spacer
        v-btn(color="green-darken-1", variant="text", @click="dialog = false")
          small.text-xs Disagree
        v-btn(
          color="primary",
          variant="elevated",
          densidy="compact",
          @click="dialog = false"
        )
          small.text-xs.is-bold continuar
  v-card.z-10.flex.pa-1(v-if="showFilters", height="100", rounded="0")
    v-slide-group.flex.justify-center.align-center.pa-1(
      v-model="model",
      selected-class="bg-primary",
      show-arrows,
      @update:model-value="getModelValue"
    )
      v-slide-group-item(
        v-for="n in visitas",
        :key="n",
        v-slot="{ isSelected, toggle, selectedClass }"
      )
        v-card.pa-3(
          color="background",
          :class="['ma-1', selectedClass]",
          height="80",
          width="130",
          @click="toggle"
        )
          .flex.justify-center.align-center.flex-column
            v-scale-transition(v-if="isSelected")
              v-avatar(size="35", color="white")
                v-icon(color="primary", size="20", icon="$mdiCheck")
            v-scale-transition(v-else)
              v-avatar(size="35")
                v-img(:src="n.foto", alt="John")
            strong.text-subtitle.text-xs.mt-1 {{ n.nombre }}
  v-card.absolute.z-10.p-2.card-filter(
    :class="showFilters ? 'hidden-visibility-filters' : 'show-visibility-filters'",
    width="130",
    rounded="0",
    @click="changeVisibilityFilters"
  )
    v-icon(
      color="primary",
      size="25",
      :icon="!showFilters ? '$mdiChevronDown' : '$mdiChevronUp'"
    )
    strong.text-xs.text-primary Ocultar filtros

  v-card#mapid.text-xs.font-bold.w-full.h-full(color="background", rounded="0")
    //- :class="showFilters ? 'map' : 'map-full'"
</template>
<script>
import { defineComponent, onMounted, ref } from "vue";
import "leaflet/dist/leaflet.css";
import leaflet from "leaflet";
export default defineComponent({
  name: "ViewAppSeguimientoDeUsuarios",
  setup() {
    let mapp;
    let model = ref(null);
    let dialog = ref(false);
    let showFilters = ref(false);
    let LeafIcon = leaflet.Icon.extend({
      options: {
        iconSize: [35, 50],
      },
    });
    const visitas = [
      {
        id: 1,
        lat: -12.042678,
        lng: -77.02961,
        foto: "https://source.unsplash.com/random/800x800/?img=1",
        nombre: "Juan nuñez solis",
        iconMarker: "marker-1.png",
      },
      {
        id: 2,
        lat: -12.121188,
        lng: -77.02941,
        foto: "https://source.unsplash.com/random/800x800/?img=1",
        nombre: "Mari ortiz valencia",
        iconMarker: "marker-1.png",
      },
      {
        id: 3,
        lat: -12.05913,
        lng: -77.100334,
        foto: "https://source.unsplash.com/random/800x800/?img=1",
        nombre: "Pedro gallese",
        iconMarker: "marker-1.png",
      },
      {
        id: 4,
        lat: -12.024882,
        lng: -76.890907,
        foto: "https://source.unsplash.com/random/800x800/?img=1",
        nombre: "Nesyn alvarado",
        iconMarker: "marker-1.png",
      },
    ];

    let overlays = {};
    let basemaps = {
      OpenStreetMaps: leaflet.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          minZoom: 2,
          maxZoom: 19,
          id: "osm.streets",
        }
      ),
      "Google-Map": leaflet.tileLayer(
        "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
        {
          minZoom: 2,
          maxZoom: 20,
          id: "google.street",
        }
      ),
      "Google-Satellite": leaflet.tileLayer(
        "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
        {
          minZoom: 2,
          maxZoom: 19,
          id: "google.satellite",
        }
      ),
      "Google-Hybrid": leaflet.tileLayer(
        "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
        {
          minZoom: 2,
          maxZoom: 19,
          id: "google.hybrid",
        }
      ),
    };

    let mapOptions = {
      zoomControl: false,
      attributionControl: false,
      center: [-12.042678, -77.02961],
      zoom: 11.5,
      layers: [basemaps["Google-Map"]],
      // layers: [basemaps["OpenStreetMaps"]],
    };

    const getModelValue = (positionSlider = -1) => {
      if (positionSlider >= 0) {
        let { lat, lng } = visitas[positionSlider];
        mapp.setView([lat, lng], 20);
      } else {
        mapp.setView(mapOptions.center, mapOptions.zoom);
      }
    };

    const getDataTooltip = (content) => {
      console.log("click data tooltip", content);
      dialog.value = true;
    };

    const changeVisibilityFilters = () => {
      showFilters.value = !showFilters.value;
    };

    const getStaredMapLeaflet = () => {
      mapp = leaflet.map("mapid", mapOptions);

      leaflet.control
        .zoom({
          zoomInText: '<span aria-hidden="true"> + </span>',
          zoomOutText: '<span aria-hidden="true">&#x2212;</span>',
          zoomInTitle: "Holaaa",
          position: "topleft",
        })
        .addTo(mapp);
      leaflet.control
        .layers(basemaps, overlays, {
          position: "topright",
          collapsed: true,
        })
        .addTo(mapp);

      for (let i = 0; i < visitas.length; i++) {
        const e = visitas[i];
        leaflet
          .marker([e.lat, e.lng], {
            icon: new LeafIcon({ iconUrl: `../../src/assets/${e.iconMarker}` }),
          })
          .addTo(mapp)
          .bindTooltip(
            `
        <div class="pa-2 text-sm">
          <div class="text-sm text-primary font-bold">
            <strong>${e.nombre}</strong>
          </div>
          <span class="text-xs text-grey" >
            se encuentra el cliente
          </span>
        </div>`
          )
          .on("click", getDataTooltip);
        leaflet
          .circle([e.lat, e.lng], {
            color: "#7556f4",
            fillColor: "#7556f4",
            fillOpacity: 0.5,
            radius: 50,
          })
          .addTo(mapp);
      }

      //Handle Map click to Display Lat/Lng
      mapp.on("click", (e) => {
        console.log("click get datos posicion del mapa", e);
      });

      mapp.setView(mapOptions.center, mapOptions.zoom);
    };

    onMounted(getStaredMapLeaflet);

    return {
      mapp,
      model,
      visitas,
      getModelValue,
      dialog,
      showFilters,
      changeVisibilityFilters,
    };
  },
});
</script>
