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
            span.font-extrabold.text-xs Semana
          v-btn(value="month")
            span.font-extrabold.text-xs Mes
      //- span {{ events }}
      .grid.grid-cols-7.mt-4.text-center
        .pl-1.text-md.font-extrabold Domingo
        .pl-1.text-md.font-extrabold Lunes
        .pl-1.text-md.font-extrabold Martes
        .pl-1.text-md.font-extrabold Miercoles
        .pl-1.text-md.font-extrabold Jueves
        .pl-1.text-md.font-extrabold Viernes
        .pl-1.text-md.font-extrabold Sabado
      .grid.flex-grow.w-full.h-auto.grid-cols-7.grid-rows-7.gap-px.pt-px.mt-1.bg-slate-200
        v-card.relative.flex.flex-col.group(
          v-for="(i, index) in dates",
          :key="index",
          rounded="0",
          :class="{ 'bg-background': i.inactive }",
          :color="i.isToday ? 'primary' : ''",
          :variant="i.isToday ? 'tonal' : 'elevated'",
          flat
        )
          v-btn.ma-1(
            color="background",
            variant="tonal",
            icon,
            size="small",
            @click="() => {}"
          )
            span.mx-2.my-1.text-sm.font-extrabold(
              :class="{ 'text-primary': !i.inactive, '!text-slate-400': i.inactive }"
            ) {{ i.day }}
          .flex.flex-col.px-1.py-1.overflow-auto
            //- button.flex.items-center.flex-shrink-0.px-1.py-2.text-xs.rounded-md(
            //-   class="hover:bg-gray-200"
            //- )
            //-   span.flex-shrink-0.w-2.h-2.border.border-gray-500.rounded-full
            //-   span.ml-2.font-light.leading-none 8:30am
            //-   span.ml-2.font-medium.leading-none.truncate Datacont sac
            v-card.flex.items-center.flex-shrink-0.px-1.px-1.py-2.mb-1.elevation-1(
              v-for="(e, index2) in i.events",
              :key="index2",
              :color="i.inactive ? 'white' : 'background'",
              class="text-[10px]",
              @click="() => {}"
            )
              //- span.flex-shrink-0.w-2.h-2.bg-gray-500.rounded-full ed
              .flex
                span.ml-2.font-medium.leading-none {{ parseTimeByDateStartEvent(e.fecha_inicio) }}
                span.ml-2.font-extrabold.leading-none.truncate.uppercase {{ e.asunto }}
              span.ml-2.font-bold.leading-none.truncate.uppercase.text-primary COMPAÑIA FOOD RETAIL S.A.C.
          //- button.absolute.bottom-0.right-0.flex.items-center.justify-center.hidden.w-6.h-6.mb-2.mr-2.text-white.bg-success.rounded(
          //-   class="group-hover:flex hover:bg-gray-500"
          //- )
          //-   svg.w-5.h-5(viewBox="0 0 20 20", fill="currentColor")
          //-     path(
          //-       fill-rule="evenodd",
          //-       d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z",
          //-       clip-rule="evenodd"
          //-     )
</template>
<script>
import { defineComponent, onMounted } from "vue";
import { useCalendarStore } from "@/store";
import { storeToRefs } from "pinia";
import moment from "moment";
export default defineComponent({
  name: "ViewAppEventManager",
  components: {},
  setup() {
    const storeCalendar = useCalendarStore();
    const { setDatesByTypeCalendary, moveDirectionCalendary } = storeCalendar;
    const { dates, date, startDate, endDate, type, format, events } =
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
    const parseTimeByDateStartEvent = (startDate) => {
      return moment(startDate.fecha_inicio).format("HH:mm");
    };

    return {
      dates,
      date,
      startDate,
      endDate,
      type,
      setDatesByTypeCalendary,
      moveDirectionCalendary,
      parseTimeByDateStartEvent,
      parseLabel,
      events,
    };
  },
});
</script>
