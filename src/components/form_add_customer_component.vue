<template lang="pug">
v-card-title.flex.items-center.py-4.mx-2
  span.font-extrabold.text-lg Nuevo cliente
v-card-text
  v-form(ref="formRef")
    v-row(no-gutters)
      v-col(cols="12", lg="12", md="12", sm="12")
        v-autocomplete.mx-2.text-slate-600.my-1(
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
      v-col(cols="12", lg="12", md="12", sm="12")
        v-autocomplete.mx-2.text-slate-600.my-1(
          v-model="customer.sub_sector",
          label="Sub sector",
          :items="businessSectorsList",
          placeholder="Seleccione una opcion de la lista",
          item-title="name",
          item-value="value",
          variant="outlined",
          density="compact",
          color="primary"
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
    small.text-xs.font-bold.text-white Crear cliente
</template>
<script>
import { computed, defineComponent, ref } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { useAppStore } from "../store";
import { notify } from "@kyvg/vue3-notification";
import { listTypesOfTaxpayers, businessSectorsList } from "@/helps/constants";
export default defineComponent({
  name: "ComponentFormCustomer",
  emits: ["created", "close"],
  setup(props, { emit }) {
    const { mobile } = useDisplay();
    const {
      fetchCreateCustomer,
      fetchUpdateCustomer,
      fetchGetCustomerOfSunat,
      fetchCreateCustomerLocation,
    } = useAppStore();

    const validationForm = {
      tipo_documento: [(v) => !!v || "El tipo de documento e requerido"],
      numero_documento: [(v) => validateForDocumentNumber(v)],
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
      nombre: "Direccion fiscal",
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
      if (!customer.value.tipo_documento)
        return "El numero de documento es requerido";
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
            await fetchUpdateCustomer(customerCreated.id, {
              ubicacionId: customerLocationCreated.id,
            });
          }
          notify({
            type: "success",
            text: "El cliente se generó correctamente.",
          });
          // await formRef.value.reset();
          emit("created", customerCreated.id);
          emit("close");
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
      businessSectorsList,
      listTypesOfTaxpayers,
      isMobile,
      obtenerDatosSunat,
      isLoadingGetSunat,
      validateAndCreateCustomer,
      emitCloseComponent,
    };
  },
});
</script>
