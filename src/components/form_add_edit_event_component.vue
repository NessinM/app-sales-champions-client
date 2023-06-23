<template lang="pug">
v-card-title.flex.items-center.pb-0.pt-4.px-6(
  :class="isMobile ? 'bg-primary elevation-4' : ''"
)
  span.font-extrabold.text-lg {{ eventId ? "Editar evento" : "Nuevo evento" }}
  .flex.items-center.justify-center.py-8.flex-col(v-if="isLoadingGetEvent")
    v-progress-linear(indeterminate="", color="primary")
    small.mt-3.font-bold.text-sm Obteniendo informacion del evento
  v-tabs.mt-4(
    v-if="!isLoadingGetEvent && eventId",
    v-model="tabEdit",
    :color="isMobile ? 'white' : 'primary'",
    grow="",
    density="compact",
    align-tabs="end"
  )
    v-tab(:value="1")
      span.text-xs.font-bold Acciones
    v-tab(:value="2")
      span.text-xs.font-bold Resumen
    v-tab(:value="3")
      span.text-xs.font-bold Detalles
v-card-text(v-if="!isLoadingGetEvent")
  div(v-if="tabEdit === 1")
    v-row.pt-2.mb-4(v-if="eventId")
      v-col(cols="12", lg="6", md="6", sm="12")
        v-hover(v-slot="{ isHovering, props }")
          v-card.pa-4(
            color="warning",
            :rounded="5",
            height="120",
            v-bind="props",
            :class="{ 'elevation-6': isHovering }",
            @click="updateEvent"
          )
            .flex.flex-col.items-center
              v-icon(icon="$mdiRayStartArrow", size="55", color="white")
              span.text-md.font-extrabold.text-white Marcar llegada
      v-col(cols="12", lg="6", md="6", sm="12")
        v-hover(v-slot="{ isHovering, props }")
          v-card.pa-4(
            color="success",
            :rounded="5",
            height="120",
            v-bind="props",
            :class="{ 'elevation-6': isHovering }",
            @click="() => {}"
          )
            .flex.flex-col.items-center
              v-icon(icon="$mdiRayEndArrow", size="55", color="white")
              span.text-md.font-extrabold.text-white Marcar salida
  div(v-if="tabEdit === 2")
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
            :customer-id="event.cliente",
            :error-message="validateExtern.client(event.cliente)",
            @updated="getClienteSelected"
          )
        v-col(cols="12", lg="12", md="12", sm="12")
          v-autocomplete-list-customer-contacts.my-2(
            label="Seleccionar un contacto",
            :customer-contact-id="event.contacto",
            :customer-id="event?.cliente",
            :error-message="validateExtern.contact(event.contacto)",
            @updated="getContactSelected"
          )
        v-col(cols="12", lg="12", md="12", sm="12")
          v-autocomplete-list-customer-locations.my-2(
            label="Seleccionar una ubicacion",
            :customer-location-id="event.ubicacion",
            :customer-id="event?.cliente",
            :error-message="validateExtern.location(event.ubicacion)",
            @updated="getLocationSelected"
          )
        v-col(cols="12", :lg="8", :md="8", sm="12")
          v-text-field.mx-2.text-slate-500.my-2(
            v-model="event.fecha_inicio",
            hide-details="auto",
            :rules="validationForm.fecha_inicio",
            :label="event.es_todo_el_dia ? 'Fecha para el evento' : 'Fecha y hora para el evento'",
            :type="event.es_todo_el_dia ? 'date' : 'datetime-local'",
            variant="outlined",
            density="compact",
            color="primary"
          )
        v-col(cols="12", lg="4", md="3", sm="12")
          v-switch.mx-2.text-slate-500.my-2(
            v-model="event.es_todo_el_dia",
            hide-details="auto",
            label="Todo el dia",
            color="primary",
            density="compact"
          )
        v-col(cols="12", lg="4", md="4", sm="12")
        v-col(cols="12", lg="12", md="12", sm="12")
          v-textarea.mx-2.text-slate-500.my-2(
            v-model="event.observacion",
            hide-details="auto",
            label="observacion",
            color="primary",
            auto-grow="",
            variant="outlined",
            rows="1",
            row-height="25",
            shaped=""
          )
  div(v-if="tabEdit === 3")
    v-row(no-gutters)
      v-col(cols="12", lg="5", md="5", sm="12")
        v-autocomplete.mx-2.text-slate-500.my-2(
          v-model="segmentoValor",
          label="Segmentos",
          :items="listSegments",
          density="compact",
          variant="outlined",
          item-title="name",
          item-value="value",
          color="primary",
          hide-details="auto"
        )
      v-col(cols="12", lg="5", md="5", sm="12")
        v-text-field.mx-2.text-slate-500.my-2(
          v-model="montoValor",
          hide-details="auto",
          label="Monto",
          type="number",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="2", md="2", sm="12")
        v-btn.mx-2.my-2(color="success", :rounded="5", @click="agregarOpcion")
          small.text-xs.font-bold.text-white Agregar
    .flex
      v-table
        thead
          tr
            th.text-left
              span.text-sm Segmento
            th.text-left
              span.text-sm Monto
            th.text-left

        tbody
          tr(v-for="(d, index) in detalles", :key="index")
            td
              span.font-bold.text-xs {{ d.descripcion }}
            td
              span.font-bold.text-xs {{ d.monto }}
            td
              v-btn.mx-2.my-2(
                color="error",
                :rounded="5",
                @click="eliminarOpcion(index)"
              )
                small.text-xs.font-bold.text-white Eliminar
    v-btn.mx-2.my-2(color="success", :rounded="5", @click="guardarSegmentos()")
      small.text-xs.font-bold.text-white Guardar segmentos

