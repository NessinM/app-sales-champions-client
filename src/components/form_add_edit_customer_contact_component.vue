<template lang="pug">
v-card-title.flex.items-center.py-4.px-6
  span.font-extrabold.text-lg {{ customerContactId ? "Editar contacto" : "Nuevo contacto" }}
v-divider(v-if="isMobile")
v-card-text.py-0
  v-form(ref="formRef", :disabled="isLoading")
    v-row(no-gutters)
      v-col(cols="12", lg="6", md="6", sm="12")
        v-text-field.mx-2.text-slate-400.my-1(
          v-model="customerContact.nombre",
          :rules="validationForm.nombre",
          label="Nombre completo",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="6", md="6", sm="12")
        v-autocomplete.mx-2.text-slate-400.my-1(
          v-model="customerContact.tipo_documento",
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
      v-col(cols="12", lg="6", md="6", sm="12")
        v-text-field.mx-2.text-slate-400.my-1(
          v-model="customerContact.numero_documento",
          :rules="validationForm.numero_documento",
          label="Numero de documento",
          variant="outlined",
          density="compact",
          color="primary",
          type="number"
        )
      v-col(cols="12", lg="6", md="6", sm="12")
        v-autocomplete.mx-2.text-slate-400.my-1(
          v-model="customerContact.cargo",
          label="Cargo",
          :items="listPositionsInCompany",
          :rules="validationForm.cargo",
          placeholder="Seleccione una opcion de la lista",
          item-title="name",
          item-value="value",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="6", md="6", sm="12")
        v-text-field.mx-2.text-slate-400.my-1(
          v-model="customerContact.correo_electronico",
          :rules="validationForm.correo_electronico",
          label="Correo electronico",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="6", md="6", sm="12")
        v-text-field.mx-2.text-slate-400.my-1(
          v-model="customerContact.numero_telefono",
          label="Numero de telefono",
          variant="outlined",
          density="compact",
          color="primary"
        )

v-divider(v-if="isMobile")
.flex.justify-end.px-6.py-6.mx-2
  v-btn(
    color="error",
    variant="text",
    :rounded="5",
    :disabled="isLoading",
    @click="emitCloseComponent()"
  )
    span.font-bold.text-xs cancelar
  v-btn.ml-4(
    color="success",
    :rounded="5",
    :disabled="isLoading",
    :loading="isLoading",
    @click="validateAndCreateCustomerContact()"
  )
    span.font-bold.text-xs.text-white {{ customerContactId ? "Guardar cambios" : "Crear contacto" }}
</template>

<script>
import { notify } from "@kyvg/vue3-notification";
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import { useAppStore } from "@/store";
import {
  typesOfVia,
  listTypesOfTaxpayers,
  listPositionsInCompany,
} from "@/helps/constants";
import { useDisplay } from "vuetify/lib/framework.mjs";
export default defineComponent({
  name: "AddCustomerContactFormComponent",
  components: {},
  props: {
    customerId: {
      type: String,
    },
    customerContactId: {
      type: String,
    },
  },
  emits: ["created", "updated", "close"],
  setup(props, { emit }) {
    const { customerId, customerContactId } = toRefs(props);
    const {
      fetchCreateCustomerContact,
      fetchGetOneCustomerContact,
      fecthUpdateCustomerContact,
    } = useAppStore();
    const { mobile } = useDisplay();

    const validationForm = {
      nombre: [(v) => !!v || "Ingrese un nombre para el contacto"],
      tipo_documento: [(v) => !!v || "Seleccione un tipo de documento"],
      numero_documento: [
        (v) => !!v || "Ingrese el numero de documento",
        (v) => validateForDocumentNumber(v),
      ],
      cargo: [(v) => !!v || "Seleccione un cargo valido "],
      numero_telefono: [(v) => !!v || "Seleccione una provincia"],
      correo_electronico: [
        // (v) => !!v || "Seleccione un departamento",
        (v) =>
          (v && /^[a-z.-]+@[a-z.-]+\.[a-z]+$/i.test(v)) ||
          "El formato del correo electronico es incorrecto",
      ],
      es_representante_legal: [
        (v) => !!v || "El codigo de ubigeo es requerido",
      ],
    };

    const isLoading = ref(false);
    const formRef = ref(null);
    let filesTemporaryToUpload = reactive([]);
    const customerContact = ref({
      nombre: "",
      tipo_documento: "",
      numero_documento: "",
      cargo: "",
      numero_telefono: "",
      correo_electronico: "",
      es_representante_legal: 0,
    });

    onMounted(() => checkEditOrCreateLocation());

    const validateAndCreateCustomerContact = async () => {
      try {
        const { valid } = await formRef.value.validate();
        if (valid) {
          isLoading.value = true;
          if (customerContactId.value) {
            await fecthUpdateCustomerContact(
              customerContactId.value,
              customerContact.value
            );
            notify({
              type: "success",
              text: "Los cambios se guardarón correctamente.",
            });
            emit("updated", customerId.value);
            emit("close");
          } else {
            await fetchCreateCustomerContact(
              customerId.value,
              customerContact.value
            );
            notify({
              type: "success",
              text: "El cliente se generó correctamente.",
            });
            emit("created", customerId.value);
            emit("close");
          }
        }
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoading.value = false;
      }
    };

    const emitCloseComponent = () => emit("close");
    const isMobile = computed(() => mobile.value);

    const checkEditOrCreateLocation = async () => {
      if (customerContactId.value) {
        try {
          const contact = await fetchGetOneCustomerContact(
            customerContactId.value
          );

          customerContact.value.nombre = contact.nombre;
          customerContact.value.tipo_documento = contact.tipo_documento;
          customerContact.value.numero_documento = contact.numero_documento;
          customerContact.value.correo_electronico = contact.correo_electronico;
          customerContact.value.numero_telefono = contact.numero_telefono;
          customerContact.value.cargo = contact.cargo;
        } catch (error) {
          notify({ type: "error", text: error.message });
        }
      } else {
        customerContact.value.tipo_documento = "DNI";
      }
    };

    const validateForDocumentNumber = (v) => {
      if (customerContact.value.tipo_documento === "DNI" && v.length < 8)
        return "El numero de DNI no ser menor a 8 caracteres";
      if (customerContact.value.tipo_documento === "DNI" && v.length > 8)
        return "El numero de DNI no puede ser mayor a 8 caracteres";
      if (customerContact.value.tipo_documento === "RUC" && v.length < 11)
        return "El numero de RUC no ser menor a 11 caracteres";
      if (customerContact.value.tipo_documento === "RUC" && v.length > 11)
        return "El numero de RUC no puede ser mayor a 11 caracteres";
    };

    return {
      formRef,
      validationForm,
      customerContact,
      validateAndCreateCustomerContact,
      emitCloseComponent,
      typesOfVia,
      listTypesOfTaxpayers,
      isMobile,
      filesTemporaryToUpload,
      isLoading,
      listPositionsInCompany,
    };
  },
});
</script>
