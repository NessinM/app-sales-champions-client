<template lang="pug">
v-btn(
  v-if="isButtonCurrentLocationIsReady",
  icon="$mdiCrosshairsGps",
  color="primary",
  variant="elevated",
  @click="flyCurrentLocation()"
)
</template>
<script>
import { computed, defineComponent } from "vue";
import { useMapStore } from "@/store";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "MapButtonSetCurrentLocationComponent",
  setup() {
    const mapStore = useMapStore();
    const { map, userLocation, isUserLocationReady, isMapReady } =
      storeToRefs(mapStore);

    const flyCurrentLocation = () => {
      map.value.flyTo({
        center: userLocation.value,
        zoom: 14,
      });
    };
    const isButtonCurrentLocationIsReady = computed(
      () => isUserLocationReady.value && isMapReady.value
    );

    return {
      flyCurrentLocation,
      isButtonCurrentLocationIsReady,
    };
  },
});
</script>
