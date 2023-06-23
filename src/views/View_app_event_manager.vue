<template lang="pug">
v-dialog(
  v-model="isShowDialogAddOrUpdateEvent",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '500'"
)
  v-card(:rounded="isMobile ? 0 : 5")
    v-form-add-edit-event(
      :event-id="customerIdUpdate",
      @created="getListCustomerAndSelected",
      @updated="getListCustomerAndSelected",
      @close="closeDialogAddCustomer"
    )

v-row(no-gutters)
  v-col(cols="12", lg="3", md="6", sm="12")
    .flex.align-center.justify-center
      v-text-field(
        flat,
        prepend-inner-icon="$mdiFilterVariant",
        color="primary",
        variant="solo",
        clearable,
        placeholder="Filtrar por asunto, estado o descripcion",
        type="text",
        hide-details,
        @input="filterData"
      )
        template(#append-inner)
          v-fade-transition.ml-2(leave-absolute)
            v-btn(
              icon="$mdiSync",
              size="small",
              color="primary",
              variant="elevated",
              @click="getAllEvents()"
            )
    .py-1.px-4
      v-btn.w-full(
        color="success",
        rounded="3",
        variant="elevated",
        @click="openDialogAddEvent()"
      )
        v-icon.mr-1(icon="$mdiPlus", color="white", size="27")
        span.font-extrabold.text-white Agregar nuevo evento
    perfect-scrollbar.overflow-y-auto.pb-5(class="h-[calc(100vh-170px)]")
      v-alert.mx-4.my-2(
        v-if="!events.length && !isLoading",
        variant="tonal",
        density="compact",
        color="error"
      )
        v-icon(start, size="20", icon="$mdiFolderSearch")
        small.text-xs.font-bold No existen datos coincidentes para esta busqueda
      .flex.flex-col.pa-8.items-center(v-if="isLoading")
        small.text-xs.text-primary.font-bold.italic Obteniendo listado de clientes...
        v-progress-linear.mt-2(
          color="primary",
          indeterminate,
          rounded,
          height="5"
        )

      v-list.py-0(mandatory, color="primary")
        v-list-item.py-2(
          v-for="(i, index) in events",
          :key="index",
          :value="index",
          :active="event?.id === i.id",
          @click="openDialogAddEvent(i.id)"
        )
          template(#prepend)
            v-square-avatar-of-text(
              :text="i.asunto",
              text-size="xs",
              :avatar-size="32"
            )
          v-list-item-title
            small.font-extrabold.uppercase {{ i.asunto }}
          v-list-item-subtitle
            span.text-xs Programado para el {{ convertFormatYYYYMMDDTHHmm(i.fecha_creacion) }}
          template(#append)
            v-btn(
              color="grey",
              icon,
              variant="icon",
              density="comfortable",
              @click="() => {}"
            )
              v-icon(icon="$mdiDotsVertical", size="25")
          //- template(#append)
          //-   v-chip(color="warning", density="comfortable")
          //-     v-icon(start, size="13", icon="$mdiShieldStarOutline")
          //-     small.font-bold Fiscal
  v-col(cols="12", lg="9", md="6", sm="12")
    .items-center.flex.justify-center.h-full(v-if="!event && !isMobile")
      .flex-col.items-center.flex.justify-center.bg-background.pa-4.rounded-full(
        class="h-1/3 w-1/2"
      )
        v-icon.text-slate-300(
          start,
          size="90",
          icon="$mdiCalendarBadgeOutline"
        )
        small.text-slate-300.text-md.font-semibold.my-2 Seleccione un usuario del panel lateral izquierdo
//- .text-gray-700.h-full
//-   .flex.flex-grow.overflow-auto.h-full
//-     .flex.flex-col.flex-grow
//-       .flex.items-center.mt-4
//-         .flex.ml-2
//-           v-btn.mx-1(icon="$mdiChevronLeft", variant="tonal", size="small")
//-           v-btn.mx-1(icon="$mdiChevronRight", variant="tonal", size="small")
//-         h2.ml-2.text-xl.font-bold.leading-none September, 2020
//-         v-spacer
//-         v-btn.mx-4(
//-           color="blue",
//-           rounded="3",
//-           variant="elevated",
//-           @click="openDialogAddEvent('7C378EEC-CE11-EE11-9F62-2C44FD2EE46E')"
//-         )
//-           v-icon.mr-1(icon="$mdiPlus", color="white", size="27")
//-           small.font-bold.text-white Editar evento
//-         v-btn.mx-4(
//-           color="success",
//-           rounded="3",
//-           variant="elevated",
//-           @click="openDialogAddEvent()"
//-         )
//-           v-icon.mr-1(icon="$mdiPlus", color="white", size="27")
//-           small.font-bold.text-white Nuevo evento
//-       .grid.grid-cols-7.mt-4.text-center
//-         .pl-1.text-md.font-bold Lunes
//-         .pl-1.text-md.font-bold Martes
//-         .pl-1.text-md.font-bold Miercoles
//-         .pl-1.text-md.font-bold Jueves
//-         .pl-1.text-md.font-bold Viernes
//-         .pl-1.text-md.font-bold Sabado
//-         .pl-1.text-md.font-bold Domingo
//-       .grid.flex-grow.w-full.h-auto.grid-cols-7.grid-rows-5.gap-px.pt-px.mt-1.bg-slate-100
//-         v-card.relative.flex.flex-col.group(
//-           v-for="(i, index) in 30",
//-           :key="index",
//-           rounded="0",
//-           flat
//-         )
//-           v-avatar.ma-1(color="background")
//-             span.mx-2.my-1.text-md.font-extrabold.text-primary {{ i }}
//-           .flex.flex-col.px-1.py-1.overflow-auto
//-             button.flex.items-center.flex-shrink-0.h-5.px-1.text-xs(
//-               class="hover:bg-gray-200"
//-             )
//-               span.flex-shrink-0.w-2.h-2.border.border-gray-500.rounded-full
//-               span.ml-2.font-light.leading-none 8:30am
//-               span.ml-2.font-medium.leading-none.truncate An unconfirmed event
//-             button.flex.items-center.flex-shrink-0.h-5.px-1.text-xs(
//-               class="hover:bg-gray-200"
//-             )
//-               span.flex-shrink-0.w-2.h-2.bg-gray-500.rounded-full
//-               span.ml-2.font-light.leading-none 2:15pm
//-               span.ml-2.font-medium.leading-none.truncate A confirmed event
//-           button.absolute.bottom-0.right-0.flex.items-center.justify-center.hidden.w-6.h-6.mb-2.mr-2.text-white.bg-gray-400.rounded(
//-             class="group-hover:flex hover:bg-gray-500"
//-           )
//-             svg.w-5.h-5(viewBox="0 0 20 20", fill="currentColor")
//-               path(
//-                 fill-rule="evenodd",
//-                 d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z",
//-                 clip-rule="evenodd"
//-               )
</template>
<script>
import { computed, defineComponent, ref, onMounted } from "vue";
import { useAppStore } from "@/store";
import { useDisplay, useTheme } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
import SquareAvatarOfTextComponent from "@/components/square_avatar_of_text_component.vue";
import FormAddOrEditEventComponent from "@/components/form_add_edit_event_component.vue";
import moment from "moment";
export default defineComponent({
  name: "ViewAppEventManager",
  components: {
    "v-square-avatar-of-text": SquareAvatarOfTextComponent,
    "v-form-add-edit-event": FormAddOrEditEventComponent,
  },
  setup() {
    const { mobile } = useDisplay();
    const { fetchGetListEvents, fetchUpdateEvent } = useAppStore();

    const theme = useTheme();

    const events = ref([]);
    const event = ref(null);
    const customerIdUpdate = ref("");
    const filteredEvents = ref([]);
    const isLoading = ref(true);
    const isShowDialogAddOrUpdateEvent = ref(false);

    onMounted(() => getAllEvents());

    const isThemeDark = computed(() => theme.current.value.dark);
    const isMobile = computed(() => mobile.value);

    const getAllEvents = async () => {
      try {
        filteredEvents.value = [];
        events.value = [];
        isLoading.value = true;
        events.value = await fetchGetListEvents();
        filteredEvents.value = { ...events.value };
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoading.value = false;
      }
    };

    const updateEvent = async () => {
      try {
        const event = await fetchUpdateEvent(customerIdUpdate.value);
        /* eslint-disable */ console.log(
          ...oo_oo(`13ebc2ac_1`, "event", event)
        );
      } catch (error) {
        notify({ type: "error", text: error.message });
      }
    };

    const closeDialogAddCustomer = () =>
      (isShowDialogAddOrUpdateEvent.value = false);
    const openDialogAddEvent = (eventId) => {
      customerIdUpdate.value = eventId || "";
      isShowDialogAddOrUpdateEvent.value = true;
    };

    const getListCustomerAndSelected = async (customerIdEmmited) => {
      await getAllEvents();
      const customerExist = events.value.find(
        (e) => e.id === customerIdEmmited
      );
      event.value = customerExist;
    };

    const convertFormatYYYYMMDDTHHmm = (value) => {
      return moment(value).format("DD/MM/YYYY HH:mm");
    };

    return {
      events,
      getAllEvents,
      isThemeDark,
      isMobile,
      isLoading,
      isShowDialogAddOrUpdateEvent,
      closeDialogAddCustomer,
      openDialogAddEvent,
      getListCustomerAndSelected,
      customerIdUpdate,
      updateEvent,
      convertFormatYYYYMMDDTHHmm,
    };
  },
});
</script>
