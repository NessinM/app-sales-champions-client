<template lang="pug">
perfect-scrollbar.flex.flex-col.overflow-y-auto(
  :class="isMobile ? 'h-[calc(100vh-56px)]' : 'h-screen'"
)
  .sticky.top-0.z-10(:class="{ 'bg-primary elevation-3': isMobile }")
    .flex.items-center.py-2.justify-center
      .flex.ml-2
        v-btn.mx-1(
          icon="$mdiChevronLeft",
          size="small",
          @click="moveDirectionCalendary('prev')"
        )
        v-btn.mx-1(
          icon="$mdiChevronRight",
          size="small",
          @click="moveDirectionCalendary('next')"
        )
      h2.ml-2.text-xl.font-extrabold.leading-none(
        :class="{ '!text-sm': isMobile }"
      ) {{ titleForDate }}
      v-spacer
      v-autocomplete.mx-2(
        v-if="isMobile",
        v-model="type",
        :items="types",
        label="",
        variant="outlined",
        density="compact",
        color="white",
        item-title="nombre",
        item-value="value",
        hide-details,
        @update:model-value="setDatesByTypeCalendary()"
      )
      v-btn-toggle.mx-2.elevation-1(
        v-else,
        v-model="type",
        rounded="xl",
        color="primary",
        variant="elevated",
        bg-color="background",
        group="",
        density="compact",
        @click="setDatesByTypeCalendary()"
      )
        v-btn(
          v-for="(t, index) in types",
          :key="index",
          :value="t.value",
          size="small"
        )
          span.font-extrabold.text-xs {{ t.nombre }}
    .grid.grid-cols-7.text-center.py-4(
      v-if="type === 'month' || type === 'week'",
      :class="{ '!grid-cols-5': !showSundayAndSaturday }"
    )
      .pl-1.text-md.font-extrabold(
        v-if="showSundayAndSaturday && type === 'month'",
        :class="{ '!text-xs': isMobile }"
      ) {{ isMobile ? "Dom." : "Domingo" }}
      .pl-1.text-md.font-extrabold(:class="{ '!text-xs': isMobile }") {{ isMobile ? "Lun." : "Lunes" }}
      .pl-1.text-md.font-extrabold(:class="{ '!text-xs': isMobile }") {{ isMobile ? "Mar." : "Martes" }}
      .pl-1.text-md.font-extrabold(:class="{ '!text-xs': isMobile }") {{ isMobile ? "Mie." : "Miercoles" }}
      .pl-1.text-md.font-extrabold(:class="{ '!text-xs': isMobile }") {{ isMobile ? "Jue." : "Jueves" }}
      .pl-1.text-md.font-extrabold(:class="{ '!text-xs': isMobile }") {{ isMobile ? "Vie." : "Viernes" }}
      .pl-1.text-md.font-extrabold(
        v-if="showSundayAndSaturday",
        :class="{ '!text-xs': isMobile }"
      )
        | {{ isMobile ? "Sab." : "Sabado" }}
      .pl-1.text-md.font-extrabold(
        v-if="showSundayAndSaturday && type === 'week'",
        :class="{ '!text-xs': isMobile }"
      )
        | {{ isMobile ? "Dom." : "Domingo" }}
  .grid.flex-grow.w-full.gap-px.pt-px(
    :class="{ 'grid-cols-5 bg-slate-200': !showSundayAndSaturday, 'grid-cols-7 bg-slate-200': showSundayAndSaturday, '!grid-cols-1': type === 'day' }"
  )
    item-day-of-calendary(v-for="(i, index) in dates", :key="index", :day="i")
</template>
<script>
import { computed, defineComponent, onMounted } from "vue";
import { useCalendarStore } from "@/store";
import { storeToRefs } from "pinia";
// import moment from "moment";
import ItemDayOfCalendary from "@/components/item_day_calendary_component.vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
// import BaseCalendaryView from "@/components/base_calendary_view_component.vue";
export default defineComponent({
  name: "ViewAppEventManager",
  components: {
    "item-day-of-calendary": ItemDayOfCalendary,
    // "base-calendary-view": BaseCalendaryView,
  },
  setup() {
    const { mobile } = useDisplay();
    const storeCalendar = useCalendarStore();
    const { setDatesByTypeCalendary, moveDirectionCalendary } = storeCalendar;
    const {
      dates,
      date,
      startDate,
      endDate,
      type,
      showSundayAndSaturday,
      titleForDate,
      types,
    } = storeToRefs(storeCalendar);

    onMounted(() => setDatesByTypeCalendary());

    const isMobile = computed(() => mobile.value);

    return {
      dates,
      date,
      startDate,
      endDate,
      type,
      setDatesByTypeCalendary,
      moveDirectionCalendary,
      showSundayAndSaturday,
      titleForDate,
      isMobile,
      types,
    };
  },
});
</script>
