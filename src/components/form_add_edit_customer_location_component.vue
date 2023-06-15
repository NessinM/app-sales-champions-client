<template lang="pug">
v-card-title.flex.items-center.py-4.px-6
  span.font-extrabold.text-lg Nueva ubicación
v-divider(v-if="isMobile")
v-card-text.py-0
  v-form(ref="formRef")
    v-row(no-gutters)
      v-col(cols="12", lg="6", md="12", sm="12")
        v-text-field.mx-2.text-slate-600.my-1(
          v-model="customerLocation.nombre",
          :rules="validationForm.nombre",
          label="Nombre para la ubicaciòn",
          variant="outlined",
          density="compact",
          color="primary"
        )
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
      v-col(cols="12", lg="3", md="6", sm="12")
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
      v-col(cols="12", lg="3", md="6", sm="12")
        v-text-field.mx-2.text-slate-600.my-1(
          v-model="customerLocation.calle_numero",
          label="Numero",
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
      v-col(cols="12", lg="6", md="6", sm="12")
        v-text-field.mx-2.text-slate-600.my-1(
          v-model="customerLocation.numero_telefono",
          label="Numero de telefono",
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
    .flex.items-center.mx-2
      span.font-extrabold.text-lg Imagenes de la ubicacion
    v-row.mt-4(no-gutters)
      v-col(cols="12", lg="3", md="6", sm="12")
        v-square-preview-customer-location.my-1(
          v-if="customerLocation.imagen_uno",
          :url-image="customerLocation.imagen_uno"
        )
          v-btn.w-full(
            color="error",
            :rounded="0",
            @click="deleteImagenCustomerLocation(1)"
          )
            span.font-bold.text-xs Eliminar
        v-square-upload-customer-location.my-1(
          v-else,
          :number-image="1",
          @load-image="getImageLoaded",
          @delete-image="getImageDelete"
        )
      v-col(cols="12", lg="3", md="6", sm="12")
        v-square-preview-customer-location.my-1(
          v-if="customerLocation.imagen_dos",
          :url-image="customerLocation.imagen_dos"
        )
          v-btn.w-full(
            color="error",
            :rounded="0",
            @click="deleteImagenCustomerLocation(2)"
          )
            span.font-bold.text-xs Eliminar
        v-square-upload-customer-location.my-1(
          v-else,
          :number-image="2",
          @load-image="getImageLoaded",
          @delete-image="getImageDelete"
        )
      v-col(cols="12", lg="3", md="6", sm="12")
        v-square-preview-customer-location.my-1(
          v-if="customerLocation.imagen_tres",
          :url-image="customerLocation.imagen_tres"
        )
          v-btn.w-full(
            color="error",
            :rounded="0",
            @click="deleteImagenCustomerLocation(3)"
          )
            span.font-bold.text-xs Eliminar
        v-square-upload-customer-location.my-1(
          v-else,
          :number-image="3",
          @load-image="getImageLoaded",
          @delete-image="getImageDelete"
        )
      v-col(cols="12", lg="3", md="6", sm="12")
        v-square-preview-customer-location.my-1(
          v-if="customerLocation.imagen_cuatro",
          :url-image="customerLocation.imagen_cuatro"
        )
          v-btn.w-full(
            color="error",
            :rounded="0",
            @click="deleteImagenCustomerLocation(4)"
          )
            span.font-bold.text-xs Eliminar
        v-square-upload-customer-location.my-1(
          v-else,
          :number-image="4",
          @load-image="getImageLoaded",
          @delete-image="getImageDelete"
        )

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
import {
  computed,
  defineComponent,
  onMounted,
  reactive,
  ref,
  toRefs,
} from "vue";
import { useAppStore, useUploadStore } from "@/store";
import { ubigeos } from "@/helps/constants";
import { useDisplay } from "vuetify/lib/framework.mjs";
import SquareUploadImageCustomerLocation from "./square_upload_image_customer_location_component.vue";
import SquarePreviewImageCustomerLocation from "./square_preview_image_customer_location_component.vue";
export default defineComponent({
  name: "AddCustomerLocationFormComponent",
  components: {
    "v-square-upload-customer-location": SquareUploadImageCustomerLocation,
    "v-square-preview-customer-location": SquarePreviewImageCustomerLocation,
  },
  props: {
    customerId: {
      type: String,
    },
    customerLocationId: {
      type: String,
    },
  },
  emits: ["created", "close"],
  setup(props, { emit }) {
    const { customerId, customerLocationId } = toRefs(props);
    const {
      fetchCreateCustomerLocation,
      fetchGetOneCustomerLocation,
      fecthUpdateCustomerLocation,
    } = useAppStore();
    const { fetchSaveImageCustomersLocation } = useUploadStore();
    const { mobile } = useDisplay();

    const validationForm = {
      nombre: [(v) => !!v || "Ingrese un nombre para esta ubicaciòn"],
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
    let filesTemporaryToUpload = reactive([]);
    const tipos_de_via = ref([
      {
        name: "Avenida",
        value: "AV",
      },
      {
        name: "Urbanización",
        value: "URB",
      },
      {
        name: "Jiron",
        value: "JR",
      },
      {
        name: "Calle",
        value: "CA",
      },
    ]);
    const customerLocation = ref({
      nombre: "",
      direccion: "",
      referencia_direccion: "",
      tipo_via: "",
      numero_direccion: "",
      correo_electronico: "",
      numero_telefono: "",
      distrito: "",
      provincia: "",
      departamento: "",
      codigo_ubigeo: "",
      imagen_uno: "",
      imagen_dos: "",
      imagen_tres: "",
      imagen_cuatro: "",
    });

    onMounted(() => checkEditOrCreateLocation());

    const validateAndCreateCustomerLocation = async () => {
      try {
        const { valid } = await formRef.value.validate();
        if (valid) {
          isLoading.value = true;
          if (customerLocationId.value) {
            const customerLocationCreated = await fecthUpdateCustomerLocation(
              customerLocationId.value,
              customerLocation.value
            );
            notify({
              type: "success",
              text: "El cliente se generó correctamente.",
            });
            emit("created", customerLocationCreated);
          } else {
            for (const item of filesTemporaryToUpload) {
              const { file, numberImage } = item;
              const { ruta } = await fetchSaveImageCustomersLocation(
                "user-generic",
                file
              );

              if (numberImage === 1) customerLocation.value.imagen_uno = ruta;
              else if (numberImage === 2)
                customerLocation.value.imagen_dos = ruta;
              else if (numberImage === 3)
                customerLocation.value.imagen_tres = ruta;
              else if (numberImage === 4)
                customerLocation.value.imagen_cuatro = ruta;
            }
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

    const getImageLoaded = (file) => filesTemporaryToUpload.push(file);
    const getImageDelete = (numberImage) => {
      const index = filesTemporaryToUpload.findIndex(
        (e) => e.numberImage === numberImage
      );
      if (index !== -1) filesTemporaryToUpload.splice(index, 1);
    };

    const emitCloseComponent = () => emit("close");
    const isMobile = computed(() => mobile.value);

    const checkEditOrCreateLocation = async () => {
      if (customerLocationId.value) {
        try {
          const location = await fetchGetOneCustomerLocation(
            customerLocationId.value
          );

          customerLocation.value.nombre = location.nombre;
          customerLocation.value.direccion = location.direccion;
          customerLocation.value.referencia_direccion =
            location.referencia_direccion;
          customerLocation.value.tipo_via = location.tipo_via;
          customerLocation.value.numero_direccion = location.numero_direccion;
          customerLocation.value.correo_electronico =
            location.correo_electronico;
          customerLocation.value.distrito = location.distrito;
          customerLocation.value.provincia = location.provincia;
          customerLocation.value.departamento = location.departamento;
          customerLocation.value.codigo_ubigeo = location.codigo_ubigeo;
          customerLocation.value.imagen_uno = location.imagen_uno;
          customerLocation.value.imagen_dos = location.imagen_dos;
          customerLocation.value.imagen_tres = location.imagen_tres;
          customerLocation.value.imagen_cuatro = location.imagen_cuatro;
        } catch (error) {
          notify({ type: "error", text: error.message });
        }
      } else {
        customerLocation.value.tipo_via = tipos_de_via.value[0].value;
        for (let i = 0; i < ubigeos.length; i++) {
          if (!departamentos.value.includes(ubigeos[i].departamento)) {
            departamentos.value.push(ubigeos[i].departamento);
          }
        }
      }
    };

    const deleteImagenCustomerLocation = (numberImage) => {
      if (numberImage === 1) customerLocation.value.imagen_uno = "";
      else if (numberImage === 2) customerLocation.value.imagen_dos = "";
      else if (numberImage === 3) customerLocation.value.imagen_tres = "";
      else if (numberImage === 4) customerLocation.value.imagen_cuatro = "";
    };

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
      getImageLoaded,
      getImageDelete,
      filesTemporaryToUpload,
      deleteImagenCustomerLocation,
    };
  },
});
</script>
