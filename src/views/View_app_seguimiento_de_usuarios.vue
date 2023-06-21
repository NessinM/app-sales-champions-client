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
.h-full.w-full(v-if="isUserLocationReady")
  strong Renderizar el mapa de mapbox - {{ userLocation }}
</template>
<script>
import { defineComponent } from "vue";
import { usePlaceStore } from "@/store";
export default defineComponent({
  name: "ViewAppSeguimientoDeUsuarios",
  setup() {
    const { isUserLocationReady, userLocation } = usePlaceStore();
    return {
      userLocation,
      isUserLocationReady,
    };
  },
});
</script>
