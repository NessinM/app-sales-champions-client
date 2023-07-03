<template lang="pug">
v-dialog(
  v-model="isShowDialogAddOrUpdateEvent",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '500'"
)
  v-card(:rounded="isMobile ? 0 : 5")
    v-form-add-edit-event(
      :event-id="eventIdUpdate",
      @created="getListCustomerAndSelected",
      @updated="getListCustomerAndSelected",
      @close="closeDialogAddCustomer"
    )

v-hover(v-slot="{ isHovering, props }")
  v-card.relative.flex.flex-col.group(
    rounded="0",
    :class="{ 'bg-background': day.inactive }",
    :color="day.isToday ? 'primary' : ''",
    :variant="day.isToday ? 'tonal' : 'elevated'",
    flat,
    v-bind="props",
    @click="openDialogListEvents(day.events)"
  )
    .ma-2.flex.items.items-center
      v-btn(color="white", icon, size="small", flat, @click="() => {}")
        span.ma-2.font-extrabold(
          :class="{ 'text-primary': !day.inactive, '!text-slate-400': day.inactive, 'text-sm': !isMobile, 'text-xs': isMobile }"
        ) {{ day.day }}
      v-spacer
      small.text-xs.font-bold.mx-2.text-slate-400(
        v-if="isHovering && !isMobile"
      ) Nuevo evento
      v-btn(
        v-if="isHovering && !isMobile",
        color="success",
        variant="elevated",
        size="small",
        icon,
        @click="openDialogAddEvent('')"
      )
        v-icon(icon="$mdiPlus", color="white", size="20")
    .flex.flex-col.px-2.py-1.overflow-auto(v-if="!isMobile")
      v-card.flex.items-center.flex-shrink-0.pa-2.mb-1.elevation-1(
        v-for="(e, index) in day.events",
        :key="index",
        :color="day.inactive ? 'white' : 'background'",
        class="text-[10px]",
        @click="openDialogAddEvent(e.id)"
      )
        .flex
          span.ml-2.font-medium.leading-none {{ parseTimeByDateStartEvent(e.fecha_inicio) }}
          span.ml-2.font-extrabold.leading-none.truncate.uppercase {{ e.asunto }}
        span.ml-2.font-bold.leading-none.truncate.uppercase.text-primary COMPAÑIA FOOD RETAIL S.A.C.
    .flex.flex-col.px-2.py-1.overflow-auto(v-else)
      small.text-slate-400.text-blue.font-extrabold(
        v-if="day.events.length",
        class="text-[11px]"
      ) {{ day.events.length }} items
</template>
<script>
import { storeToRefs } from "pinia";
import { computed, defineComponent, ref } from "vue";
import { useCalendarStore } from "@/store";
import moment from "moment";
import { useDisplay } from "vuetify/lib/framework.mjs";
import FormAddOrEditEventComponent from "@/components/form_add_edit_event_component.vue";
export default defineComponent({
  name: "ItemDayCalendaryComponent",
  components: {
    "v-form-add-edit-event": FormAddOrEditEventComponent,
  },
  props: {
    day: {
      type: Object,
      dafault: {},
    },
  },
  setup() {
    const storeCalendar = useCalendarStore();
    const { type } = storeToRefs(storeCalendar);
    const { mobile } = useDisplay();

    const isShowDialogAddOrUpdateEvent = ref(false);
    const eventIdUpdate = ref("");
    const parseTimeByDateStartEvent = (startDate) =>
      moment(startDate.fecha_inicio).format("HH:mm");

    const isMobile = computed(() => mobile.value);

    const closeDialogAddCustomer = () =>
      (isShowDialogAddOrUpdateEvent.value = false);
    const openDialogAddEvent = (eventId) => {
      eventIdUpdate.value = eventId || "";
      isShowDialogAddOrUpdateEvent.value = true;
    };

    const getListCustomerAndSelected = () => {};

    const openDialogListEvents = (events) => {
      if (!isMobile.value) return;

      console.log("Abrir detalle de eventos", events);
    };

    return {
      parseTimeByDateStartEvent,
      type,
      isMobile,
      isShowDialogAddOrUpdateEvent,
      closeDialogAddCustomer,
      openDialogAddEvent,
      eventIdUpdate,
      getListCustomerAndSelected,
      openDialogListEvents,
    };
  },
});
</script>
