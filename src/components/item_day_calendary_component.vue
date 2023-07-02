<template lang="pug">
v-card.relative.flex.flex-col.group.relative(
  rounded="0",
  :class="{ 'bg-background': day.inactive }",
  :color="day.isToday ? 'primary' : ''",
  :variant="day.isToday ? 'tonal' : 'elevated'",
  flat
)
  v-btn.ma-1(color="white", icon, size="small", flat, @click="() => {}")
    span.mx-2.my-1.text-sm.font-extrabold(
      :class="{ 'text-primary': !day.inactive, '!text-slate-400': day.inactive }"
    ) {{ day.day }}
  .flex.flex-col.px-1.py-1.overflow-auto
    v-card.flex.items-center.flex-shrink-0.pa-2.mb-1.elevation-1(
      v-for="(e, index2) in day.events",
      :key="index2",
      :color="day.inactive ? 'white' : 'background'",
      class="text-[10px]",
      @click="() => {}"
    )
      .flex
        span.ml-2.font-medium.leading-none {{ parseTimeByDateStartEvent(e.fecha_inicio) }}
        span.ml-2.font-extrabold.leading-none.truncate.uppercase {{ e.asunto }}
      span.ml-2.font-bold.leading-none.truncate.uppercase.text-primary COMPAÑIA FOOD RETAIL S.A.C.
</template>
<script>
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
import { useCalendarStore } from "@/store";
import moment from "moment";
export default defineComponent({
  name: "ItemDayCalendaryComponent",
  props: {
    day: {
      type: Object,
      dafault: {},
    },
  },
  setup() {
    const storeCalendar = useCalendarStore();
    const { type } = storeToRefs(storeCalendar);

    const parseTimeByDateStartEvent = (startDate) => {
      return moment(startDate.fecha_inicio).format("HH:mm");
    };

    return {
      parseTimeByDateStartEvent,
      type,
      // events,
    };
  },
});
</script>
