<template lang="pug">
v-card-title.flex.items-center.py-4.px-6
  span.font-extrabold.text-lg Nueva ubicación
v-divider(v-if="isMobile")
v-card-text
  v-form(ref="formRef")
    v-row(no-gutters)
      v-col(cols="12", lg="6", md="12", sm="12")
        v-text-field.mx-2.text-slate-600.my-1(
          v-model="customerLocation.direccion",
          :rules="validationForm.direccion",
          label="Dirección",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="6", md="12", sm="12")
        v-text-field.mx-2.text-slate-600.my-1(
          v-model="customerLocation.referencia_direccion",
          :rules="validationForm.referencia_direccion",
          label="Referencia",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="6", md="6", sm="12")
        v-autocomplete.mx-2.text-slate-600.my-1(
          v-model="customerLocation.tipo_via",
          :rules="validationForm.tipo_via",
          label="Tipo de via",
          item-title="name",
          item-value="value",
          :items="tipos_de_via",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="6", md="6", sm="12")
        v-text-field.mx-2.text-slate-600.my-1(
          v-model="customerLocation.calle_numero",
          label="Calle / Numero",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="6", md="6", sm="12")
        v-text-field.mx-2.text-slate-600.my-1(
          v-model="customerLocation.numero_telefono",
          label="Numero de telefono",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="6", md="6", sm="12")
        v-text-field.mx-2.text-slate-600.my-1(
          v-model="customerLocation.correo_electronico",
          label="Correo electronico",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="4", md="6", sm="12")
        v-autocomplete.mx-2.text-slate-600.my-1(
          v-model="customerLocation.departamento",
          :rules="validationForm.departamento",
          :items="departamentos",
          label="Departamento",
          variant="outlined",
          density="compact",
          color="primary",
          item-title="departamento",
          item-value="departamento",
          @update:model-value="($event) => changeOptionDepProvDist('departamento')"
        )
      v-col(cols="12", lg="4", md="6", sm="12")
        v-autocomplete.mx-2.text-slate-600.my-1(
          v-model="customerLocation.provincia",
          :rules="validationForm.provincia",
          :items="provincias",
          label="Provincia",
          variant="outlined",
          density="compact",
          color="primary",
          item-title="provincia",
          item-value="provincia",
          @update:model-value="($event) => changeOptionDepProvDist('provincia')"
        )
      v-col(cols="12", lg="4", md="6", sm="12")
        v-autocomplete.mx-2.text-slate-600.my-1(
          v-model="customerLocation.distrito",
          :rules="validationForm.distrito",
          :items="distritos",
          label="Distrito",
          variant="outlined",
          density="compact",
          color="primary",
          item-title="distrito",
          item-value="distrito",
          @update:model-value="($event) => changeOptionDepProvDist('distrito')"
        )
      v-col(cols="12", lg="12", md="12", sm="12")
        .mx-2.text-slate-600.my-1
          v-dropzone-upload

v-divider(v-if="isMobile")
.flex.justify-end.px-6.py-6.mx-2
  v-btn(
    color="error",
    variant="text",
    :rounded="5",
    @click="emitCloseComponent()"
  )
    span.font-bold.text-xs cancelar
  v-btn.ml-4(
    color="primary",
    :rounded="5",
    @click="validateAndCreateCustomerLocation()"
  )
    span.font-bold.text-xs Guardar cambios
</template>

