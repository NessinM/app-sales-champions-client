<template lang="pug">
v-card-title.flex.items-center.py-2.bg-primary(v-if="isMobile")
  v-btn.mr-3(
    icon="",
    size="small",
    flat,
    color="primary",
    @click="emitCloseComponent()"
  )
    v-icon(icon="$mdiArrowLeft", size="25 ")
  span.font-extrabold.text-sm {{ eventId ? "Editar evento" : "Nuevo evento" }}
v-divider(v-if="isMobile")
v-card-text.pa-6
  v-row(no-gutters)
    v-col(v-if="eventId", cols="12", lg="6", md="6", sm="12")
      .pa-2.h-full
        v-card.pa-6.rounded-md.h-full(
          color="primary",
          variant="tonal",
          elevation="0"
        )
          .flex.justify-center.items-center.flex-col.h-full
            img.h-16.w-16.rounded-full(
              src="https://randomuser.me/api/portraits/men/24.jpg",
              alt="Randy Robertson"
            )
            p.pt-2.text-lg.font-extrabold.text-primary
              | Randy Robertson
            p.text-xs.text-slate-400
              | randy.robertson@example.com
            .flex.mt-6.z-10.pa-4
              v-btn.mx-2(icon="$mdiPencil", color="primary")
              v-btn.mx-2(icon="$mdiPhone", color="blue")
              v-btn.mx-2(color="success", icon)
                v-icon(icon="$mdiWhatsapp", size="22", color="white")
    v-col(cols="12", lg="6", md="6", sm="12")
      //- v-hover(v-slot="{ isHovering, props }")
      //-   v-card.pa-4(
      //-     :disabled="fecha_llegada",
      //-     color="warning",
      //-     :rounded="5",
      //-     height="130",
      //-     v-bind="props",
      //-     :class="{ 'elevation-6': isHovering }",
      //-     @click="setActionEvent('llegada')"
      //-   )
      //-     .flex.flex-col.items-center
      //-       v-icon(icon="$mdiRayStartArrow", size="55", color="white")
      //-       span.text-md.font-extrabold.text-white Marcar llegada
      //-       span.text-xs.font-normal.text-white {{ fecha_llegada }}
      //- v-hover(v-slot="{ isHovering, props }")
      //-   v-card.pa-4(
      //-     :disabled="!fecha_llegada || fecha_salida",
      //-     color="success",
      //-     :rounded="5",
      //-     height="130",
      //-     v-bind="props",
      //-     :class="{ 'elevation-6': isHovering }",
      //-     @click="setActionEvent('salida')"
      //-   )
      //-     .flex.flex-col.items-center
      //-       v-icon(icon="$mdiRayEndArrow", size="55", color="white")
      //-       span.text-md.font-extrabold.text-white Marcar salida
      //-       span.text-xs.font-normal.text-white {{ fecha_salida }}
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
              :customer-id="event.clienteId",
              :error-message="validateExtern.client(event.clienteId)",
              @updated="getClienteSelected"
            )
          v-col(cols="12", lg="12", md="12", sm="12")
            v-autocomplete-list-customer-contacts.my-2(
              label="Seleccionar un contacto",
              :customer-contact-id="event.contactoId",
              :customer-id="event?.clienteId",
              :error-message="validateExtern.contact(event.contactoId)",
              @updated="getContactSelected"
            )
          v-col(cols="12", lg="12", md="12", sm="12")
            v-autocomplete-list-customer-locations.my-2(
              label="Seleccionar una ubicacion",
              :customer-location-id="event.ubicacionId",
              :customer-id="event?.clienteId",
              :error-message="validateExtern.location(event.ubicacionId)",
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
      //- v-card(flat, :disabled="fecha_salida")
    //-   v-row(no-gutters)
    //-     v-col(cols="12", lg="6", md="6", sm="12")
    //-       v-autocomplete.mx-2.text-slate-500.my-2(
    //-         v-model="segmentoValor",
    //-         label="Segmentos",
    //-         :items="listSegments",
    //-         density="compact",
    //-         variant="outlined",
    //-         item-title="name",
    //-         item-value="value",
    //-         color="primary",
    //-         hide-details="auto"
    //-       )
    //-     v-col(cols="12", lg="6", md="6", sm="12")
    //-       v-text-field.mx-2.text-slate-500.my-2(
    //-         v-model="montoValor",
    //-         hide-details="auto",
    //-         label="Monto",
    //-         type="number",
    //-         variant="outlined",
    //-         density="compact",
    //-         color="primary"
    //-       )
    //-   v-btn.mx-2.my-2.w-full(
    //-     color="success",
    //-     :rounded="5",
    //-     @click="agregarOpcion"
    //-   )
    //-     small.text-xs.font-bold.text-white Agregar
    //-   v-table(fixed-header)
    //-     thead
    //-       tr
    //-         th.text-left
    //-           span.text-sm Segmento
    //-         th.text-left
    //-           span.text-sm Monto
    //-         th.text-left

    //-     tbody
    //-       tr(v-for="(d, index) in detalles", :key="index")
    //-         td
    //-           span.font-bold.text-xs.uppercase {{ d.descripcion }}
    //-         td
    //-           span.font-bold.text-xs {{ d.monto }}
    //-         td.text-right
    //-           v-btn.mx-2.my-2(
    //-             color="error",
    //-             :rounded="5",
    //-             @click="eliminarOpcion(index)"
    //-           )
    //-             small.text-xs.font-bold.text-white Eliminar
    //- v-col(cols="12", lg="4", md="4", sm="12")
    //-   span ddd
//- v-card.pa-6

// --------------

//- v-card-title.flex.items-center.pb-0.pt-4.px-6(
//-   :class="isMobile ? 'bg-primary elevation-4' : ''"
//- )
//-   span.font-extrabold.text-lg {{ eventId ? "Editar evento" : "Nuevo evento" }}
//-   .flex.items-center.justify-center.py-8.flex-col(v-if="isLoadingGetEvent")
//-     v-progress-linear(indeterminate="", color="primary")
//-     small.mt-3.font-bold.text-sm Obteniendo informacion del evento
//-   v-tabs.mt-4(
//-     v-if="!isLoadingGetEvent && eventId",
//-     v-model="tabEdit",
//-     :color="isMobile ? 'white' : 'primary'",
//-     grow="",
//-     density="compact",
//-     align-tabs="end"
//-   )
//-     v-tab(:value="3")
//-       span.text-xs.font-bold Detalles
//-     v-tab(:value="2")
//-       span.text-xs.font-bold Resumen
//-     v-tab(:value="1")
//-       span.text-xs.font-bold Acciones
//- v-card-text(v-if="!isLoadingGetEvent")
//-   div(v-if="tabEdit === 1")
//-     v-row.pt-2.mb-4(v-if="eventId")
//-       v-col(cols="12", lg="6", md="6", sm="12")
//-         v-hover(v-slot="{ isHovering, props }")
//-           v-card.pa-4(
//-             :disabled="fecha_llegada",
//-             color="warning",
//-             :rounded="5",
//-             height="130",
//-             v-bind="props",
//-             :class="{ 'elevation-6': isHovering }",
//-             @click="setActionEvent('llegada')"
//-           )
//-             .flex.flex-col.items-center
//-               v-icon(icon="$mdiRayStartArrow", size="55", color="white")
//-               span.text-md.font-extrabold.text-white Marcar llegada
//-               span.text-xs.font-normal.text-white {{ fecha_llegada }}
//-       v-col(cols="12", lg="6", md="6", sm="12")
//-         v-hover(v-slot="{ isHovering, props }")
//-           v-card.pa-4(
//-             :disabled="!fecha_llegada || fecha_salida",
//-             color="success",
//-             :rounded="5",
//-             height="130",
//-             v-bind="props",
//-             :class="{ 'elevation-6': isHovering }",
//-             @click="setActionEvent('salida')"
//-           )
//-             .flex.flex-col.items-center
//-               v-icon(icon="$mdiRayEndArrow", size="55", color="white")
//-               span.text-md.font-extrabold.text-white Marcar salida
//-               span.text-xs.font-normal.text-white {{ fecha_salida }}
//-   v-card(v-if="tabEdit === 2", flat, :disabled="fecha_salida")
//-     v-form(ref="formRef")
//-       v-row(no-gutters)
//-         v-col(cols="12", lg="12", md="12", sm="12")
//-           v-autocomplete.mx-2.text-slate-500.my-2(
//-             v-model="event.asunto",
//-             hide-details="auto",
//-             label="Asunto",
//-             :items="listReasonsForEvent",
//-             :rules="validationForm.asunto",
//-             placeholder="Seleccione una opcion de la lista",
//-             item-title="name",
//-             item-value="value",
//-             variant="outlined",
//-             density="compact",
//-             color="primary"
//-           )
//-         v-col(cols="12", lg="12", md="12", sm="12")
//-           v-autocomplete-list-customers.my-2(
//-             label="Seleccionar un cliente",
//-             :customer-id="event.clienteId",
//-             :error-message="validateExtern.client(event.clienteId)",
//-             @updated="getClienteSelected"
//-           )
//-         v-col(cols="12", lg="12", md="12", sm="12")
//-           v-autocomplete-list-customer-contacts.my-2(
//-             label="Seleccionar un contacto",
//-             :customer-contact-id="event.contactoId",
//-             :customer-id="event?.clienteId",
//-             :error-message="validateExtern.contact(event.contactoId)",
//-             @updated="getContactSelected"
//-           )
//-         v-col(cols="12", lg="12", md="12", sm="12")
//-           v-autocomplete-list-customer-locations.my-2(
//-             label="Seleccionar una ubicacion",
//-             :customer-location-id="event.ubicacionId",
//-             :customer-id="event?.clienteId",
//-             :error-message="validateExtern.location(event.ubicacionId)",
//-             @updated="getLocationSelected"
//-           )
//-         v-col(cols="12", :lg="8", :md="8", sm="12")
//-           v-text-field.mx-2.text-slate-500.my-2(
//-             v-model="event.fecha_inicio",
//-             hide-details="auto",
//-             :rules="validationForm.fecha_inicio",
//-             :label="event.es_todo_el_dia ? 'Fecha para el evento' : 'Fecha y hora para el evento'",
//-             :type="event.es_todo_el_dia ? 'date' : 'datetime-local'",
//-             variant="outlined",
//-             density="compact",
//-             color="primary"
//-           )
//-         v-col(cols="12", lg="4", md="3", sm="12")
//-           v-switch.mx-2.text-slate-500.my-2(
//-             v-model="event.es_todo_el_dia",
//-             hide-details="auto",
//-             label="Todo el dia",
//-             color="primary",
//-             density="compact"
//-           )
//-         v-col(cols="12", lg="4", md="4", sm="12")
//-         v-col(cols="12", lg="12", md="12", sm="12")
//-           v-textarea.mx-2.text-slate-500.my-2(
//-             v-model="event.observacion",
//-             hide-details="auto",
//-             label="observacion",
//-             color="primary",
//-             auto-grow="",
//-             variant="outlined",
//-             rows="1",
//-             row-height="25",
//-             shaped=""
//-           )
//-   v-card(v-if="tabEdit === 3", flat, :disabled="fecha_salida")
//-     v-row(no-gutters)
//-       v-col(cols="12", lg="6", md="6", sm="12")
//-         v-autocomplete.mx-2.text-slate-500.my-2(
//-           v-model="segmentoValor",
//-           label="Segmentos",
//-           :items="listSegments",
//-           density="compact",
//-           variant="outlined",
//-           item-title="name",
//-           item-value="value",
//-           color="primary",
//-           hide-details="auto"
//-         )
//-       v-col(cols="12", lg="6", md="6", sm="12")
//-         v-text-field.mx-2.text-slate-500.my-2(
//-           v-model="montoValor",
//-           hide-details="auto",
//-           label="Monto",
//-           type="number",
//-           variant="outlined",
//-           density="compact",
//-           color="primary"
//-         )
//-     v-btn.mx-2.my-2.w-full(
//-       color="success",
//-       :rounded="5",
//-       @click="agregarOpcion"
//-     )
//-       small.text-xs.font-bold.text-white Agregar
//-     v-table(fixed-header)
//-       thead
//-         tr
//-           th.text-left
//-             span.text-sm Segmento
//-           th.text-left
//-             span.text-sm Monto
//-           th.text-left

//-       tbody
//-         tr(v-for="(d, index) in detalles", :key="index")
//-           td
//-             span.font-bold.text-xs.uppercase {{ d.descripcion }}
//-           td
//-             span.font-bold.text-xs {{ d.monto }}
//-           td.text-right
//-             v-btn.mx-2.my-2(
//-               color="error",
//-               :rounded="5",
//-               @click="eliminarOpcion(index)"
//-             )
//-               small.text-xs.font-bold.text-white Eliminar
//- v-divider
//- .flex.pa-4(
//-   v-if="!isLoadingGetEvent && tabEdit === 2",
//-   :class="{ 'flex-col': isMobile, 'justify-end': !isMobile }"
//- )
//-   v-btn.ml-2.font-bold(
//-     color="error",
//-     :rounded="5",
//-     variant="tonal",
//-     :class="{ 'mb-3': isMobile }",
//-     @click="emitCloseComponent"
//-   )
//-     span.text-xs.font-bold cancelar
//-   v-btn.ml-2.font-bold(
//-     color="success",
//-     :rounded="5",
//-     :disabled="fecha_salida",
//-     @click="validateAndCreateCustomer()"
//-   )
//-     small.text-xs.font-bold.text-white {{ eventId ? "Guardar cambios" : "Crear evento" }}
//- .flex.pa-4(
//-   v-if="!isLoadingGetEvent && tabEdit === 3",
//-   :class="{ 'flex-col': isMobile, 'justify-end': !isMobile }"
//- )
//-   v-btn.ml-2.font-bold(
//-     color="error",
//-     :rounded="5",
//-     variant="tonal",
//-     :class="{ 'mb-3': isMobile }",
//-     @click="emitCloseComponent"
//-   )
//-     span.text-xs.font-bold cancelar
//-   v-btn.ml-2.font-bold(
//-     color="success",
//-     :rounded="5",
//-     :disabled="fecha_salida",
//-     @click="guardarSegmentos()"
//-   )
//-     small.text-xs.font-bold.text-white Guardar detalles
v-divider(v-if="isMobile")
.flex.px-7.pb-6.justify-end(:class="{ 'pt-6': isMobile }")
  v-btn.ml-2.font-bold(
    v-if="!isMobile",
    color="error",
    :rounded="5",
    variant="tonal",
    @click="emitCloseComponent"
  )
    span.text-xs.font-bold cancelar
  v-btn.ml-2.font-bold(
    color="success",
    :rounded="5",
    :class="{ 'flex-1': isMobile }",
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

    const fecha_llegada = ref(undefined);
    const fecha_salida = ref(undefined);
    const event = ref({
      asunto: "",
      clienteId: "",
      contactoId: "",
      ubicacionId: "",
      fecha_inicio: "",
      es_todo_el_dia: "",
      observacion: "",
    });

    onMounted(() => checkEditOrCreateEvent());

    const validationForm = {
      asunto: [(v) => !!v || "El asunto para el evento es requerido"],
      clienteId: [(v) => validateExtern.client(v)],
      contactoId: [(v) => validateExtern.contact(v)],
      ubicacionId: [(v) => validateExtern.location(v)],
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

    const setActionEvent = async (type) => {
      if (type !== "llegada" && type !== "salida")
        return notify({
          type: "error",
          text: "Envie el tipo de accion que se desea realizar",
        });

      try {
        const [lat, long] = userLocation;

        const objEvent = {
          llegada: {
            longitude_llegada: long,
            latitude_llegada: lat,
            fecha_llegada: new Date(),
          },
          salida: {
            longitude_salida: long,
            latitude_salida: lat,
            fecha_salida: new Date(),
          },
        };
        const event = await fetchUpdateEvent(eventId.value, objEvent[type]);

        if (type === "llegada") {
          fecha_llegada.value = moment(event.fecha_llegada).format(
            "DD/MM/YYYY HH:mm"
          );
        } else if (type === "salida") {
          fecha_salida.value = moment(event.fecha_salida).format(
            "DD/MM/YYYY HH:mm"
          );
          emit("close");
        }
        console.log("event", event);
        notify({ type: "success", text: "La accion se marco correctamente" });
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

            if (detalles.value.length)
              await fetchCreateSegmentsToEvent(eventId.value, detalles.value);

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
          if (response.fecha_llegada) {
            fecha_llegada.value = moment(response.fecha_llegada).format(
              "DD/MM/YYYY HH:mm"
            );
          }
          if (response.fecha_salida) {
            fecha_salida.value = moment(response.fecha_salida).format(
              "DD/MM/YYYY HH:mm"
            );
          }
          event.value.clienteId = response.clienteId;
          event.value.contactoId = response.contactoId;
          event.value.ubicacionId = response.ubicacionId;
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
      event.value.clienteId = idCustomerSelected;
    };
    const getContactSelected = ([idContactSelected]) => {
      event.value.contactoId = idContactSelected;
    };
    const getLocationSelected = ([idLocationSelected]) => {
      event.value.ubicacionId = idLocationSelected;
    };

    const segmentoValor = ref("");
    const montoValor = ref(0);

    const agregarOpcion = () => {
      if (!segmentoValor.value || !montoValor.value) return;
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
      fecha_llegada,
      fecha_salida,
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
      setActionEvent,
      listSegments,
      agregarOpcion,
      guardarSegmentos,
    };
  },
});
</script>
