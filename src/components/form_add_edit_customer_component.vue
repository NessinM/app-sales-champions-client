<template lang="pug">
v-card-title.flex.items-center.py-2(
  :class="{ 'bg-primary elevation-3': isMobile }"
)
  v-btn.mr-3(
    v-if="isMobile",
    icon="",
    size="small",
    flat,
    color="primary",
    @click="emitCloseComponent()"
  )
    v-icon(icon="$mdiArrowLeft", size="25 ")
  span.font-extrabold.text-sm {{ customerId ? "Editar cliente" : "Nuevo cliente" }}
v-card-text.pa-6
  v-form(ref="formRef")
    v-row(no-gutters)
      v-col(v-if="!customerId", cols="12", lg="12", md="12", sm="12")
        v-autocomplete.mx-2.text-slate-500(
          v-model="customer.tipo_documento",
          label="Tipo de documento",
          :items="listTypesOfTaxpayers",
          :rules="validationForm.tipo_documento",
          placeholder="Seleccione una opcion de la lista",
          item-title="name",
          item-value="value",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(
        v-if="!customerId",
        cols="12",
        :lg="customer.tipo_documento === 'RUC' ? 8 : 12",
        md="12",
        sm="12"
      )
        v-text-field.mx-2.text-slate-500(
          v-model="customer.numero_documento",
          :loading="isLoadingGetSunat",
          :rules="validationForm.numero_documento",
          label="Numero de documento",
          variant="outlined",
          density="compact",
          color="primary",
          type="number",
          :disabled="isLoadingGetSunat"
        )
          template(#append-inner)
            v-fade-transition(leave-absolute="")
              v-progress-circular(
                v-if="isLoadingGetSunat",
                color="primary",
                indeterminate="",
                size="20"
              )
      v-col(
        v-if="customer.tipo_documento === 'RUC' && !customerId",
        cols="12",
        lg="4",
        md="12",
        sm="12"
      )
        .flex
          v-btn.mt-1.flex-1.mx-2(
            color="white",
            :rounded="5",
            :class="{ 'mb-5': isMobile }",
            @click="customer.numero_documento ? obtenerDatosSunat() : ''"
          )
            img.cursor-pointer.mr-1(
              height="24",
              width="20",
              src="/assets/logo_sunat.png",
              alt=""
            )
            small.text-xs.font-bold SUNAT
      v-col(cols="12", lg="12", md="12", sm="12")
        v-text-field.mx-2.text-slate-500(
          v-model="customer.razon_social",
          :rules="validationForm.razon_social",
          label="Nombre o razon social",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(
        v-if="customerId && !isLoadingGetCustomerToEdit",
        cols="12",
        lg="12",
        md="12",
        sm="12"
      )
        v-autocomplete.mx-2.text-slate-500(
          v-model="customer.sub_sector",
          label="Sector",
          :items="businessSectorsList",
          placeholder="Seleccione una opcion de la lista",
          item-title="name",
          item-value="value",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(
        v-if="customerId && !isLoadingGetCustomerToEdit",
        cols="12",
        lg="12",
        md="12",
        sm="12"
      )
        v-autocomplete-list-customer-locations.mb-5(
          label="Seleccionar una ubicacion principal",
          :customer-location-id="customer.ubicacionId",
          :customer-id="customerId",
          @updated="getLocationSelected"
        )
      v-col(
        v-if="customerId && !isLoadingGetCustomerToEdit",
        cols="12",
        lg="12",
        md="12",
        sm="12"
      )
        v-autocomplete-list-customer-contacts.mb-5(
          label="Seleccionar un contacto principal",
          :customer-contact-id="customer.contactoId",
          :customer-id="customerId",
          @updated="getContactSelected"
        )
      v-col(v-if="customerId", cols="12", lg="12", md="12", sm="12")
        v-text-field.mx-2.text-slate-500(
          v-model="customer.codigo_sap",
          disabled,
          label="Codigo SAP",
          variant="outlined",
          density="compact",
          color="primary"
        )
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
    small.text-xs.font-bold.text-white {{ customerId ? "Guardar cambios" : "Crear cliente" }}
</template>
<script>
import { computed, defineComponent, onMounted, ref, toRefs } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { useAppStore } from "../store";
import { notify } from "@kyvg/vue3-notification";
import { listTypesOfTaxpayers, businessSectorsList } from "@/helps/constants";
import AutocompleteListCustomerContacts from "@/components/autocomplete_list_customers_contacts_component.vue";
import AutocompleteListCustomerLocations from "@/components/autocomplete_list_customers_locations_component.vue";
export default defineComponent({
  name: "ComponentFormCustomer",
  components: {
    "v-autocomplete-list-customer-contacts": AutocompleteListCustomerContacts,
    "v-autocomplete-list-customer-locations": AutocompleteListCustomerLocations,
  },
  props: {
    customerId: {
      type: String,
      default: "",
    },
  },
  emits: ["created", "updated", "close"],
  setup(props, { emit }) {
    const { customerId } = toRefs(props);
    const { mobile } = useDisplay();
    const {
      fetchGetOneCustomer,
      fetchCreateCustomer,
      fetchUpdateCustomer,
      fetchGetCustomerOfSunat,
      fetchCreateCustomerLocation,
    } = useAppStore();

    const isLoading = ref(false);
    const isLoadingGetCustomerToEdit = ref(false);
    const isLoadingGetSunat = ref(false);
    const formRef = ref(null);

    const customer = ref({
      tipo_documento: "",
      numero_documento: "",
      razon_social: "",
      contactoId: "",
      ubicacionId: "",
      codigo_sap: "",
    });

    onMounted(() => checkEditOrCreateCustomer());

    const location = ref({
      titulo: "Sede principal - (fiscal)",
      direccion: "",
      referencia_direccion: "",
      tipo_via: "",
      calle_numero: "",
      departamento: "",
      provincia: "",
      distrito: "",
      codigo_ubigeo: "",
      sub_sector: "",
    });

    const obtenerDatosSunat = async () => {
      try {
        isLoadingGetSunat.value = true;
        const responseSunat = await fetchGetCustomerOfSunat(
          customer.value.numero_documento
        );

        customer.value.razon_social = responseSunat.nombre_o_razon_social;
        location.value.direccion = responseSunat.direccion_completa;
        location.value.referencia_direccion = "";
        location.value.tipo_via = responseSunat.tipo_de_via;
        location.value.calle_numero = responseSunat.numero;
        location.value.departamento = responseSunat.departamento;
        location.value.provincia = responseSunat.provincia;
        location.value.distrito = responseSunat.distrito;
        location.value.codigo_ubigeo = responseSunat.ubigeo;
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoadingGetSunat.value = false;
      }
    };

    const validationForm = {
      tipo_documento: [(v) => !!v || "El tipo de documento e requerido"],
      numero_documento: [(v) => validateForDocumentNumber(v)],
      razon_social: [(v) => !!v || "La razon social es requerido"],
    };

    const validateForDocumentNumber = (v) => {
      if (!customer.value.tipo_documento)
        return "El numero de documento es requerido";
      if (customer.value.tipo_documento === "DNI" && v.length < 8)
        return "El numero de DNI no ser menor a 8 caracteres";
      if (customer.value.tipo_documento === "DNI" && v.length > 8)
        return "El numero de DNI no puede ser mayor a 8 caracteres";
      if (customer.value.tipo_documento === "RUC" && v.length < 11)
        return "El RUC no puede ser menor a 11 caracteres";
      if (customer.value.tipo_documento === "RUC" && v.length > 11)
        return "El numero de RUC no puede ser mayor a 11 caracteres";
    };

    const validateAndCreateCustomer = async () => {
      try {
        const { valid } = await formRef.value.validate();
        if (valid) {
          isLoading.value = true;
          if (customerId.value) {
            await fetchUpdateCustomer(customerId.value, customer.value);
            notify({
              type: "success",
              text: "Los cambios se guardarón correctamente.",
            });
            emit("updated", customerId.value);
            emit("close");
          } else {
            const customerCreated = await fetchCreateCustomer(customer.value);
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
              text: "El cliente se generó correctamente.",
            });
            console.log("customerCreated", customerCreated);
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

    const checkEditOrCreateCustomer = async () => {
      isLoadingGetCustomerToEdit.value = true;
      if (customerId.value) {
        try {
          const customerGet = await fetchGetOneCustomer(customerId.value);
          customer.value.tipo_documento = customerGet.tipo_documento;
          customer.value.numero_documento = customerGet.numero_documento;
          customer.value.razon_social = customerGet.razon_social;
          customer.value.sub_sector = customerGet.sub_sector;
          customer.value.ubicacionId = customerGet.ubicacionId;
          customer.value.contactoId = customerGet.contactoId;
          customer.value.codigo_sap = customerGet.codigo_sap;
        } catch (error) {
          notify({ type: "error", text: error.message });
        } finally {
          isLoadingGetCustomerToEdit.value = false;
        }
      } else {
        customer.value.tipo_documento = "RUC";
        isLoadingGetCustomerToEdit.value = false;
      }
    };

    const getContactSelected = ([idContactSelected]) => {
      customer.value.contactoId = idContactSelected;
    };
    const getLocationSelected = ([idLocationSelected]) => {
      customer.value.ubicacionId = idLocationSelected;
    };

    const isMobile = computed(() => mobile.value);
    const emitCloseComponent = () => emit("close");
    return {
      isLoading,
      isLoadingGetCustomerToEdit,
      formRef,
      customer,
      validationForm,
      businessSectorsList,
      listTypesOfTaxpayers,
      isMobile,
      obtenerDatosSunat,
      isLoadingGetSunat,
      validateAndCreateCustomer,
      emitCloseComponent,
      getContactSelected,
      getLocationSelected,
    };
  },
});
</script>
