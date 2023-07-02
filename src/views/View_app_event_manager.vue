<template lang="pug">
v-row.h-full(no-gutters)
  v-col(cols="12", lg="2", md="3", sm="12")
    base-calendary-view
  v-col(cols="12", lg="10", md="9", sm="12")
    .flex.flex-grow.overflow-auto.h-full
      perfect-scrollbar.flex.flex-col.flex-grow.overflow-y-auto
        .sticky.top-0.z-10.bg-white.pb-2.elevation-2
          .flex.items-center.py-2
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
            h2.ml-2.text-xl.font-extrabold.leading-none {{ titleForDate }}
            v-spacer
            //- v-switch(
            //-   v-model="showSundayAndSaturday",
            //-   color="primary",
            //-   label="Mostrar sabados y domingos",
            //-   @change="setDatesByTypeCalendary"
            //- )
            v-btn-toggle.mx-4.elevation-1(
              v-model="type",
              rounded="xl",
              color="primary",
              variant="elevated",
              bg-color="background",
              group="",
              density="compact",
              @click="setDatesByTypeCalendary()"
            )
              v-btn(value="day")
                span.font-extrabold.text-xs Dia
              v-btn(value="week")
                span.font-extrabold.text-xs Semana
              v-btn(value="month")
                span.font-extrabold.text-xs Mes
          .grid.grid-cols-7.mt-1.text-center(
            :class="{ '!grid-cols-5': !showSundayAndSaturday }"
          )
            .pl-1.text-md.font-extrabold(v-if="showSundayAndSaturday") Domingo
            .pl-1.text-md.font-extrabold Lunes
            .pl-1.text-md.font-extrabold Martes
            .pl-1.text-md.font-extrabold Miercoles
            .pl-1.text-md.font-extrabold Jueves
            .pl-1.text-md.font-extrabold Viernes
            .pl-1.text-md.font-extrabold(v-if="showSundayAndSaturday") Sabado
        .grid.flex-grow.w-full.grid-cols-7.grid-rows-7.gap-px.pt-px.bg-slate-200(
          :class="{ '!grid-cols-5': !showSundayAndSaturday }"
        )
          item-day-of-calendary(
            v-for="(i, index) in dates",
            :key="index",
            :day="i"
          )
</template>
<script>
import { defineComponent, onMounted } from "vue";
import { useCalendarStore } from "@/store";
import { storeToRefs } from "pinia";
// import moment from "moment";
import ItemDayOfCalendary from "@/components/item_day_calendary_component.vue";
import BaseCalendaryView from "@/components/base_calendary_view_component.vue";
export default defineComponent({
  name: "ViewAppEventManager",
  components: {
    "item-day-of-calendary": ItemDayOfCalendary,
    "base-calendary-view": BaseCalendaryView,
  },
  setup() {
    const storeCalendar = useCalendarStore();
    const { setDatesByTypeCalendary, moveDirectionCalendary } = storeCalendar;
    const {
      dates,
      date,
      startDate,
      endDate,
      type,
      events,
      showSundayAndSaturday,
      titleForDate,
    } = storeToRefs(storeCalendar);

    onMounted(() => setDatesByTypeCalendary());

    return {
      dates,
      date,
      startDate,
      endDate,
      type,
      setDatesByTypeCalendary,
      moveDirectionCalendary,
      events,
      showSundayAndSaturday,
      titleForDate,
    };
  },
});
</script>
