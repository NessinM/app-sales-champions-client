<template lang="pug">
form(@submit.prevent="validateAndSaveChangesCustomer")
  v-row(no-gutters)
    v-col(cols="12", lg="6", md="6", sm="12")
      v-select.mx-2.text-slate-600.my-1(
        v-model="tipo_documento.value.value",
        label="Tipo de documento",
        :error-messages="tipo_documento.errorMessage.value",
        :items="lista_tipos_contribuyente",
        item-title="name",
        item-value="value",
        variant="outlined",
        density="compact",
        color="primary"
      )
    v-col(cols="12", lg="6", md="6", sm="12")
      v-text-field.mx-2.text-slate-600.my-1(
        v-model.number="numero_documento.value.value",
        label="Numero de documento",
        :error-messages="numero_documento.errorMessage.value",
        variant="outlined",
        density="compact",
        color="primary",
        type="number",
        :disabled="isLoadingSunat",
        :append-inner-icon="!isLoadingSunat ? '$mdiEyeOff' : ''",
        min="0"
      )
        template(#append-inner)
          v-fade-transition(leave-absolute="")
            v-progress-circular(
              v-if="isLoadingSunat",
              color="primary",
              indeterminate="",
              size="20"
            )
            img.cursor-pointer(
              v-else,
              height="24",
              width="24",
              src="/assets/logo_sunat.png",
              alt="",
              @click="obtenerDatosSunat"
            )
    v-col(cols="12", lg="6", md="6", sm="12")
      v-text-field.mx-2.text-slate-600.my-1(
        v-model="razon_social.value.value",
        label="Nombre o razon social",
        :error-messages="razon_social.errorMessage.value",
        variant="outlined",
        density="compact",
        color="primary"
      )
    v-col(cols="12", lg="6", md="6", sm="12")
      v-select.mx-2.text-slate-600.my-1(
        label="Sub sector",
        :items="lista_sectores",
        item-title="name",
        item-value="value",
        variant="outlined",
        density="compact",
        color="primary"
      )
    v-col(cols="12", lg="6", md="6", sm="12")
      v-select.mx-2.text-slate-600.my-1(
        v-model="tipo_cliente.value.value",
        label="Canal sales champion",
        :error-messages="tipo_cliente.errorMessage.value",
        :items="['DJI', 'MSI', 'CANON', 'RISO']",
        variant="outlined",
        density="compact",
        color="primary"
      )
    v-col(cols="12", lg="6", md="6", sm="12")
      v-select.mx-2.text-slate-600.my-1(
        v-model="tipo_cliente.value.value",
        label="Sede principal",
        :error-messages="tipo_cliente.errorMessage.value",
        :items="['DJI', 'MSI', 'CANON', 'RISO']",
        variant="outlined",
        density="compact",
        color="primary"
      )
</template>
<script>
import { computed, defineComponent, ref } from "vue";
import * as yup from "yup";
import { es } from "yup-locales";
import { useField, useForm } from "vee-validate";
import { useTheme } from "vuetify/lib/framework.mjs";
import { useAppStore } from "../store";
import { notify } from "@kyvg/vue3-notification";

yup.setLocale(es);

export default defineComponent({
  name: "ComponentFormCustomer",
  props: {
    customerId: {
      type: String,
      default: "",
    },
  },
  setup() {
    const validationSchema = yup.object({
      tipo_documento: yup.string().required().label("Tipo de documento"),
      email_notificacion: yup
        .string()
        .required()
        .label("Email de notificacion"),
      numero_documento: yup.number().required().label("Numero de documento"),
      razon_social: yup.string().required().label("Nombre o razon social"),
      direccion_fiscal: yup.string().required().label("Direccion fiscal"),
      referencia_direccion_fiscal: yup.string().required().label("Referencia"),
      departamento: yup.string().required().label("Deparmamento"),
      provincia: yup.string().required().label("Provincia"),
      distrito: yup.string().required().label("Distrito"),
      codigo_ubigeo: yup.string().required().label("Codigo de ubigeo"),
      tipo_cliente: yup.string().required().label("Tipo de cliente"),
      profesion_ocupacion: yup
        .string()
        .required()
        .label("Profesion u ocupacion"),
      activo: yup.number().label("cliente activo"),
    });

    const { mobile } = useTheme();

    const { fetchSaveChangesCustomer } = useAppStore();

    const isLoadingSaveChanges = ref(false);
    const customer = ref(null);

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
        name: "Documento nacional de identidad (DNI)",
        valor: "dni",
      },
      {
        name: "Carnet de extranjeria (CE)",
        valor: "carnet_de_extranjeria",
      },
      {
        name: "Registro unico de contribuyentes (RUC)",
        valor: "ruc",
      },
      {
        name: "Pasaporte (PAS)",
        valor: "pasaporte",
      },
    ]);

    const tipo_documento = useField("tipo_documento", validationSchema);
    const numero_documento = useField("numero_documento", validationSchema);
    const razon_social = useField("razon_social", validationSchema);
    const sub_sector = useField("sub_sector", validationSchema);
    const ubicacion_fiscal = useField("ubicacion_fiscal", validationSchema);
    const tipo_cliente = useField("tipo_cliente", validationSchema);
    const { handleSubmit } = useForm({ validationSchema });

    const validateAndSaveChangesCustomer = handleSubmit(
      async (dataAfterValidation) => {
        try {
          isLoadingSaveChanges.value = true;
          await fetchSaveChangesCustomer(
            customer.value.id,
            dataAfterValidation
          );
          notify({
            type: "success",
            text: "Los cambios se guardaron correctamente",
          });
        } catch (error) {
          notify({ type: "error", text: error.message });
        } finally {
          isLoadingSaveChanges.value = false;
        }
      }
    );

    const isMobile = computed(() => mobile.value);
    return {
      tipo_documento,
      numero_documento,
      razon_social,
      sub_sector,
      ubicacion_fiscal,
      tipo_cliente,
      lista_sectores,
      lista_tipos_contribuyente,
      validateAndSaveChangesCustomer,
      isMobile,
    };
  },
});
</script>