<script>
import { notify } from "@kyvg/vue3-notification";
import { computed, defineComponent, onMounted, ref, toRefs } from "vue";
import { useAppStore } from "@/store";
import { ubigeos } from "@/helps/constants";
import { useDisplay } from "vuetify/lib/framework.mjs";
import dropzoneUpload from "./component_dropzone_upload_file.vue";
export default defineComponent({
  name: "AddCustomerLocationFormComponent",
  components: {
    "v-dropzone-upload": dropzoneUpload,
  },
  props: {
    customerId: {
      type: Object,
    },
  },
  emits: ["created", "close"],
  setup(props, { emit }) {
    const { customerId } = toRefs(props);
    const { fetchCreateCustomerLocation } = useAppStore();
    const { mobile } = useDisplay();

    const validationForm = {
      direccion: [(v) => !!v || "Ingrese una dirección valida"],
      tipo_via: [(v) => !!v || "El tipo de via es requerido"],
      distrito: [(v) => !!v || "Seleccione un distrito"],
      provincia: [(v) => !!v || "Seleccione una provincia"],
      departamento: [(v) => !!v || "Seleccione un departamento"],
      codigo_ubigeo: [(v) => !!v || "El codigo de ubigeo es requerido"],
    };

    const isLoading = ref(false);
    const formRef = ref(null);
    const departamentos = ref([]);
    const provincias = ref([]);
    const distritos = ref([]);
    const files = ref([]);
    const tipos_de_via = ref([
      {
        name: "Avenida - (AV)",
        value: "AV.",
      },
      {
        name: "Urbanización - (URB)",
        value: "URB.",
      },
      {
        name: "Jiron - (JR)",
        value: "JR.",
      },
    ]);
    const customerLocation = ref({
      direccion: "",
      referencia_direccion: "",
      tipo_via: tipos_de_via.value[0].value,
      numero_telefono: "",
      correo_electronico: "",
      distrito: "",
      provincia: "",
      departamento: "",
      codigo_postal: "",
      imagen_uno: "",
      imagen_dos: "",
      imagen_tres: "",
      imagen_cuatro: "",
    });

    onMounted(() => {
      for (let i = 0; i < ubigeos.length; i++) {
        if (!departamentos.value.includes(ubigeos[i].departamento)) {
          departamentos.value.push(ubigeos[i].departamento);
        }
      }
    });

    const validateAndCreateCustomerLocation = async () => {
      try {
        const { valid } = await formRef.value.validate();
        if (valid) {
          isLoading.value = true;
          const customerLocationCreated = await fetchCreateCustomerLocation(
            customerId.value,
            customerLocation.value
          );
          notify({
            type: "success",
            text: "El cliente se generó correctamente.",
          });
          emit("created", customerLocationCreated);
        }
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoading.value = false;
      }
    };

    const changeOptionDepProvDist = (tipo) => {
      if (tipo === "departamento") {
        provincias.value = [];
        customerLocation.value.provincia = "";
        distritos.value = [];
        customerLocation.value.distrito = "";
      } else if (tipo === "provincia") {
        distritos.value = [];
        customerLocation.value.distrito = "";
      }

      for (var i = 0; i < ubigeos.length; i++) {
        if (tipo === "departamento") {
          if (
            customerLocation.value.departamento === ubigeos[i].departamento &&
            !provincias.value.includes(ubigeos[i].provincia)
          ) {
            provincias.value.push(ubigeos[i].provincia);
          }
        } else if (tipo === "provincia") {
          if (
            customerLocation.value.provincia === ubigeos[i].provincia &&
            !distritos.value.includes(ubigeos[i].distrito)
          ) {
            distritos.value.push(ubigeos[i].distrito);
          }
        }
      }

      if (
        customerLocation.value.departamento &&
        customerLocation.value.provincia &&
        customerLocation.value.distrito
      ) {
        customerLocation.value.codigo_ubigeo = ubigeos.find(
          (e) =>
            e.descripcion ===
            `${customerLocation.value.departamento}-${customerLocation.value.provincia}-${customerLocation.value.distrito}`
        ).ubigeo;
      } else customerLocation.value.codigo_ubigeo = "";
    };

    const emitCloseComponent = () => emit("close");
    const isMobile = computed(() => mobile.value);

    return {
      formRef,
      departamentos,
      provincias,
      distritos,
      validationForm,
      customerLocation,
      validateAndCreateCustomerLocation,
      emitCloseComponent,
      tipos_de_via,
      changeOptionDepProvDist,
      isMobile,
      files,
    };
  },
});
</script>
