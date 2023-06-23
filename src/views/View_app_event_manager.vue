<template lang="pug">
v-dialog(
  v-model="isShowDialogAddOrUpdateEvent",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '500'"
)
  v-card(:rounded="isMobile ? 0 : 5")
    //- :event-id="customerIdUpdate",
    v-form-add-edit-event(
      :event-id="'443C4B27-4D11-EE11-9F62-2C44FD2EE46E'",
      @created="getListCustomerAndSelected",
      @updated="getListCustomerAndSelected",
      @close="closeDialogAddCustomer"
    )

.text-gray-700.h-full
  // Component Start
  .flex.flex-grow.overflow-auto.h-full
    .flex.flex-col.flex-grow
      .flex.items-center.mt-4
        .flex.ml-2
          v-btn.mx-1(icon="$mdiChevronLeft", variant="tonal", size="small")
          v-btn.mx-1(icon="$mdiChevronRight", variant="tonal", size="small")
        h2.ml-2.text-xl.font-bold.leading-none September, 2020
        v-spacer
        v-btn.mx-4(
          color="success",
          rounded="3",
          variant="elevated",
          @click="openDialogAddEvent()"
        )
          v-icon.mr-1(icon="$mdiPlus", color="white", size="27")
          small.font-bold.text-white Nuevo evento
      .grid.grid-cols-7.mt-4.text-center
        .pl-1.text-md.font-bold Lunes
        .pl-1.text-md.font-bold Martes
        .pl-1.text-md.font-bold Miercoles
        .pl-1.text-md.font-bold Jueves
        .pl-1.text-md.font-bold Viernes
        .pl-1.text-md.font-bold Sabado
        .pl-1.text-md.font-bold Domingo
      .grid.flex-grow.w-full.h-auto.grid-cols-7.grid-rows-5.gap-px.pt-px.mt-1.bg-slate-100
        v-card.relative.flex.flex-col.group(
          v-for="(i, index) in 30",
          :key="index",
          rounded="0",
          flat
        )
          v-avatar.ma-1(color="background")
            span.mx-2.my-1.text-md.font-extrabold.text-primary {{ i }}
          .flex.flex-col.px-1.py-1.overflow-auto
            button.flex.items-center.flex-shrink-0.h-5.px-1.text-xs(
              class="hover:bg-gray-200"
            )
              span.flex-shrink-0.w-2.h-2.border.border-gray-500.rounded-full
              span.ml-2.font-light.leading-none 8:30am
              span.ml-2.font-medium.leading-none.truncate An unconfirmed event
            button.flex.items-center.flex-shrink-0.h-5.px-1.text-xs(
              class="hover:bg-gray-200"
            )
              span.flex-shrink-0.w-2.h-2.bg-gray-500.rounded-full
              span.ml-2.font-light.leading-none 2:15pm
              span.ml-2.font-medium.leading-none.truncate A confirmed event
          button.absolute.bottom-0.right-0.flex.items-center.justify-center.hidden.w-6.h-6.mb-2.mr-2.text-white.bg-gray-400.rounded(
            class="group-hover:flex hover:bg-gray-500"
          )
            svg.w-5.h-5(viewBox="0 0 20 20", fill="currentColor")
              path(
                fill-rule="evenodd",
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z",
                clip-rule="evenodd"
              )
</template>
<script>
import { computed, defineComponent, ref, onMounted } from "vue";
import { useAppStore } from "@/store";
import { useDisplay, useTheme } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
// import SquareAvatarOfTextComponent from "@/components/square_avatar_of_text_component.vue";
import FormAddOrEditEventComponent from "@/components/form_add_edit_event_component.vue";
export default defineComponent({
  name: "ViewAppEventManager",
  components: {
    // "v-square-avatar-of-text": SquareAvatarOfTextComponent,
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
        const response = await fetchGetListEvents();
        filteredEvents.value = response.events;
        events.value = response.events;
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoading.value = false;
      }
    };

    const updateEvent = async () => {
      try {
        const event = await fetchUpdateEvent(customerIdUpdate.value)
        console.log('event', event)
      } catch (error) {
        notify({ type: "error", text: error.message });
      }
    };

    const closeDialogAddCustomer = () =>
      (isShowDialogAddOrUpdateEvent.value = false);
    const openDialogAddEvent = () =>
      (isShowDialogAddOrUpdateEvent.value = true);

    const getListCustomerAndSelected = async (customerIdEmmited) => {
      await getAllEvents();
      const customerExist = events.value.find(
        (e) => e.id === customerIdEmmited
      );
      event.value = customerExist;
    };

    return {
      isThemeDark,
      isMobile,
      isLoading,
      isShowDialogAddOrUpdateEvent,
      closeDialogAddCustomer,
      openDialogAddEvent,
      getListCustomerAndSelected,
      customerIdUpdate,
      updateEvent
    };
  },
});
</script>
