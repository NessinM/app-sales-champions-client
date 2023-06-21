<template lang="pug">
v-dialog(
  :model-value="!isUserLocationReady",
  :scrim="false",
  persistent="",
  width="auto"
)
  v-card(color="primary")
    v-card-text
      small.font-bold Obteniendo localización ....
      v-progress-linear.my-2(indeterminate="", color="white")
.h-full.w-full.relative(v-if="isUserLocationReady" id='map-box-geocom')
  v-card( class='!absolute top-5 !left-5 !z-10' width="350")
    .flex.pa-1
      v-text-field.pa-0.ma-a(hide-details='' prepend-inner-icon='$mdiLayersSearch'  single-line='' flat="" density="compact" variant="solo"  color="primary" placeholder="Ingrese un texto para buscar")
      v-divider.ma-1(vertical)
      v-btn.mr-2(icon='' size="small" variant="text")
        v-icon(icon="$mdiDirections" size="25")
  v-btn.top-5.right-5.z-10(
    v-if="isButtonCurrentLocationIsReady"
    icon="$mdiCrosshairsGps",
    color="primary",
    variant="elevated",
    class='!absolute',
    @click='flyCurrentLocation()'
  )

</template>
<script>
import { computed, defineComponent, onMounted } from "vue";
import { useMapStore } from "@/store";
import mapboxgl from "mapbox-gl";
import { notify } from "@kyvg/vue3-notification";
import { useTheme } from "vuetify/lib/framework.mjs";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "ViewAppSeguimientoDeUsuarios",
  setup() {
    const theme = useTheme()
    const mapStore = useMapStore();
    const { map, userLocation, isUserLocationReady, isMapReady }  = storeToRefs(mapStore)

    const initMap = () => {
      const instanceMapbox = new mapboxgl.Map({
        container: document.getElementById('map-box-geocom'), // container ID
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        center: userLocation.value, // starting position [lng, lat]
        zoom: 13, // starting zoom
      });

      instanceMapbox.on('load', () => {
        instanceMapbox.setFog({"range":[0.5,10],"color":"hsl(0, 0%, 100%)","high-color":["interpolate",["exponential",1.2],["zoom"],0,"hsl(207, 100%, 50%)",8,"hsl(38, 63%, 84%)"],"space-color":["interpolate",["exponential",1.2],["zoom"],5.5,"hsl(240, 46%, 11%)",6,"hsl(199, 61%, 87%)"],"horizon-blend":["interpolate",["exponential",1.2],["zoom"],5.5,0.05,6,0.1],"star-intensity":["interpolate",["exponential",1.2],["zoom"],5.5,0.1,6,0]});
      })

      const popupCurrentLocation = new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat(userLocation.value)
        .setHTML('<h1>Hello World!</h1>')
        .addTo(instanceMapbox);

      new mapboxgl.Marker({
        color: theme.current.value.colors.primary,
        })
        .setLngLat(userLocation.value)
        .setPopup(popupCurrentLocation)
        .addTo(instanceMapbox);

        mapStore.setInstanceGlobalMapbox(instanceMapbox)
    }

    onMounted(() => {
      if (isUserLocationReady.value) return initMap()
      notify({ type: 'error', text: 'La localizacion todavia no esta lista'})
    })

    const flyCurrentLocation = () => {
      console.log('map', map.value)
      map.value.flyTo({
        center: userLocation.value,
        zoom: 14
      })
    }

    const isButtonCurrentLocationIsReady = computed(() => isUserLocationReady.value && isMapReady.value)

    return {
      userLocation,
      isUserLocationReady,
      flyCurrentLocation,
      isButtonCurrentLocationIsReady
    };
  },
});
</script>
