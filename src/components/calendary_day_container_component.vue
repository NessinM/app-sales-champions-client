<template lang="pug">
v-dialog(
  v-model="isShowDialogAddOrUpdateEvent",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '50%'"
)
  v-card(:rounded="isMobile ? 0 : 5")
    v-form-add-edit-event(
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
    v-bind="props"
  )
    .ma-1.flex.items.items-center
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

    .flex.flex-col.px-2.overflow-auto.absolute.top-15.w-full(v-if="!isMobile")
      v-item-event-in-day(v-for="(e, i) in day.events", :key="i", :event="e")

    .pa-2.bottom-0.w-full.flex.justify-center.items-center(
      v-if="day.events.length > 1",
      class="!absolute"
    )
      v-tooltip(location="top")
        template(#activator="{ props: tooltip }")
          v-btn.elevation-3(
            size="small",
            theme="blue",
            color="primary",
            v-bind="tooltip",
            @click="openDialogListEvents()"
          )
            small.font-extrabold(class="text-[10px]") • • •
        span.text-xs.font-bold {{ day.events.length }} eventos mas - {{ day.full }}
</template>
<script>
import { storeToRefs } from "pinia";
import { computed, defineComponent, ref } from "vue";
import { useCalendarStore } from "@/store";
import moment from "moment";
import { useDisplay } from "vuetify/lib/framework.mjs";
import CalendaryItemEventInDay from "@/components/calendary_item_event_in_day_component.vue";
import FormAddOrEditEventComponent from "@/components/form_add_edit_event_component.vue";
export default defineComponent({
  name: "ItemDayCalendaryComponent",
  components: {
    "v-item-event-in-day": CalendaryItemEventInDay,
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

    const parseTimeByDateStartEvent = (startDate) =>
      moment(startDate.fecha_inicio).format("HH:mm");

    const isMobile = computed(() => mobile.value);

    const getListCustomerAndSelected = () => {};

    const openDialogListEvents = (events) => {
      if (!isMobile.value) return;

      console.log(events);
    };

    const openDialogAddEvent = () => {
      isShowDialogAddOrUpdateEvent.value = true;
    };

    return {
      parseTimeByDateStartEvent,
      type,
      isMobile,
      getListCustomerAndSelected,
      openDialogListEvents,
      isShowDialogAddOrUpdateEvent,
      openDialogAddEvent,
    };
  },
});
</script>
