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

v-row.h-full(no-gutters)
  v-col(cols="12", lg="3 ", md="4", sm="12")
    .flex.align-center.justify-center
      v-text-field(
        v-model="searchValue",
        flat,
        prepend-inner-icon="$mdiFolderSearch",
        color="primary",
        variant="solo",
        clearable,
        placeholder="Buscar por asunto, contacto, ubicacion o fecha",
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
    v-divider(v-if="!isThemeDark")
    .p-2
      v-btn.w-full(
        color="success",
        rounded="3",
        variant="elevated",
        @click="openDialogAddCustomer"
      )
        v-icon.mr-1(icon="$mdiPlus", color="white", size="27")
        small.font-bold.text-white Agregar nuevo evento
    perfect-scrollbar.overflow-y-auto.pb-5(class="h-[calc(100vh-170px)]")
      v-alert.mx-2.my-1(
        v-if="!events.length && !isLoading",
        variant="tonal",
        density="compact",
        color="error"
      )
        v-icon(start, size="20", icon="$mdiFolderSearch")
        small.text-xs.font-medium No existen datos coincidentes para esta busqueda
      .flex.flex-col.pa-8.items-center(v-if="isLoading")
        small.text-xs.text-primary.font-bold.italic Obteniendo listado de eventos...
        v-progress-linear.mt-2(
          color="primary",
          indeterminate,
          rounded,
          height="5"
        )

      v-list(
        mandatory,
        color="primary",
        @update:selected="actionSelectedEvent"
      )
        v-list-item.py-3(
          v-for="(i, index) in events",
          :key="index",
          :value="index"
        )
          template(#prepend)
            v-square-avatar-of-text(
              :text="i.asunto",
              text-size="sm",
              :avatar-size="35"
            )
          v-list-item-title
            span.font-extrabold.text-xs {{ i.asunto }}
          v-list-item-subtitle
            span.text-xs {{ i.cliente.razon_social }} - {{ i.contacto.nombre }}
          template(#append)
            v-chip(color="warning", density="comfortable")
              v-icon(start, size="13", icon="$mdiShieldStarOutline")
              small.font-bold Pendiente
  v-col(cols="12", lg="9", md="8", sm="12")
    .items-center.flex.justify-center.h-full(v-if="!event")
      .flex-col.items-center.flex.justify-center.bg-background.pa-4.rounded-full(
        class="h-1/3 w-1/2"
      )
        v-icon.text-slate-300(start, size="90", icon="$mdiAccountArrowLeft")
        small.text-slate-300.text-md.font-semibold.my-2 Seleccione un usuario del panel lateral izquierdo
    .h-full(v-else)
      span {{ event }}
</template>
<script>
import { computed, defineComponent, ref, onMounted } from "vue";
import { useAppStore } from "@/store";
import { useDisplay, useTheme } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
import SquareAvatarOfTextComponent from "@/components/square_avatar_of_text_component.vue";
import FormAddOrEditEventComponent from "@/components/form_add_edit_event_component.vue";
export default defineComponent({
  name: "ViewAppEventManager",
  components: {
    "v-square-avatar-of-text": SquareAvatarOfTextComponent,
    "v-form-add-edit-event": FormAddOrEditEventComponent,
  },
  setup() {
    const { mobile } = useDisplay();
    const { fetchGetListEvents } = useAppStore();

    const theme = useTheme();

    const events = ref([]);
    const event = ref(null);
    const customerIdUpdate = ref("");
    const filteredEvents = ref([]);
    const isLoading = ref(true);
    const isShowDialogAddOrUpdateEvent = ref(false);
    const searchValue = ref("");
    const panelActual = ref(1);

    onMounted(() => getAllEvents());

    const isThemeDark = computed(() => theme.current.value.dark);
    const isMobile = computed(() => mobile.value);

    const filterData = () => {
      const searchTerm = searchValue.value.toLowerCase();
      events.value = filteredEvents.value;
      if (searchValue.value) {
        events.value = events.value.filter(
          (item) =>
            item.asunto.toLowerCase().includes(searchTerm) ||
            item.correo_electronico.toLowerCase().includes(searchTerm)
        );
      }
    };

    const actionSelectedEvent = ([index]) => {
      event.value = { ...events.value[index] };
    };

    const getAllEvents = async () => {
      try {
        filteredEvents.value = [];
        events.value = [];
        isLoading.value = true;
        const response = await fetchGetListEvents();
        filteredEvents.value = response.events;
        events.value = response.events;
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoading.value = false;
      }
    };

    const closeDialogAddCustomer = () =>
      (isShowDialogAddOrUpdateEvent.value = false);
    const openDialogAddCustomer = () =>
      (isShowDialogAddOrUpdateEvent.value = true);

    const getListCustomerAndSelected = async (customerIdEmmited) => {
      await getAllEvents();
      const customerExist = events.value.find(
        (e) => e.id === customerIdEmmited
      );
      event.value = customerExist;
    };

    return {
      searchValue,
      isThemeDark,
      isMobile,
      event,
      events,
      panelActual,
      filterData,
      isLoading,
      getAllEvents,
      actionSelectedEvent,
      isShowDialogAddOrUpdateEvent,
      closeDialogAddCustomer,
      openDialogAddCustomer,
      getListCustomerAndSelected,
      customerIdUpdate,
    };
  },
});
</script>