v-divider
.flex.pa-4(
  v-if="!isLoadingGetEvent && tabEdit === 2",
  :class="{ 'flex-col': isMobile, 'justify-end': !isMobile }"
)
  v-btn.ml-2.font-bold(
    color="error",
    :rounded="5",
    variant="tonal",
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
import { useAppStore, useMapStore } from "../store";
import { notify } from "@kyvg/vue3-notification";
import AutocompleteListCustomers from "@/components/autocomplete_list_customers_component.vue";
import AutocompleteListCustomerContacts from "@/components/autocomplete_list_customers_contacts_component.vue";
import AutocompleteListCustomerLocations from "@/components/autocomplete_list_customers_locations_component.vue";
import {
  listTypesOfTaxpayers,
  businessSectorsList,
  listReasonsForEvent,
  listSegments,
} from "@/helps/constants";
import moment from "moment";
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
    const { userLocation } = useMapStore();
    const {
      fetchCreateEvent,
      fetchGetOneEvent,
      fetchUpdateEvent,
      fetchGetListSegmentsByEvent,
      fetchCreateSegmentsToEvent,
    } = useAppStore();

    const tabEdit = ref(1);
    const isLoadingGetEvent = ref(false);
    const isLoading = ref(false);
    const isLoadingGetSunat = ref(false);
    const detalles = ref([]);
    const formRef = ref(null);
    const event = ref({
      asunto: "",
      cliente: "",
      contacto: "",
      ubicacion: "",
      fecha_inicio: "",
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
    };

    const updateEvent = async () => {
      try {
        const [lat, long] = userLocation;
        const event = await fetchUpdateEvent(eventId.value, {
          longitude_llegada: long,
          latitude_llegada: lat,
          fecha_llegada: new Date(),
        });
        console.log("event", event);
        notify({ type: "success", text: "Exito" });
      } catch (error) {
        notify({ type: "error", text: error.message });
      }
    };

    const validateAndCreateCustomer = async () => {
      try {
        const { valid } = await formRef.value.validate();
        if (valid) {
          isLoading.value = true;
          if (eventId.value) {
            await fetchUpdateEvent(eventId.value, {
              ...event.value,
              fecha_inicio: moment(
                event.value.fecha_inicio,
                "YYYY-MM-DDTHH:mm"
              ).toDate(),
            });

            emit("updated", eventId.value);
            emit("close");
          } else {
            // event.value.asunto = event.value.asunto.toLocaleUpperCase();

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
          isLoadingGetEvent.value = true;
          const response = await fetchGetOneEvent(eventId.value);
          event.value.asunto = response.asunto;
          event.value.cliente = response.cliente.id;
          event.value.contacto = response.contacto.id;
          event.value.ubicacion = response.ubicacion.id;
          event.value.fecha_inicio = moment(response.fecha_inicio).format(
            "YYYY-MM-DDTHH:mm"
          );
          event.value.observacion = response.observacion;
          const { segments } = await fetchGetListSegmentsByEvent(eventId.value);
          detalles.value = segments;
          isLoadingGetEvent.value = false;
        } catch (error) {
          notify({ type: "error", text: error.message });
          emit("close");
        }
      } else {
        tabEdit.value = 2;
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

    const segmentoValor = ref("");
    const montoValor = ref(0);

    const agregarOpcion = () => {
      detalles.value.push({
        descripcion: segmentoValor.value,
        monto: +montoValor.value,
      });
      segmentoValor.value = "";
      montoValor.value = 0;
    };
    const eliminarOpcion = (index) => {
      detalles.value.splice(index, 1);
    };

    const isMobile = computed(() => mobile.value);
    const emitCloseComponent = () => emit("close");

    const guardarSegmentos = async () => {
      await fetchCreateSegmentsToEvent(eventId.value, detalles.value);
      notify({
        type: "success",
        text: "Los cambios se guardarón correctamente.",
      });
    };
    return {
      detalles,
      eliminarOpcion,
      segmentoValor,
      montoValor,
      isLoading,
      isLoadingGetEvent,
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
      tabEdit,
      updateEvent,
      listSegments,
      agregarOpcion,
      guardarSegmentos,
    };
  },
});
</script>
