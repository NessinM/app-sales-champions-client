<template lang="pug">
//- v-dialog(
//-   v-model="isShowDialogNewLocation",
//-   :fullscreen="isMobile",
//-   scrollable,
//-   :width="isMobile ? '100%' : '600'"
//- )
//-   v-card
//-     span dkfjdjsf
v-dialog(
  v-model="isShowDialogNewLocation",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '600'"
)
  v-card
    v-card-title
      span.font-extrabold.text-sm.text-slate-600 Agregando nueva sede
    v-card-text
      v-row(no-gutters)
        v-col(cols="12", lg="12", md="12", sm="12")
          v-text-field.mx-1.text-slate-600.my-1(
            v-model="direccion_fiscal.value.value",
            label="Dirección",
            :error-messages="direccion_fiscal.errorMessage.value",
            variant="outlined",
            density="compact",
            color="primary"
          )
        v-col(cols="12", lg="12", md="12", sm="12")
          v-text-field.mx-1.text-slate-600.my-1(
            v-model="referencia_direccion_fiscal.value.value",
            label="Referencia",
            :error-messages="referencia_direccion_fiscal.errorMessage.value",
            variant="outlined",
            density="compact",
            color="primary"
          )
        v-col(cols="12", lg="4", md="6", sm="12")
          v-select.mx-1.text-slate-600.my-1(
            label="Tipo de via",
            :items="['Urbanizacion', 'Avenida', 'Jiron']",
            variant="outlined",
            density="compact",
            color="primary"
          )
        v-col(cols="12", lg="4", md="6", sm="12")
          v-text-field.mx-1.text-slate-600.my-1(
            label="Calle / Numero",
            variant="outlined",
            density="compact",
            color="primary"
          )
        v-col(cols="12", lg="4", md="6", sm="12")
          v-text-field.mx-1.text-slate-600.my-1(
            label="Edificio / Planta / Sala",
            variant="outlined",
            density="compact",
            color="primary"
          )
        v-col(cols="12", lg="4", md="6", sm="12")
          v-autocomplete.mx-1.text-slate-600.my-1(
            v-model="distrito.value.value",
            :items="distritos",
            label="Distrito",
            :error-messages="distrito.errorMessage.value",
            variant="outlined",
            density="compact",
            color="primary",
            item-title="distrito",
            item-value="distrito",
            @update:model-value="($event) => changeOptionDepProvDist($event, 'distrito')"
          )
        v-col(cols="12", lg="4", md="6", sm="12")
          v-autocomplete.mx-1.text-slate-600.my-1(
            v-model="provincia.value.value",
            :items="provincias",
            label="Provincia",
            :error-messages="provincia.errorMessage.value",
            variant="outlined",
            density="compact",
            color="primary",
            item-title="provincia",
            item-value="provincia",
            @update:model-value="($event) => changeOptionDepProvDist($event, 'provincia')"
          )
        v-col(cols="12", lg="4", md="6", sm="12")
          v-autocomplete.mx-1.text-slate-600.my-1(
            v-model="departamento.value.value",
            :items="departamentos",
            label="Departamento",
            :error-messages="departamento.errorMessage.value",
            variant="outlined",
            density="compact",
            color="primary",
            item-title="departamento",
            item-value="departamento",
            @update:model-value="($event) => changeOptionDepProvDist($event, 'departamento')"
          )
      //- span ubigeo: {{ codigo_ubigeo.value.value }}
      dropzone-upload
    v-card-text.flex.overflow-hidden.pa-4
      v-spacer
      v-btn(
        color="error",
        variant="text",
        @click="isShowDialogNewLocation = false"
      )
        span.font-bold.text-xs cancelar
      v-btn.ml-4(color="primary", @click="isShowDialogNewLocation = false")
        span.font-bold.text-xs Guardar cambios
