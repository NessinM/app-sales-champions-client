<template lang="pug">
v-card-title.flex.items-center.px-6(
  :class="{ 'bg-primary elevation-4 py-1': isMobile, 'py-5' : !isMobile }"
)
  v-btn.mr-3(
    v-if="isMobile",
    icon="",
    flat,
    color="primary",
    @click="emitCloseComponent()"
  )
    v-icon(icon="$mdiArrowLeft", size="25 ")
  span.font-extrabold.text-lg {{ customerLocationId ? "Editar ubicación" : "Nueva ubicación" }}
v-card-text(:class="isMobile ? '' : 'py-0'")
  v-form.mt-2(ref="formRef", :disabled="isLoading")
    v-row(no-gutters)
      v-col(cols="12", :lg="customerLocationId ? 6 : 12", :md="customerLocationId ? 6 : 12", sm="12")
        v-text-field.mx-2.text-slate-500(
          v-model="customerLocation.titulo",
          :rules="validationForm.titulo",
          label="Titulo",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", :lg="customerLocationId ? 6 : 12", :md="customerLocationId ? 6 : 12", sm="12")
        v-text-field.mx-2.text-slate-500(
          v-model="customerLocation.direccion",
          :rules="validationForm.direccion",
          label="Dirección",
          variant="outlined",
          density="compact",
          color="primary"
        )
      //- v-col(v-if="customerLocationId"  cols="12", lg="6", md="6", sm="12")
      //-   v-text-field.mx-2.text-slate-500(
      //-     v-model="customerLocation.referencia_direccion",
      //-     :rules="validationForm.referencia_direccion",
      //-     label="Referencia",
      //-     variant="outlined",
      //-     density="compact",
      //-     color="primary"
      //-   )
      v-col(cols="12", lg="6", md="6", sm="12")
        v-autocomplete.mx-2.text-slate-500(
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
      v-col(cols="12", lg="6", md="6", sm="12")
        v-autocomplete.mx-2.text-slate-500(
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
      v-col(cols="12", lg="6", md="6", sm="12")
        v-autocomplete.mx-2.text-slate-500(
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
      v-col(v-if="customerLocationId"  cols="12", lg="3", md="6", sm="12")
        v-autocomplete.mx-2.text-slate-500(
          v-model="customerLocation.tipo_via",
          :rules="validationForm.tipo_via",
          label="Via",
          item-title="name",
          item-value="value",
          :items="typesOfVia",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(v-if="customerLocationId"  cols="12", lg="3", md="6", sm="12")
        v-text-field.mx-2.text-slate-500(
          v-model="customerLocation.calle_numero",
          label="Numero",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(v-if="customerLocationId"  cols="12", lg="6", md="6", sm="12")
        v-text-field.mx-2.text-slate-500(
          v-model="customerLocation.numero_telefono",
          label="Numero de telefono",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(v-if="customerLocationId"  cols="12", lg="6", md="6", sm="12")
        v-text-field.mx-2.text-slate-500(
          v-model="customerLocation.correo_electronico",
          label="Correo electronico",
          variant="outlined",
          density="compact",
          color="primary"
        )
    v-tabs.w-full(
      v-if="customerLocationId"
      v-model="tabsCustomer"
      align-tabs="end",
      density="compact",
      color="primary",
    )
      v-tab(:value="1")
        span.font-extrabold(class="text-[10px]") Imagenes
          span.mx-1(v-if="tabsCustomer === 2") ({{ filesTemporaryToUpload.length }})
      v-tab(:value="2" :disabled="filesTemporaryToUpload.length >= 4")
        span.font-extrabold(class="text-[10px]" ) Adjuntar
    v-square-upload-customer-location.ma-2(
      v-if="filesTemporaryToUpload.length < 4 && customerLocationId && tabsCustomer === 2",
      :accept="['image/png', 'image/jpg', 'image/jpeg']"
      :multiple="true"
      @load-image="getFilesLocations",
    )
    v-row(v-if="customerLocationId && tabsCustomer === 1" no-gutters)
      v-col( v-if="!filesTemporaryToUpload.length" cols="12" lg="12" md="12" sm="12",)
        v-alert.mx-2.my-4(

          variant="tonal",
          density="compact",
          color="orange"
          )
            v-icon(start, size="20", icon="$mdiFolderSearch")
            small.text-xs.font-bold No existen imagenes relacionados para este cliente
      v-col(v-for="(item, index) in filesTemporaryToUpload", :key="index", cols="12" lg="3" md="3" sm="12")
        v-square-preview-customer-location.my-4(
          v-if="item.register && isLoadingRederImage"
          :url-image="item.file"
        )
          v-btn.w-full(
            color="error",
            :rounded="0",
            @click="deleteImagenTempCustomerLocation(item.register, index)"
          )
            v-icon.mx-1(icon="$mdiTrashCanOutline", size="20")
            span.font-extrabold.text-xs Eliminar
        v-square-preview-customer-location.my-4(
          v-if="!item.register && isLoadingRederImage"
          :file-buffer="item.file"
        )
          v-btn.w-full(
            color="error",
            :rounded="0",
            @click="deleteImagenTempCustomerLocation(item.register, index)"
          )
            v-icon.mx-1(icon="$mdiTrashCanOutline", size="20")
            small.font-extrabold Eliminar
v-divider(v-if="isMobile")
.flex.justify-end.px-6.py-6.mx-2
  v-btn(
    v-if="!isMobile",
    color="error",
    variant="text",
    :rounded="5",
    :disabled="isLoading",
    @click="emitCloseComponent()"
  )
    span.font-bold.text-xs cancelar
  v-btn(
    :class="isMobile ? 'flex-1' : 'ml-4'",
    color="success",
    :rounded="5",
    :disabled="isLoading",
    :loading="isLoading",
    @click="validateAndCreateCustomerLocation()"
  )
    span.font-bold.text-xs.text-white {{ customerLocationId ? "Guardar cambios" : "Crear ubicación" }}
</template>

<script>
import { notify } from "@kyvg/vue3-notification";
import {
  computed,
  defineComponent,
  nextTick,
  onMounted,
  ref,
  toRefs,
} from "vue";
import { useAppStore, useUploadStore } from "@/store";
import { ubigeous, typesOfVia } from "@/helps/constants";
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
  emits: ["created", "updated", "close"],
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
      titulo: [(v) => !!v || "Ingrese un titulo para esta ubicaciòn"],
      direccion: [(v) => !!v || "Ingrese una dirección valida"],
      tipo_via: [(v) => !!v || "El tipo de via es requerido"],
      distrito: [(v) => !!v || "Seleccione un distrito"],
      provincia: [(v) => !!v || "Seleccione una provincia"],
      departamento: [(v) => !!v || "Seleccione un departamento"],
      codigo_ubigeo: [(v) => !!v || "El codigo de ubigeo es requerido"],
    };

    const isLoadingRederImage = ref(true);
    const isLoading = ref(false);
    const formRef = ref(null);
    const departamentos = ref([]);
    const provincias = ref([]);
    const distritos = ref([]);
    let countMaxFilesByCustomer = ref(4);
    let tabsCustomer = ref(1);
    let filesTemporaryToUpload = ref([]);
    const customerLocation = ref({
      titulo: "",
      direccion: "",
      referencia_direccion: "",
      tipo_via: "",
      numero_direccion: "",
      correo_electronico: "",
      numero_telefono: "",
      distrito: null,
      provincia: null,
      departamento: null,
      codigo_ubigeo: null,
      imagen_uno: "",
      imagen_dos: "",
      imagen_tres: "",
      imagen_cuatro: "",
      es_fiscal: false
    });

    onMounted(() => checkEditOrCreateLocation());

    const validateAndCreateCustomerLocation = async () => {
      try {
        const { valid } = await formRef.value.validate();
        if (valid) {
          isLoading.value = true;
          for (const [i, item] of filesTemporaryToUpload.value.entries()) {
            const numberImage = i + 1
            const { register, file } = item
            if (!register) {
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
          }
          if (customerLocationId.value) {
            await fecthUpdateCustomerLocation(
              customerLocationId.value,
              customerLocation.value
            );
            notify({
              type: "success",
              text: "Los cambios se guardarón correctamente.",
            });
            emit("updated", customerId.value);
            emit("close");
          } else {
            await fetchCreateCustomerLocation(
              customerId.value,
              customerLocation.value
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

      for (var i = 0; i < ubigeous.length; i++) {
        if (tipo === "departamento") {
          if (
            customerLocation.value.departamento === ubigeous[i].departamento &&
            !provincias.value.includes(ubigeous[i].provincia)
          ) {
            provincias.value.push(ubigeous[i].provincia);
          }
        } else if (tipo === "provincia") {
          if (
            customerLocation.value.provincia === ubigeous[i].provincia &&
            !distritos.value.includes(ubigeous[i].distrito)
          ) {
            distritos.value.push(ubigeous[i].distrito);
          }
        }
      }

      if (
        customerLocation.value.departamento &&
        customerLocation.value.provincia &&
        customerLocation.value.distrito
      ) {
        customerLocation.value.codigo_ubigeo = ubigeous.find(
          (e) =>
            e.descripcion ===
            `${customerLocation.value.departamento}-${customerLocation.value.provincia}-${customerLocation.value.distrito}`
        ).ubigeo;
      } else customerLocation.value.codigo_ubigeo = "";
    };

    const getFilesLocations = (files = []) => {
      let filesList = []
      if (filesTemporaryToUpload.value.length > countMaxFilesByCustomer.value) return notify({ type: "error", text: 'Solo puedes agregar 4 imagenes como maximo' });
      if ((filesTemporaryToUpload.value.length + files.length) > countMaxFilesByCustomer.value) {
        const countMissingFiles = countMaxFilesByCustomer.value - filesTemporaryToUpload.value.length
        for (let i = 0; i < countMissingFiles; i++) {
          const e = files[i];
          filesList.push(e)
        }
        notify({ type: 'info', text: `Solo se agregarón ${countMissingFiles} archivos de los ${files.length} que habias seleccionado` })
      } else {
        filesList = [...files]
      }

      for (let i = 0; i < filesList.length; i++) {
        const element = filesList[i];
        filesTemporaryToUpload.value.push({ register: false, file: element })
      }

      tabsCustomer.value = 1
    };

    const emitCloseComponent = () => emit("close");
    const isMobile = computed(() => mobile.value);

    const checkEditOrCreateLocation = async () => {
      if (customerLocationId.value) {
        try {
          const location = await fetchGetOneCustomerLocation(
            customerLocationId.value
          );

          customerLocation.value.titulo = location.titulo;
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

          [location.imagen_uno, location.imagen_dos, location.imagen_tres, location.imagen_cuatro].forEach((e) => {
            if (e) {
              filesTemporaryToUpload.value.push({ register: true, file: e })
            }
          })

          tabsCustomer.value = filesTemporaryToUpload.value.length > 0 ? 1 : 2
        } catch (error) {
          notify({ type: "error", text: error.message });
        }
      } else {
        customerLocation.value.tipo_via = typesOfVia[0].value;
        for (let i = 0; i < ubigeous.length; i++) {
          if (!departamentos.value.includes(ubigeous[i].departamento)) {
            departamentos.value.push(ubigeous[i].departamento);
          }
        }
      }
    };

    const deleteImagenTempCustomerLocation = async (register, index) => {

      isLoadingRederImage.value = false
      if (!register) {
        filesTemporaryToUpload.value.splice(index, 1)
        // eslint-disable-next-line vue/valid-next-tick
        await nextTick(() => isLoadingRederImage.value = true)
        if (!filesTemporaryToUpload.value.length) tabsCustomer.value = 2
        return
      }

      let idImage = index + 1

      if (idImage === 1) customerLocation.value.imagen_uno = "";
      else if (idImage === 2) customerLocation.value.imagen_dos = "";
      else if (idImage === 3) customerLocation.value.imagen_tres = "";
      else if (idImage === 4) customerLocation.value.imagen_cuatro = "";

      filesTemporaryToUpload.value.splice(index, 1)
      // eslint-disable-next-line vue/valid-next-tick
      await nextTick(() => isLoadingRederImage.value = true)
      if (!filesTemporaryToUpload.value.length) tabsCustomer.value = 2
    };

    return {
      tabsCustomer,
      formRef,
      departamentos,
      provincias,
      distritos,
      validationForm,
      customerLocation,
      validateAndCreateCustomerLocation,
      emitCloseComponent,
      typesOfVia,
      changeOptionDepProvDist,
      isMobile,
      getFilesLocations,
      filesTemporaryToUpload,
      deleteImagenTempCustomerLocation,
      isLoading,
      isLoadingRederImage
    };
  },
});
</script>
