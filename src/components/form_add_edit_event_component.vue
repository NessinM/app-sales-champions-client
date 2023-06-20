<template lang="pug">
v-card-title.flex.items-center.py-4.mx-2
  span.font-extrabold.text-lg {{ eventId ? "Editar evento" : "Nuevo evento" }}
v-card-text
  v-form(ref="formRef")
    v-row(no-gutters)
      v-col(cols="12", lg="6", md="6", sm="12")
        v-autocomplete.mx-2.text-slate-500.my-1(
          v-model="event.asunto",
          label="Asunto",
          :items="listReasonsForEvent",
          :rules="validationForm.asunto",
          placeholder="Seleccione una opcion de la lista",
          item-title="name",
          item-value="value",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="6", md="6", sm="12")
      v-col(cols="12", lg="6", md="6", sm="12")
        v-autocomplete.mx-2.text-slate-500.my-1(
          v-model="event.clienteId",
          label="Cliente",
          :items="listReasonsForEvent",
          :rules="validationForm.clienteId",
          placeholder="Seleccione una opcion de la lista",
          item-title="name",
          item-value="value",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="6", md="6", sm="12")
        v-autocomplete.mx-2.text-slate-500.my-1(
          v-model="event.asunto",
          label="Ubicacion",
          :items="listReasonsForEvent",
          :rules="validationForm.asunto",
          placeholder="Seleccione una opcion de la lista",
          item-title="name",
          item-value="value",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="12", md="12", sm="12")
        v-autocomplete-list-customer
      v-col(cols="12", lg="4", md="4", sm="12")
        v-text-field.mx-2.text-slate-500.my-1(
          label="Fecha inicio",
          type="date",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="4", md="4", sm="12")
        v-text-field.mx-2.text-slate-500.my-1(
          label="Hora inicio",
          type="time",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="4", md="4", sm="12")
        v-switch.mx-2.text-slate-500.my-1(
          label="Todo el dia",
          color="primary",
          density="compact"
        )
      v-col(cols="12", lg="4", md="4", sm="12")
        v-text-field.mx-2.text-slate-500.my-1(
          label="Fecha salida",
          type="date",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="4", md="4", sm="12")
        v-text-field.mx-2.text-slate-500.my-1(
          label="Hora salida",
          type="time",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="4", md="4", sm="12")
      v-col(cols="12", lg="12", md="12", sm="12")
        v-textarea.mx-2.text-slate-500.my-1(
          label="Observaciones",
          color="primary",
          auto-grow="",
          variant="outlined",
          rows="1",
          row-height="25",
          shaped=""
        )

.flex.pa-1.px-6.pb-6.mx-2(
  :class="{ 'flex-col': isMobile, 'justify-end': !isMobile }"
)
  v-btn.ml-2.font-bold(
    color="error",
    :rounded="5",
    variant="text",
    :class="{ 'mb-3': isMobile }",
    @click="emitCloseComponent"
  )
    span.text-xs.font-bold cancelar
  v-btn.ml-2.font-bold(
    color="success",
    :rounded="5",
    @click="validateAndCreateCustomer()"
  )
    small.text-xs.font-bold.text-white {{ eventId ? "Guardar cambios" : "Crear evento" }}
</template>
<script>
import { computed, defineComponent, onMounted, ref, toRefs } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { useAppStore } from "../store";
import { notify } from "@kyvg/vue3-notification";
import AutocompleteListCustomer from "@/components/autocomplete_list_customers_component.vue";
import {
  listTypesOfTaxpayers,
  businessSectorsList,
  listReasonsForEvent,
} from "@/helps/constants";
export default defineComponent({
  name: "FormAddEditEventComponent",
  components: {
    "v-autocomplete-list-customer": AutocompleteListCustomer,
  },
  props: {
    eventId: {
      type: String,
      default: "",
    },
  },
  emits: ["created", "updated", "close"],
  setup(props, { emit }) {
    const { eventId } = toRefs(props);
    const { mobile } = useDisplay();
    const {
      // fetchGetListCustomers,
      fetchGetOneCustomer,
      fetchCreateCustomer,
      fetchUpdateCustomer,
      fetchCreateCustomerLocation,
    } = useAppStore();

    const isLoading = ref(false);
    const isLoadingGetSunat = ref(false);
    const formRef = ref(null);
    const event = ref({
      asunto: "",
      clienteId: "",
      ubicacionId: "",
      fecha_inicio: "",
      fecha_final: "",
      es_todo_el_dia: "",
      fecha_llegada: "",
      longitude_llegada: "",
      latitude_llegada: "",
      fecha_salida: "",
      longitude_salida: "",
      latitude_salida: "",
      usuarioId: "",
      contactoId: "",
      observaciones: "",
    });

    onMounted(() => checkEditOrCreateEvent());

    const validationForm = {
      asunto: [(v) => !!v || "El tipo de documento e requerido"],
      clienteId: [(v) => !!v || "El tipo de documento e requerido"],
      fecha_inicio: [(v) => !!v || "El tipo de documento e requerido"],
      fecha_final: [(v) => !!v || "El tipo de documento e requerido"],
      usuarioId: [(v) => !!v || "La razon social es requerido"],
      contactoId: [(v) => !!v || "La razon social es requerido"],
      ubicacionId: [(v) => !!v || "La razon social es requerido"],
    };

    const validateAndCreateCustomer = async () => {
      try {
        const { valid } = await formRef.value.validate();
        if (valid) {
          isLoading.value = true;
          if (eventId.value) {
            await fetchUpdateCustomer(eventId.value, event.value);
            notify({
              type: "success",
              text: "Los cambios se guardarón correctamente.",
            });
            emit("updated", eventId.value);
            emit("close");
          } else {
            const customerCreated = await fetchCreateCustomer(event.value);
            if (location.value.direccion && location.value.codigo_ubigeo) {
              const customerLocationCreated = await fetchCreateCustomerLocation(
                customerCreated.id,
                location.value
              );
              await fetchUpdateCustomer(customerCreated.id, {
                ubicacionId: customerLocationCreated.id,
              });
            }
            notify({
              type: "success",
              text: "El evento se generó correctamente.",
            });
            emit("created", customerCreated.id);
            emit("close");
          }
        }
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoading.value = false;
      }
    };

    const checkEditOrCreateEvent = async () => {
      if (eventId.value) {
        try {
          const customerGet = await fetchGetOneCustomer(eventId.value);
          event.value.tipo_documento = customerGet.tipo_documento;
          event.value.numero_documento = customerGet.numero_documento;
          event.value.razon_social = customerGet.razon_social;
          event.value.sub_sector = customerGet.sub_sector;
        } catch (error) {
          notify({ type: "error", text: error.message });
        }
      } else {
        event.value.tipo_documento = "RUC";
      }
    };

    const isMobile = computed(() => mobile.value);
    const emitCloseComponent = () => emit("close");
    return {
      isLoading,
      formRef,
      event,
      validationForm,
      businessSectorsList,
      listTypesOfTaxpayers,
      isMobile,
      isLoadingGetSunat,
      validateAndCreateCustomer,
      emitCloseComponent,
      listReasonsForEvent,
    };
  },
});
</script>
