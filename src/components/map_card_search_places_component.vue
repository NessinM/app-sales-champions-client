<template lang="pug">
v-card(
  v-click-outside="{ handler: onClickedOutside, include }",
  width="350",
  elevation="3",
  hover
)
  .flex.pa-1
    v-text-field.pa-0(
      ref="searchTermRef",
      v-model="searchTerm",
      hide-details="",
      prepend-inner-icon="$mdiLayersSearch",
      single-line="",
      flat="",
      density="compact",
      variant="solo",
      color="primary",
      placeholder="Ingrese un texto para buscar",
      @update:focused="isShowListPlaces = true"
    )
    v-divider.ma-1(vertical)
    v-btn.mr-2(icon="", size="small", variant="text")
      v-icon(icon="$mdiDirections", size="25")
  v-progress-linear(
    :color="isLoadingFetchPlaces ? 'primary' : 'white'",
    indeterminate="",
    rounded="",
    height="3"
  )
  v-divider(v-if="isShowListPlaces && places.length")
  v-list(v-if="isShowListPlaces && places.length")
    v-list-item.py-0(
      v-for="(p, index) in places",
      :key="index",
      active-class="bg-primary",
      @click="onClikedPlace(p)"
    )
      template(#prepend)
        v-icon(icon="$mdiMapMarker", color="grey")
      v-list-item-title
        span.font-extrabold.text-xs
          | {{ p.text_es }}
        span.font-normal.text-xs
          | {{ p.place_name_es.replace(p.text_es, "") }}
</template>
<script>
import { computed, defineComponent, ref, watch } from "vue";
import { useMapStore } from "@/store";
import { notify } from "@kyvg/vue3-notification";
import { storeToRefs } from "pinia";
export default defineComponent({
  name: "MapSearchPlaceComponent",
  setup() {
    const mapStore = useMapStore();
    const { places, isLoadingFetchPlaces } = storeToRefs(mapStore);

    const searchValue = ref("");
    const debouncedTimeout = ref();
    const searchTermRef = ref("");
    const isShowListPlaces = ref(true);

    watch(places, (newPlaces) => {
      mapStore.setPlaceMarkers(newPlaces);
      searchTermRef.value.focus();
    });

    const onClickedOutside = () => {
      isShowListPlaces.value = false;
    };

    const onClikedPlace = (place) => {
      const { center } = place;
      try {
        isShowListPlaces.value = false;
        mapStore.flyOnMap(center, 16);
      } catch (error) {
        notify({ type: "error", text: error.message });
      }
    };

    const searchTerm = computed({
      get() {
        return searchValue.value;
      },
      set(val) {
        if (debouncedTimeout.value) clearTimeout(debouncedTimeout.value);

        debouncedTimeout.value = setTimeout(async () => {
          searchValue.value = val;
          try {
            await mapStore.fetchSearchPlacesByTerm(searchValue.value);
          } catch (error) {
            notify({ type: "error", text: error.mesdage });
          }
        }, 200);
      },
    });

    return {
      places,
      searchValue,
      searchTerm,
      isLoadingFetchPlaces,
      isShowListPlaces,
      onClikedPlace,
      onClickedOutside,
      searchTermRef,
    };
  },
});
</script>
