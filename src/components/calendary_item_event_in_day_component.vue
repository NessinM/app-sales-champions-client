<template lang="pug">
v-dialog(
  v-model="isShowDialogAddOrUpdateEvent",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '50%'"
)
  v-card(:rounded="isMobile ? 0 : 5")
    v-form-add-edit-event(
      :event-id="event.id",
      @created="getListCustomerAndSelected",
      @updated="getListCustomerAndSelected",
      @close="closeDialogAddCustomer"
    )

v-card.mb-1(@click="openDialogAddEvent()")
  v-list.py-0
    v-list-item.px-2
      template(#prepend="")
        v-avatar(
          :color="event.fecha_salida ? 'success' : 'warning'",
          size="17"
        )
      v-list-item-title
        .flex(class="text-[10px]")
          span.leading-none.font-extrabold {{event.fecha_inicio}}
          span.ml-2.font-bold.leading-none.truncate.uppercase {{  event.cliente.razon_social }}
      v-list-item-subtitle
        span.font-medium.text-xs
          | {{ event.autor.nombre }}
</template>
<script>
import { computed, defineComponent, ref } from "vue";
import FormAddOrEditEventComponent from "@/components/form_add_edit_event_component.vue";
import { useDisplay } from "vuetify/lib/framework.mjs";

export default defineComponent({
  name: "CalendaryItemEventInDayComponent",
  components : {
    "v-form-add-edit-event": FormAddOrEditEventComponent
  },
  props : {
    event : {
      type : Object,
    }
  },
  setup() {

    const { mobile } = useDisplay();

    const isShowDialogAddOrUpdateEvent = ref(false);

    const closeDialogAddCustomer = () =>
      (isShowDialogAddOrUpdateEvent.value = false);
    const openDialogAddEvent = () => {
      isShowDialogAddOrUpdateEvent.value = true;
    };

    const isMobile = computed(() => mobile.value);

    return {
      closeDialogAddCustomer,
      openDialogAddEvent,
      isShowDialogAddOrUpdateEvent,
      isMobile
    };
  },
});
</script>
