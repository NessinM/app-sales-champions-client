<template lang="pug">
v-dialog(
  v-model="isShowDialogAddOrUpdateEvent",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '50%'"
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
      v-card.flex.items-center.flex-shrink-0.mb-1.elevation-1(
        v-for="(e, index) in day.events",
        :key="index",
        :color="day.inactive ? 'white' : 'background'",
        @click="openDialogAddEvent(e.id)"
      )
        v-list.py-0
          v-list-item.px-2
            template(#prepend="")
              v-avatar(
                :color="e.fecha_salida ? 'success' : 'warning'",
                ,
                size="18"
              )
            v-list-item-title
              .flex(class="text-[10px]")
                span.leading-none.font-extrabold {{ parseTimeByDateStartEvent(e.fecha_inicio) }}
                span.ml-2.font-bold.leading-none.truncate.uppercase COMPAÑIA FOOD RETAIL S.A.C.
            v-list-item-subtitle
              span.font-normal.text-xs
                | {{ e.asunto }}
    .pa-2.bottom-0.w-full.flex.justify-center.items-center(
      v-if="day.events.length > 1",
      class="!absolute"
    )
      .text-center
        v-menu(
          :close-on-content-click="false",
          location="end",
          transition="slide-x-transition"
        )
          template(#activator="{ props: menu }")
            v-tooltip(location="top")
              template(#activator="{ props: tooltip }")
                v-btn.elevation-3(
                  size="small",
                  theme="blue",
                  color="primary",
                  v-bind="mergeProps(menu, tooltip)"
                )
                  small.font-extrabold(class="text-[10px]") • • •
              span.text-xs.font-bold {{ day.events.length }} eventos mas - {{ day.full }}
          v-list
            v-list-item
              v-list-item-title Prueba opcion
</template>
<script>
import { storeToRefs } from "pinia";
import { computed, defineComponent, ref, mergeProps } from "vue";
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
      mergeProps,
    };
  },
});
</script>