.bg-primary.flex.items-center.justify-center(
  class="!sticky !top-0 !z-10 h-1/6",
  rounded="0",
  color="primary"
)
  v-list-item
    template(#prepend)
      v-avatar(color="background", density="compact", size="80")
        v-img(:src="customer.imagen_perfil")
    v-list-item-title
      span.text-2xl.font-bold {{ razon_social.value.value }}
    v-list-item-subtitle
      span.text-md {{ numero_documento.value.value }} - Banca y seguros
v-tabs.elevation-2(
  v-model="panelActual",
  align-tabs="end",
  density="compact",
  color="white",
  bg-color="primary"
)
  v-tab(:value="1")
    span.font-bold(class="text-[11px]") Datos
  v-tab(:value="2")
    span.font-bold(class="text-[11px]") Ubicaciones
.py-5.px-3.h-full(v-if="panelActual === 1")
  form(@submit.prevent="validateAndSaveChangesCustomer")
    v-row(no-gutters)
      v-col(cols="12", lg="4", md="6", sm="12")
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
      v-col(cols="12", lg="4", md="6", sm="12")
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
      v-col(cols="12", lg="4", md="6", sm="12")
        v-text-field.mx-2.text-slate-600.my-1(
          v-model="razon_social.value.value",
          label="Nombre o razon social",
          :error-messages="razon_social.errorMessage.value",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="4", md="6", sm="12")
        v-select.mx-2.text-slate-600.my-1(
          label="Sub sector",
          :items="lista_sectores",
          item-title="name",
          item-value="value",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="4", md="6", sm="12")
        v-select.mx-2.text-slate-600.my-1(
          v-model="tipo_cliente.value.value",
          label="Canal sales champion",
          :error-messages="tipo_cliente.errorMessage.value",
          :items="['DJI', 'MSI', 'CANON', 'RISO']",
          variant="outlined",
          density="compact",
          color="primary"
        )
      v-col(cols="12", lg="4", md="6", sm="12")
        v-select.mx-2.text-slate-600.my-1(
          v-model="tipo_cliente.value.value",
          label="Sede principal",
          :error-messages="tipo_cliente.errorMessage.value",
          :items="['DJI', 'MSI', 'CANON', 'RISO']",
          variant="outlined",
          density="compact",
          color="primary"
        )
    .flex.mt-2.p-2.justify-end
      v-btn.ml-2.font-bold(color="error", :rounded="5", variant="text")
        span.text-xs.font-bold Eliminar
      v-btn.ml-2.font-bold(color="primary", :rounded="5", type="submit")
        small.text-xs.font-bold Guardar cambios
.py-5.px-3(v-if="panelActual === 2")
  v-row
    v-col(cols="12", lg="3", md="6", sm="12")
      v-hover(v-slot="{ isHovering, props }")
        v-card.mx-auto.pa-4(
          height="215",
          :elevation="isHovering ? 4 : 1",
          :class="{ 'on-hover text-white': isHovering }",
          v-bind="props",
          :color="isHovering ? 'primary' : 'background'",
          @click="isShowDialogNewLocation = !isShowDialogNewLocation"
        )
          .flex.items-center.justify-center.h-full.flex-col
            v-icon(
              size="70",
              icon="$mdiOfficeBuildingPlus",
              :class="isHovering ? 'text-white' : 'text-slate-300'"
            )
            small.font-bold(
              :class="isHovering ? 'text-white' : 'text-slate-300'"
            ) Agregar nueva ubicacion
    v-col(
      v-for="(a, index) in 4",
      :key="index",
      cols="12",
      lg="3",
      md="6",
      sm="12"
    )
      v-hover(v-slot="{ isHovering, props }")
        v-card.mx-auto(
          :elevation="isHovering ? 6 : 2",
          :class="{ 'on-hover bg-background': isHovering }",
          v-bind="props",
          @click="() => {}"
        )
          v-carousel(
            height="150",
            hide-delimiters,
            :show-arrows="false",
            :interval="3000",
            cycle,
            touch
          )
            v-carousel-item(v-for="(slide, i) in 5", :key="i")
              v-card.mx-auto.cursor-pointer(:rounded="0")
                v-img.align-end.text-white(
                  height="150",
                  src="https://www.idl.org.pe/wp-content/uploads/2019/10/IMG_34041.png",
                  lazy-src="/assets/placeholder-sede-image.jpg",
                  gradient="to bottom, rgba(0,0,0,.1), #2d4258de",
                  cover=""
                )
                  v-card-title
                    .text-sm.font-bold San juan de lurigancho
          v-list
            v-list-item
              v-list-item-title
                span.font-bold.text-xs AV. REPUBLICA DE PANAMA NRO. 3517 INT. 9 URB. EL PALOMAR - LIMA LIMA SAN ISIDRO
              v-list-item-subtitle
                span jksdghfjkgsdghs
              template(#prepend="")
                v-avatar(color="primary")
                  v-icon(color="white", icon="$mdiMapMarkerOutline")
</template>
<script>
import { defineComponent, toRefs, watch, onMounted, ref, computed } from "vue";
import * as yup from "yup";
import { es } from "yup-locales";
import { useField, useForm } from "vee-validate";
import { useAppStore } from "@/store";
import { notify } from "@kyvg/vue3-notification";
import { useDisplay, useTheme } from "vuetify";
import dropzoneUpload from "./component_dropzone_upload_file.vue";
import { ubigeos } from "@/helps/constants";

yup.setLocale(es);

export default defineComponent({
  name: "ComponentFormCustomerEdit",
  components: {
    "dropzone-upload": dropzoneUpload,
  },
  props: {
    customer: {
      type: Object,
    },
  },
  setup(props) {
    const { customer } = toRefs(props);
    const { mobile } = useDisplay();

    const { fetchSaveChangesCustomer, fetchGetCustomeroOfSunat } =
      useAppStore();

    const theme = useTheme();

    const isThemeDark = computed(() => theme.current.value.dark);

    const isLoadingSaveChanges = ref(false);
    const isLoadingOcupaciones = ref(false);
    const isLoadingSunat = ref(false);
    const isShowDialogNewLocation = ref(false);
    const panelActual = ref(1);
    const departamentos = ref([]);
    const provincias = ref([]);
    const distritos = ref([]);
    const searchValueOcupacion = ref("");
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

    const { handleSubmit } = useForm({
      validationSchema,
    });

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

    const changeOptionDepProvDist = (value, tipo) => {
      // console.log("value", value);
      console.log("tipo", tipo);
      if (tipo === "departamento") {
        provincias.value = [];
        provincia.value.value = "";
        distritos.value = [];
        distrito.value.value = "";
      } else if (tipo === "provincia") {
        distritos.value = [];
        distrito.value.value = "";
      }

      for (var i = 0; i < ubigeos.length; i++) {
        if (tipo === "departamento") {
          if (
            departamento.value.value === ubigeos[i].departamento &&
            !provincias.value.includes(ubigeos[i].provincia)
          ) {
            provincias.value.push(ubigeos[i].provincia);
          }
        } else if (tipo === "provincia") {
          if (
            provincia.value.value === ubigeos[i].provincia &&
            !distritos.value.includes(ubigeos[i].distrito)
          ) {
            distritos.value.push(ubigeos[i].distrito);
          }
        }
      }

      if (
        departamento.value.value &&
        provincia.value.value &&
        distrito.value.value
      ) {
        codigo_ubigeo.value.value = ubigeos.find(
          (e) =>
            e.descripcion ===
            `${departamento.value.value}-${provincia.value.value}-${distrito.value.value}`
        ).ubigeo;
      } else codigo_ubigeo.value.value = "";
    };

    const obtenerDatosSunat = async () => {
      try {
        isLoadingSunat.value = true;
        const response = await fetchGetCustomeroOfSunat(
          numero_documento.value.value
        );

        razon_social.value.value = response.nombre_o_razon_social;
        departamento.value.value = response.departamento;
        provincia.value.value = response.provincia;
        distrito.value.value = response.distrito;
        codigo_ubigeo.value.value = +response.ubigeo;
        direccion_fiscal.value.value = response.direccion_completa;
        referencia_direccion_fiscal.value.value = response.direccion;
        // setValuesOfUbigeo();
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoadingSunat.value = false;
      }
    };

    const tipo_documento = useField("tipo_documento", validationSchema);
    const email_notificacion = useField("email_notificacion", validationSchema);
    const numero_documento = useField("numero_documento", validationSchema);
    const razon_social = useField("razon_social", validationSchema);
    const direccion_fiscal = useField("direccion_fiscal", validationSchema);
    const referencia_direccion_fiscal = useField(
      "referencia_direccion_fiscal",
      validationSchema
    );
    const departamento = useField("departamento", validationSchema);
    const provincia = useField("provincia", validationSchema);
    const distrito = useField("distrito", validationSchema);
    const codigo_ubigeo = useField("codigo_ubigeo", validationSchema);
    const tipo_cliente = useField("tipo_cliente", validationSchema);
    const profesion_ocupacion = useField(
      "profesion_ocupacion",
      validationSchema
    );
    const activo = useField("activo", validationSchema);

    onMounted(() => {
      setDataCustomerEdit(customer.value);
    });

    watch(
      () => customer.value,
      (newValue) => {
        setDataCustomerEdit(newValue);
      }
    );

    const isMobile = computed(() => mobile.value);

    const setDataCustomerEdit = (aux) => {
      tipo_documento.value.value = aux.tipo_documento;
      email_notificacion.value.value = aux.email_notificacion;
      numero_documento.value.value = +aux.numero_documento;
      razon_social.value.value = aux.razon_social;
      direccion_fiscal.value.value = aux.direccion_fiscal;
      referencia_direccion_fiscal.value.value = aux.referencia_direccion_fiscal;
      departamento.value.value = aux.departamento;
      provincia.value.value = aux.provincia;
      distrito.value.value = aux.distrito;
      codigo_ubigeo.value.value = aux.codigo_ubigeo;
      tipo_cliente.value.value = aux.tipo_cliente;
      profesion_ocupacion.value.value = aux.profesion_ocupacion;
      // setValuesOfUbigeo();
    };

    // const setValuesOfUbigeo = () => {
    //   console.log("codigo_ubigeo.value.value", codigo_ubigeo.value.value);
    //   if (codigo_ubigeo.value.value) {
    //     const ubigeo_actual = ubigeos.find(
    //       (e) => +e.ubigeo === +codigo_ubigeo.value.value
    //     );

    //     console.log("ubigeo_actual", ubigeo_actual);

    //     for (let i = 0; i < ubigeos.length; i++) {
    //       const e = ubigeos[i];
    //       if (
    //         ubigeo_actual.departamento === e.departamento &&
    //         !provincias.value.includes(ubigeos[i].provincia)
    //       ) {
    //         provincias.value.push(ubigeos[i].provincia);
    //       }

    //       if (
    //         ubigeo_actual.provincia === e.provincia &&
    //         !distritos.value.includes(ubigeos[i].distrito)
    //       ) {
    //         distritos.value.push(ubigeos[i].distrito);
    //       }
    //       if (!departamentos.value.includes(ubigeos[i].departamento)) {
    //         departamentos.value.push(ubigeos[i].departamento);
    //       }
    //     }

    //     console.log("provincias", provincias.value);
    //     console.log("distritos", distritos.value);
    //     departamento.value.value = ubigeo_actual?.departamento;
    //     provincia.value.value = ubigeo_actual?.provincia;
    //     distrito.value.value = ubigeo_actual?.distrito;
    //   } else {
    //     for (let i = 0; i < ubigeos.length; i++) {
    //       departamentos.value.push(ubigeos[i].departamento);
    //     }
    //   }
    // };

    return {
      tipo_documento,
      email_notificacion,
      numero_documento,
      razon_social,
      direccion_fiscal,
      referencia_direccion_fiscal,
      departamento,
      provincia,
      distrito,
      codigo_ubigeo,
      tipo_cliente,
      profesion_ocupacion,
      activo,
      validateAndSaveChangesCustomer,
      obtenerDatosSunat,
      isLoadingSunat,
      isLoadingOcupaciones,
      searchValueOcupacion,
      lista_tipos_contribuyente,
      lista_sectores,
      panelActual,
      isShowDialogNewLocation,
      isMobile,
      changeOptionDepProvDist,
      departamentos,
      provincias,
      distritos,
      isThemeDark,
    };
  },
});
</script>
