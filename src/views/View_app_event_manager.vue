<template lang="pug">
.text-gray-700.h-full
  .flex.flex-grow.overflow-auto.h-full
    .flex.flex-col.flex-grow
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
        h2.ml-2.text-xl.font-extrabold.leading-none {{ parseLabel() }}
        v-spacer
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
            span.font-extrabold.text-xs Semana {{showNonWorkingDays}}
          v-btn(value="month")
            span.font-extrabold.text-xs Mes
      v-switch(v-model="showNonWorkingDays"  color='primary' label='Quitar dias no laborables')
      .grid.grid-cols-7.mt-1.text-center(:class="{'!grid-cols-5' : !showNonWorkingDays}")
        .pl-1.text-md.font-extrabold(v-if="showNonWorkingDays") Domingo
        .pl-1.text-md.font-extrabold Lunes
        .pl-1.text-md.font-extrabold Martes
        .pl-1.text-md.font-extrabold Miercoles
        .pl-1.text-md.font-extrabold Jueves
        .pl-1.text-md.font-extrabold Viernes
        .pl-1.text-md.font-extrabold(v-if="showNonWorkingDays") Sabado
      .grid.flex-grow.w-full.h-auto.grid-cols-7.grid-rows-7.gap-px.pt-px.mt-1.bg-slate-200(:class="{'!grid-cols-5' : !showNonWorkingDays}")
        item-day-of-calendary(
          v-for="(i, index) in dates",
          :key="index",
          :day="i"
        )
        //- v-card.relative.flex.flex-col.group.relative(
        //-   v-for="(i, index) in dates",
        //-   :key="index",
        //-   rounded="0",
        //-   :class="{ 'bg-background': i.inactive }",
        //-   :color="i.isToday ? 'primary' : ''",
        //-   :variant="i.isToday ? 'tonal' : 'elevated'",
        //-   :height="type === 'month' ? '125' : '100%'"
        //-   flat
        //- )
        //-   v-btn.ma-1(
        //-     color="white",
        //-     icon,
        //-     flat
        //-     size="x-small",
        //-     @click="() => {}"
        //-   )
        //-     span.mx-2.my-1.text-xs.font-extrabold(
        //-       :class="{ 'text-slate-600': !i.inactive, '!text-slate-400': i.inactive }"
        //-     ) {{ i.day }}
        //-   .flex.flex-col.px-1.py-1.overflow-auto
        //-     v-card.flex.items-center.flex-shrink-0.pa-2.mb-1.elevation-1(
        //-       v-for="(e, index2) in i.events",
        //-       :key="index2",
        //-       :color="i.inactive ? 'white' : 'background'",
        //-       class="text-[10px]",
        //-       @click="() => {}"
        //-     )
        //-       .flex
        //-         span.ml-2.font-medium.leading-none {{ parseTimeByDateStartEvent(e.fecha_inicio) }}
        //-         span.ml-2.font-extrabold.leading-none.truncate.uppercase {{ e.asunto }}
        //-       span.ml-2.font-bold.leading-none.truncate.uppercase.text-primary COMPAÑIA FOOD RETAIL S.A.C.
</template>
<script>
import { defineComponent, onMounted } from "vue";
import { useCalendarStore } from "@/store";
import { storeToRefs } from "pinia";
import moment from "moment";
import ItemDayOfCalendary from '@/components/item_day_calendary_component.vue'
export default defineComponent({
  name: "ViewAppEventManager",
  components: {
    'item-day-of-calendary': ItemDayOfCalendary
  },
  setup() {
    const storeCalendar = useCalendarStore();
    const { setDatesByTypeCalendary, moveDirectionCalendary } = storeCalendar;
    const { dates, date, startDate, endDate, type, format, events, showNonWorkingDays } =
      storeToRefs(storeCalendar);

    onMounted(() => setDatesByTypeCalendary());

    const parseLabel = () => {
      let text = "";
      if (type.value === "day")
        text = moment(date.value, format.value).format("ddd  DD' MMMM, YYYY ");
      else if (type.value === "week")
        text = moment(date.value, format.value).format("[Sem.] w - YYYY");
      else text = moment(date.value, format.value).format("MMMM, YYYY");

      return text;
    };


    return {
      dates,
      date,
      startDate,
      endDate,
      type,
      setDatesByTypeCalendary,
      moveDirectionCalendary,
      parseLabel,
      events,
      showNonWorkingDays
    };
  },
});
</script>
