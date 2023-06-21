<template lang="pug">
v-card-title.flex.items-center.py-4.mx-2
  span.font-extrabold.text-lg {{ eventId ? "Editar evento" : "Nuevo evento" }}
v-card-text
  v-form(ref="formRef")
    v-row(no-gutters)
      v-col(cols="12", lg="12", md="12", sm="12")
        v-autocomplete.mx-2.text-slate-500.my-2(
          v-model="event.asunto",
          hide-details="auto",
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
      v-col(cols="12", lg="12", md="12", sm="12")
        v-autocomplete-list-customers.my-2(
          label="Seleccionar un cliente",
          :error-message="validateExtern.client(event.cliente)",
          @updated="getClienteSelected"
        )
      v-col(cols="12", lg="12", md="12", sm="12")
        v-autocomplete-list-customer-contacts.my-2(
          label="Seleccionar un contacto",
          :customer-id="event?.cliente",
          :error-message="validateExtern.contact(event.contacto)",
          @updated="getContactSelected"
        )
      v-col(cols="12", lg="12", md="12", sm="12")
        v-autocomplete-list-customer-locations.my-2(
          label="Seleccionar una ubicacion",
          :customer-id="event?.cliente",
          :error-message="validateExtern.location(event.ubicacion)",
          @updated="getLocationSelected"
        )
      v-col(
        cols="12",
        :lg="event.es_todo_el_dia ? 6 : 4",
        :md="event.es_todo_el_dia ? 6 : 4",
        sm="12"
      )
        v-text-field.mx-2.text-slate-500.my-2(
          v-model="event.fecha_inicio",
          hide-details="auto",
          :rules="validationForm.fecha_inicio",
          :label="event.es_todo_el_dia ? 'Fecha inicio - final' : 'Fecha inicio'",
          type="date",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(v-if="!event.es_todo_el_dia", cols="12", lg="4", md="4", sm="12")
        v-text-field.mx-2.text-slate-500.my-2(
          v-model="event.hora_inicio",
          hide-details="auto",
          :rules="validationForm.hora_inicio",
          label="Hora inicio",
          type="time",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="4", md="4", sm="12")
        v-switch.mx-2.text-slate-500.my-2(
          v-model="event.es_todo_el_dia",
          hide-details="auto",
          label="Todo el dia",
          color="primary",
          density="compact"
        )
      v-col(v-if="!event.es_todo_el_dia", cols="12", lg="4", md="4", sm="12")
        v-text-field.mx-2.text-slate-500.my-2(
          v-model="event.fecha_final",
          hide-details="auto",
          :rules="validationForm.fecha_final",
          label="Fecha salida",
          type="date",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(v-if="!event.es_todo_el_dia", cols="12", lg="4", md="4", sm="12")
        v-text-field.mx-2.text-slate-500.my-2(
          v-model="event.hora_final",
          hide-details="auto",
          :rules="validationForm.hora_final",
          label="Hora salida",
          type="time",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="4", md="4", sm="12")
      v-col(cols="12", lg="12", md="12", sm="12")
        v-textarea.mx-2.text-slate-500.my-2(
          hide-details="auto",
          label="observacion",
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
import AutocompleteListCustomers from "@/components/autocomplete_list_customers_component.vue";
import AutocompleteListCustomerContacts from "@/components/autocomplete_list_customers_contacts_component.vue";
import AutocompleteListCustomerLocations from "@/components/autocomplete_list_customers_locations_component.vue";
import {
  listTypesOfTaxpayers,
  businessSectorsList,
  listReasonsForEvent,
} from "@/helps/constants";
export default defineComponent({
  name: "FormAddEditEventComponent",
  components: {
    "v-autocomplete-list-customers": AutocompleteListCustomers,
    "v-autocomplete-list-customer-contacts": AutocompleteListCustomerContacts,
    "v-autocomplete-list-customer-locations": AutocompleteListCustomerLocations,
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
    const { fetchCreateEvent, fetchGetOneCustomer, fetchUpdateCustomer } =
      useAppStore();

    const isLoading = ref(false);
    const isLoadingGetSunat = ref(false);
    const formRef = ref(null);
    const event = ref({
      asunto: "",
      cliente: "",
      contacto: "",
      ubicacion: "",
      fecha_inicio: "",
      hora_inicio: "",
      fecha_final: "",
      hora_final: "",
      es_todo_el_dia: "",
      observacion: "",
    });

    onMounted(() => checkEditOrCreateEvent());

    const validationForm = {
      asunto: [(v) => !!v || "El asunto para el evento es requerido"],
      cliente: [(v) => validateExtern.client(v)],
      contacto: [(v) => validateExtern.contact(v)],
      ubicacion: [(v) => validateExtern.location(v)],
      fecha_inicio: [(v) => validateExtern.fecha_inicio(v)],
      hora_inicio: [(v) => validateExtern.hora_inicio(v)],
      fecha_final: [(v) => validateExtern.fecha_final(v)],
      hora_final: [(v) => validateExtern.hora_final(v)],
    };

    const validateExtern = {
      client: (v) => {
        if (!v) return "Seleccione un cliente";
      },
      contact: (v) => {
        if (!v) return "Seleccione un contacto ";
      },
      location: (v) => {
        if (!v) return "Seleccione una ubicacion";
      },
      fecha_inicio: (v) => {
        if (!v) return "Este campo es obligatorio";
      },
      hora_inicio: (v) => {
        if (!v && !event.value.es_todo_el_dia)
          return "Ingrese una hora de inicio";
      },
      fecha_final: (v) => {
        if (!v && !event.value.es_todo_el_dia)
          return "Ingrese una fecha de finalizacion";
      },
      hora_final: (v) => {
        if (!v && !event.value.es_todo_el_dia)
          return "Ingrese una hora para el fin del evento";
      },
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
            event.value.asunto = event.value.asunto.toLocaleUpperCase();

            if (event.value.es_todo_el_dia) {
              event.value.fecha_final = event.value.fecha_inicio;
            }

            const eventCreated = await fetchCreateEvent(event.value);
            notify({
              type: "success",
              text: "El evento se generó correctamente.",
            });
            emit("created", eventCreated.id);
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
          // event.value.tipo_documento = customerGet.tipo_documento;
          event.value.numero_documento = customerGet.numero_documento;
          event.value.razon_social = customerGet.razon_social;
          event.value.sub_sector = customerGet.sub_sector;
        } catch (error) {
          notify({ type: "error", text: error.message });
        }
      } else {
        // event.value.tipo_documento = "RUC";
      }
    };

    const getClienteSelected = ([idCustomerSelected]) => {
      event.value.cliente = idCustomerSelected;
    };
    const getContactSelected = ([idContactSelected]) => {
      event.value.contacto = idContactSelected;
    };
    const getLocationSelected = ([idLocationSelected]) => {
      event.value.ubicacion = idLocationSelected;
    };

    const isMobile = computed(() => mobile.value);
    const emitCloseComponent = () => emit("close");
    return {
      isLoading,
      formRef,
      event,
      validationForm,
      validateExtern,
      businessSectorsList,
      listTypesOfTaxpayers,
      isMobile,
      isLoadingGetSunat,
      validateAndCreateCustomer,
      emitCloseComponent,
      listReasonsForEvent,
      getClienteSelected,
      getContactSelected,
      getLocationSelected,
    };
  },
});
</script>
