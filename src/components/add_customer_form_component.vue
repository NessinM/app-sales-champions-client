<template lang="pug">
v-form(ref="formRef")
  .flex.items-center.pb-4
    span.font-extrabold.text-lg Nuevo cliente
  v-row(no-gutters)
    v-col(cols="12", lg="12", md="12", sm="12")
      v-autocomplete.mx-2.text-slate-600.my-1(
        v-model="customer.tipo_documento",
        label="Tipo de documento",
        :items="lista_tipos_contribuyente",
        :rules="validationForm.tipo_documento",
        placeholder="Seleccione una opcion de la lista",
        item-title="name",
        item-value="value",
        variant="outlined",
        density="compact",
        color="primary"
      )
    v-col(
      cols="12",
      :lg="customer.tipo_documento === 'RUC' ? 8 : 12",
      md="12",
      sm="12"
    )
      v-text-field.mx-2.text-slate-600.my-1(
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
      v-if="customer.tipo_documento === 'RUC'",
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
      v-text-field.mx-2.text-slate-600.my-1(
        v-model="customer.razon_social",
        :rules="validationForm.razon_social",
        label="Nombre o razon social",
        variant="outlined",
        density="compact",
        color="primary"
      )
  .flex.pa-1(:class="{ 'flex-col': isMobile, 'justify-end': !isMobile }")
    v-btn.ml-2.font-bold.mb-4(
      color="error",
      :rounded="5",
      variant="text",
      @click="emitCloseComponent"
    )
      span.text-xs.font-bold cancelar
    v-btn.ml-2.font-bold(
      color="primary",
      :rounded="5",
      @click="validateAndCreateCustomer()"
    )
      small.text-xs.font-bold Crear cliente
</template>
<script>
import { computed, defineComponent, ref } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { useAppStore } from "../store";
import { notify } from "@kyvg/vue3-notification";
export default defineComponent({
  name: "ComponentFormCustomer",
  emits: ["created", "close"],
  setup(props, { emit }) {
    const { mobile } = useDisplay();
    const {
      fetchCreateCustomer,
      fetchEditCustomer,
      fetchGetCustomeroOfSunat,
      fetchCreateCustomerLocation,
    } = useAppStore();

    const validationForm = {
      tipo_documento: [(v) => !!v || "El tipo de documento e requerido"],
      numero_documento: [
        (v) => !!v || "El numero de documento es requerido",
        (v) => validateForDocumentNumber(v),
      ],
      razon_social: [(v) => !!v || "La razon social es requerido"],
    };

    const isLoading = ref(false);
    const isLoadingGetSunat = ref(false);
    const formRef = ref(null);
    const customer = ref({
      tipo_documento: "RUC",
      numero_documento: "",
      razon_social: "",
    });
    const location = ref({
      direccion: "",
      referencia_direccion: "",
      tipo_via: "",
      calle_numero: "",
      departamento: "",
      provincia: "",
      distrito: "",
      codigo_ubigeo: "",
    });
    const lista_sectores = ref([
      {
        name: "Banca y seguros",
        value: "banca y seguros",
      },
      {
        name: "Centros fotograficos",
        value: "centros fotograficos",
      },
      {
        name: "Club wide format",
        value: "club wide format",
      },
      {
        name: "Comercios minoristas",
        value: "comercios minoristas",
      },
      {
        name: "Construccion e inmobiliarias",
        value: "construccion e inmobiliarias",
      },
      {
        name: "Copistas",
        value: "copistas",
      },
      {
        name: "Cuentas estrategicas",
        value: "cuentas estrategicas",
      },
      {
        name: "Distribuidor premium",
        value: "Distribuidor premium",
      },
      {
        name: "Distribuidor top",
        value: "Distribuidor top",
      },
      {
        name: "Distribuidores",
        value: "distribuidores",
      },
      {
        name: "Educacion",
        value: "educacion",
      },
      {
        name: "Gobierno",
        value: "gobierno",
      },
      {
        name: "Imprentas y servicios de impresion",
        value: "imprentas y servicios de impresion",
      },
      {
        name: "Logistica",
        value: "logistica",
      },
      {
        name: "Manufactura y comercio",
        value: "manufactura y comercio",
      },
      {
        name: "Mayorista",
        value: "mayorista",
      },
      {
        name: "Mineria, energia y petroleo",
        value: "mineria, energia y petroleo",
      },
      {
        name: "Notarias, servicios contables y consultoras",
        value: "notarias, servicios contables y consultoras",
      },
      {
        name: "Retail",
        value: "retail",
      },
      {
        name: "Salud y farmaceutica",
        value: "salud y farmaceutica",
      },
      {
        name: "Telecomunicaciones y medios de comunicacion",
        value: "telecomunicaciones y medios de comunicacion",
      },
      {
        name: "Usuario final",
        value: "usuario final",
      },
    ]);
    const lista_tipos_contribuyente = ref([
      {
        name: "Registro unico de contribuyentes (RUC)",
        value: "RUC",
      },
      {
        name: "Documento nacional de identidad (DNI)",
        value: "DNI",
      },
      {
        name: "Carnet de extranjeria (CE)",
        value: "CE",
      },
      {
        name: "Pasaporte (PAS)",
        value: "PAS",
      },
    ]);

    const obtenerDatosSunat = async () => {
      try {
        isLoadingGetSunat.value = true;
        const responseSunat = await fetchGetCustomeroOfSunat(
          customer.value.numero_documento
        );

        customer.value.razon_social = responseSunat.nombre_o_razon_social;
        location.value.direccion = responseSunat.direccion;
        location.value.referencia_direccion = responseSunat.direccion_completa;
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

    const validateForDocumentNumber = (v) => {
      if (customer.value.tipo_documento === "DNI" && v.length < 8)
        return "El numero de DNI no ser menor a 8 caracteres";
      if (customer.value.tipo_documento === "DNI" && v.length > 8)
        return "El numero de DNI no puede ser mayor a 8 caracteres";
      if (customer.value.tipo_documento === "RUC" && v.length < 11)
        return "El numero de RUC no ser menor a 11 caracteres";
      if (customer.value.tipo_documento === "RUC" && v.length > 11)
        return "El numero de RUC no puede ser mayor a 11 caracteres";
    };

    const validateAndCreateCustomer = async () => {
      try {
        const { valid } = await formRef.value.validate();
        if (valid) {
          isLoading.value = true;
          const customerCreated = await fetchCreateCustomer(customer.value);
          if (location.value.direccion && location.value.codigo_ubigeo) {
            const customerLocationCreated = await fetchCreateCustomerLocation(
              customerCreated.id,
              location.value
            );
            await fetchEditCustomer(customerCreated.id, {
              ubicacionId: customerLocationCreated.id,
            });
          }
          notify({
            type: "success",
            text: "El cliente se generó correctamente.",
          });
          // await formRef.value.reset();
          emit("created", customerCreated);
        }
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoading.value = false;
      }
    };

    const isMobile = computed(() => mobile.value);
    const emitCloseComponent = () => emit("close");
    return {
      isLoading,
      formRef,
      customer,
      validationForm,
      lista_sectores,
      lista_tipos_contribuyente,
      isMobile,
      obtenerDatosSunat,
      isLoadingGetSunat,
      validateAndCreateCustomer,
      emitCloseComponent,
    };
  },
});
</script>
