<template lang="pug">
v-dialog(
  v-model="isShowDialogValidCustomerInSAP",
  scrollable="",
  :width="isMobile ? '100%' : '450'"
)
  v-card.pa-4(:loading="isLoadingGetCustomerFromSap")
    v-card-title
      span.font-extrabold.text-md Buscar cliente en SAP
    span.text-xs.font-medium.mx-4.my-2 Esta opcion realiza la busqueda del cliente en los servicios de SAP utilizando el codigo
      span.text-md.font-bold.text-primary.mx-2 {{ parseDocumentNumberToSapCode() }}
    .max-h-72.ma-4.my-6
      .flex.flex-col.pa-8.items-center(v-if="isLoadingGetCustomerFromSap")
        v-progress-circular.mt-2(
          color="primary",
          indeterminate,
          rounded,
          height="5"
        )
      .items-center.flex.justify-center.h-full(v-if="!customersInSap.length")
        .flex-col.items-center.flex.justify-center.bg-background.pa-4.rounded-full(
          class="h-1/3 w-1/1"
        )
          v-icon.text-slate-300(start, size="90", icon="$mdiDatabaseEyeOff")
          small.text-slate-300.text-xs.font-semibold.my-2.mx-6 No se encontrarón coincidencias en SAP
      v-card.pa-3.mb-4(
        v-for="(i, index) in customersInSap",
        :key="index",
        :value="index",
        :color="i.direccion === customerMatchInSap?.direccion ? 'primary' : 'background'",
        @click="customerMatchInSap = i"
      )
        .flex.items-center.justify-center
          .mr-3
            v-radio(
              :model-value="customerMatchInSap?.direccion",
              :value="i.direccion",
              density="compact"
            )
          v-list.py-0(
            :bg-color="i.direccion === customerMatchInSap?.direccion ? 'primary' : 'background'"
          )
            v-list-item-title
              .font-extrabold.text-xs {{ i.codigoSapCliente }} - {{ i.descripcionCliente }}
            v-list-item-subtitle
              small.text-xs {{ i.direccion }}
    .flex.pa-4
      v-btn.flex-1(
        color="error",
        variant="tonal",
        :rounded="5",
        @click="closeDialogValidCustomerInSAP()"
      )
        | Cancelar
      v-btn.flex-1.ml-4(
        v-if="customerMatchInSap?.direccion",
        color="success",
        :rounded="5",
        @click="updateSapCodeOfCustomer()"
      )
        span.text-white Vincular cliente
v-dialog(
  v-model="isShowDialogAddOrUpdateCustomer",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '500'"
)
  v-card(:rounded="isMobile ? 0 : 5")
    v-form-add-edit-customer(
      :customer-id="customerIdUpdate",
      @created="getListCustomersAndSelected",
      @updated="getListCustomersAndSelected",
      @close="closeDialogAddOrUpdateCustomer"
    )
v-dialog(
  v-model="isShowDialogAddOrUpdateCustomerLocation",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : `${locationId ? '600' : '500'}`"
)
  v-card(:rounded="isMobile ? 0 : 5")
    v-form-add-edit-customer-location(
      :customer-id="customer?.id",
      :customer-location-id="locationId",
      @created="getListCustomerLocations",
      @updated="getListCustomerLocations",
      @close="closeDialogAddOrUpdateCustomerLocation"
    )
v-dialog(
  v-model="isShowDialogAddOrUpdateCustomerContact",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '500'"
)
  v-card(:rounded="isMobile ? 0 : 5")
    v-form-add-edit-customer-contact(
      :customer-id="customer?.id",
      :customer-contact-id="locationId",
      @created="getListCustomerContacts",
      @updated="getListCustomerContacts",
      @close="closeDialogAddOrUpdateCustomerContact"
    )
v-row(no-gutters)
  v-col(cols="12", lg="3 ", md="4", sm="12")
    v-text-field(
      v-model="searchValue",
      flat,
      prepend-inner-icon="$mdiFilterVariant",
      color="primary",
      variant="solo",
      clearable,
      placeholder="Filtrar por razón social, numero documento",
      type="text",
      hide-details,
      @input="searchListOfCustomersByTerm"
    )
      template(#append-inner)
        v-fade-transition.ml-2(leave-absolute)
          v-btn(
            icon="$mdiSync",
            size="small",
            color="primary",
            variant="elevated",
            @click="getAllCustomers()"
          )
    .py-1.px-4
      v-btn.w-full(
        color="success",
        rounded="3",
        variant="elevated",
        @click="openDialogAddOrUpdateCustomer()"
      )
        v-icon.mr-1(icon="$mdiPlus", color="white", size="27")
        span.font-extrabold.text-white Agregar nuevo cliente
    perfect-scrollbar.overflow-y-auto(
      ref="elCustomerList",
      :class="isMobile ? `h-[calc(100vh-160px)]` : 'h-[calc(100vh-101px)]'",
      @ps-y-reach-end="getAllCustomers(true)"
    )
      v-list.mx-2(mandatory, color="primary", nav)
        v-list-item.py-2(
          v-for="(i, index) in customers",
          :key="index",
          :value="index",
          :active="customer?.id === i.id",
          @click="actionSelectedCustomer(index)"
        )
          template(#prepend)
            v-avatar(v-if="i.logo_corporativo", color="background", :size="35")
              v-img(:src="i.logo_corporativo")
            v-square-avatar-of-text(
              v-else,
              :text="i.razon_social",
              text-size="xs",
              :avatar-size="35",
              variant="tonal",
              text-color="primary"
            )
          v-list-item-title
            small.font-extrabold {{ i.razon_social }}
          v-list-item-subtitle
            small.text-xs.font-medium {{ i.tipo_documento }} - {{ i.numero_documento }} - {{ i.sub_sector }}
          template(#append)
            v-chip(
              v-if="i.codigo_sap",
              label="",
              color="success",
              size="small"
            )
              v-icon.mr-1(
                :icon="!i.codigo_sap ? '$mdiAccountAlert' : '$mdiAccountCheck'",
                size="12",
                :color="!i.codigo_sap ? 'grey' : 'success'"
              )
              small.text-xs.font-bold {{ i.codigo_sap ? "Cliente" : "Nuevo" }}

      .flex.flex-col.pa-2.items-center(v-if="isLoading")
        v-progress-circular.mt-2(
          color="primary",
          indeterminate,
          rounded,
          height="5"
        )
      .flex.mx-4.mb-6(v-if="noMore && !isLoading")
        v-alert(variant="tonal", density="compact", color="error")
          v-icon(start, size="20", icon="$mdiFolderSearch")
          small.text-xs.font-bold No existen mas resultados para esta busqueda
  v-col(
    cols="12",
    lg="9",
    :md="isMobile ? 12 : 8",
    sm="12",
    :class="{ 'absolute z-10': isMobile }"
  )
    .items-center.flex.justify-center.h-full(v-if="!customer && !isMobile")
      .flex-col.items-center.flex.justify-center.bg-background.pa-4.rounded-full(
        class="h-1/3 w-1/2"
      )
        v-icon.text-slate-300(start, size="90", icon="$mdiAccountArrowLeft")
        small.text-slate-300.text-md.font-semibold.my-2 Seleccione un usuario del panel lateral izquierdo
    perfect-scrollbar.overflow-y-auto.bg-white(
      v-if="customer",
      :class="isMobile ? 'h-[calc(100vh-56px)]' : 'h-screen'"
    )
      //- v-card-title.flex.items-center.py-2.bg-primary(v-if="isMobile")
      //-   v-btn.mr-3(
      //-     icon="",
      //-     size="small",
      //-     flat,
      //-     color="primary",
      //-     @click="emitCloseComponent()"
      //-   )
      //-     v-icon(icon="$mdiArrowLeft", size="25 ")

      v-card.d-flex.justify-center.flex-wrap.elevation-1(
        :disabled="isLoading",
        color="primary",
        :flat="isMobile",
        :rounded="isMobile ? 0 : 20",
        :class="!isMobile ? 'pa-4 pb-0 ma-4' : ''"
      )
        v-list(bg-color="primary")
          v-list-item.px-2
            template(#prepend)
              v-btn.mr-2(
                v-if="isMobile",
                icon="",
                size="small",
                flat,
                color="primary",
                @click="removeCustomerSelected()"
              )
                v-icon(icon="$mdiArrowLeft", size="25 ")
              v-avatar(
                v-if="customer.logo_corporativo",
                color="background",
                density="compact",
                :size="!isMobile ? 60 : 45"
              )
                v-img(:src="customer.logo_corporativo")
              v-square-avatar-of-text(
                v-else,
                :text="customer.razon_social",
                :avatar-size="!isMobile ? 60 : 45",
                :text-size="isMobile ? 'lg' : '2xl'",
                bg-color="white",
                text-color="primary"
              )
            v-list-item-title
              span.font-extrabold(:class="isMobile ? 'text-md' : 'text-lg'") {{ customer.razon_social }}
            v-list-item-subtitle
              span.text-md {{ customer.numero_documento }} -
              span.text-md.mx-1 {{ customer.sub_sector || "Seleccione un sector" }}
            template(#append)
              v-btn.mx-2(
                icon="$mdiPencil",
                @click="openDialogAddOrUpdateCustomer(customer?.id)"
              )
        //- .flex.w-full.pa-4
          //- .flex
          //-   v-list-item.px-2
          //-     template(#prepend)
          //-       v-avatar(
          //-         v-if="customer.logo_corporativo",
          //-         color="background",
          //-         density="compact",
          //-         :size="!isMobile ? 65 : 40"
          //-       )
          //-         v-img(:src="customer.logo_corporativo")
          //-       v-square-avatar-of-text(
          //-         v-else,
          //-         :text="customer.razon_social",
          //-         :avatar-size="!isMobile ? 65 : 40",
          //-         :text-size="isMobile ? 'lg' : '2xl'",
          //-         bg-color="white",
          //-         text-color="primary"
          //-       )
          //-     v-list-item-title
          //-       span.font-extrabold(:class="isMobile ? 'text-md' : 'text-lg'") {{ customer.razon_social }}
          //-     v-list-item-subtitle
          //-       span.text-md {{ customer.numero_documento }} -
          //-       span.text-md.mx-1 {{ customer.sub_sector || "Seleccione un sector" }}
          //-     template(#append)
          //-       v-btn.mx-4(
          //-         icon="$mdiPencil",
          //-         @click="openDialogAddOrUpdateCustomer(customer?.id)"
          //-       )
        v-spacer
        v-row(justify="end", no-gutters)
          v-col.text-center(
            v-if="!customer.codigo_sap && (customer.tipo_documento === 'DNI' || customer.tipo_documento === 'RUC')",
            cols="auto"
          )
            v-card.mr-4(
              width="110",
              height="90",
              color="white",
              @click="openDialogValidCustomerInSAP()"
            )
              .flex.items-center.justify-center.flex-col.h-full
                v-avatar.mb-1(
                  icon="$mdiDatabaseSearch",
                  color="primary",
                  variant="tonal"
                )
                span.text-xs.font-extrabold Buscar en SAP
          v-col.text-center(v-if="panelActual === 1 && !isMobile", cols="auto")
            v-card(
              width="110",
              height="90",
              color="white",
              @click="openDialogAddOrUpdateCustomerLocation()"
            )
              .flex.items-center.justify-center.flex-col.h-full
                v-avatar.mb-1(
                  icon="$mdiOfficeBuildingPlus",
                  color="primary",
                  variant="tonal"
                )
                span.text-xs.font-extrabold Nueva ubicacion
          v-col.text-center(v-if="panelActual === 2 && !isMobile", cols="auto")
            v-card(
              width="110",
              height="90",
              color="white",
              @click="openDialogAddOrUpdateCustomerContact()"
            )
              .flex.items-center.justify-center.flex-col.h-full
                v-avatar.mb-1(
                  icon="$mdiAccountMultiplePlus",
                  color="primary",
                  variant="tonal"
                )
                span.text-xs.font-extrabold Nuevo contacto
        .w-full.pt-4
          v-tabs(
            v-model="panelActual",
            :disabled="isLoading",
            align-tabs="end",
            :density="isMobile ? 'comfortable' : 'compact'",
            color="white",
            bg-color="primary"
          )
            v-tab(:value="1")
              span.font-extrabold(class="text-[10px]") Ubicaciones
                span.ml-1(v-if="ubicaciones.length") ({{ ubicaciones.length }})
            v-tab(:value="2")
              span.font-extrabold(class="text-[10px]") Contactos
                span.ml-1(v-if="contactos.length") ({{ contactos.length }})
      .pa-4(v-if="panelActual === 1")
        .items-center.flex.justify-center(v-if="!ubicaciones.length")
          .flex-col.items-center.flex.justify-center.bg-background.rounded-full.mt-20.h-56.pa-8.text-xs.text-center(
            class="w-[50vh]"
          )
            v-icon.text-slate-300(
              start,
              :size="isMobile ? 60 : 90",
              icon="$mdiDomain"
            )
            span.text-slate-300.font-semibold.mx-2 No se encontró ninguna ubicacion registrado
        v-row(v-if="ubicaciones.length")
          v-col(
            v-for="(l, index) in ubicaciones",
            :key="index",
            cols="12",
            lg="3",
            md="4",
            sm="12"
          )
            v-hover(v-slot="{ isHovering, props }")
              v-card.mx-auto(
                v-bind="props",
                :elevation="isHovering ? 5 : 1",
                :disabled="isLoading"
              )
                v-carousel(
                  height="150",
                  :hide-delimiters="false",
                  hide-delimiter-background,
                  :show-arrows="false",
                  :interval="5000",
                  cycle,
                  touch,
                  color="primary"
                )
                  v-carousel-item(
                    v-for="(slide, i) in slidesImages(l)",
                    :key="i"
                  )
                    v-card.mx-auto.cursor-pointer(
                      :rounded="0",
                      @click="openDialogAddOrUpdateCustomerLocation(l.id)"
                    )
                      v-img.align-start.text-white.text-end(
                        height="150",
                        :src="slide",
                        gradient="to bottom, rgba(0,0,0,.1), #fff",
                        cover=""
                      )
                        v-btn.ma-4(
                          v-if="l.id === customer.ubicacionId",
                          color="primary",
                          rounded,
                          size="small"
                        )
                          v-icon(start="", icon="$mdiMapMarker")
                          span.font-extrabold(class="text-[10px]") Fiscal
                v-list.py-0
                  v-list-item.py-3(
                    @click="openDialogAddOrUpdateCustomerLocation(l.id)"
                  )
                    v-list-item-title
                      strong.font-extrabold.text-xs {{ l.titulo }}
                    v-list-item-subtitle
                      span.font-bold.text-xs {{ l.direccion }}
                    template(#append="")
                      v-btn(
                        icon,
                        variant="text",
                        density="comfortable",
                        @click="() => {}"
                      )
                        v-icon(
                          icon="$mdiDotsVertical",
                          size="25",
                          color="grey"
                        )
      div(v-if="panelActual === 2")
        .items-center.flex.justify-center(v-if="!contactos.length")
          .flex-col.items-center.flex.justify-center.bg-background.rounded-full.mt-20.h-56.pa-8.text-xs.text-center(
            class="w-[50vh]"
          )
            v-icon.text-slate-300(
              start,
              :size="isMobile ? 60 : 90",
              icon="$mdiAccountGroup"
            )
            span.text-slate-300.font-semibold.mx-2 No se encontró ningun contacto registrado
        //- .items-center.flex.justify-center.h-full(v-if="!contactos.length")
        //-   .flex-col.items-center.flex.justify-center.bg-background.pa-4.rounded-full(
        //-     class="h-1/3 w-1/2"
        //-   )
        //-     v-icon.text-slate-300(
        //-       start,
        //-       size="90",
        //-       icon="$mdiAccountMultipleRemoveOutline"
        //-     )
        //-     small.text-slate-300.text-md.font-semibold.my-2 No se encontró ningun contacto registrado para el cliente seleccionado
        v-row(v-else)
          v-col(
            v-for="(c, index) in contactos",
            :key="index",
            cols="12",
            lg="3",
            md="4",
            sm="12"
          )
            v-hover(v-slot="{ isHovering, props }")
              v-card.mx-auto(
                :elevation="isHovering ? 3 : 1",
                v-bind="props",
                height="228",
                color="background",
                :disabled="isLoading"
              )
                .flex.items-center.justify-center.h-full.flex-col
                  .flex.flex-col.items-center
                    v-avatar.mb-2(color="primary", size="60", variant="tonal")
                      span.font-bold NA
                    span.font-extrabold.text-md {{ c.nombre }}
                    span.text-xs.font-bold.text-slate-300 {{ c.cargo }}
                  .flex.mt-6
                    v-btn.mx-2(
                      icon="$mdiPencil",
                      color="primary",
                      @click="openDialogAddOrUpdateCustomerContact(c.id)"
                    )
                    v-btn.mx-2(icon="$mdiPhone", color="blue")
                    v-btn.mx-2(color="success", icon)
                      v-icon(icon="$mdiWhatsapp", size="22", color="white")
</template>
<script>
import { computed, defineComponent, onMounted, ref } from "vue";
import { useAppStore, useThemeStore } from "@/store";
import { useDisplay } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
import { useDebounceFn } from "@vueuse/core";
import SquareAvatarOfTextComponent from "@/components/square_avatar_of_text_component.vue";
import FormAddOrEditCustomerComponent from "@/components/form_add_edit_customer_component.vue";
import FormAddOrEditCustomerLocationComponent from "@/components/form_add_edit_customer_location_component.vue";
import FormAddOrEditCustomerContactComponent from "@/components/form_add_edit_customer_contact_component.vue";
export default defineComponent({
  name: "ViewCustomerManager",
  components: {
    "v-square-avatar-of-text": SquareAvatarOfTextComponent,
    "v-form-add-edit-customer": FormAddOrEditCustomerComponent,
    "v-form-add-edit-customer-location": FormAddOrEditCustomerLocationComponent,
    "v-form-add-edit-customer-contact": FormAddOrEditCustomerContactComponent,
  },
  setup() {
    const { mobile } = useDisplay();
    const { getThemePreference } = useThemeStore();
    const {
      fetchGetListCustomers,
      fetchGetListCustomerLocations,
      fetchGetListCustomerContacts,
      fetchGetCustomerOfSAP,
      fetchUpdateCustomer,
    } = useAppStore();

    const customers = ref([]);
    const customer = ref(null);
    const locationId = ref("");
    const customerIdUpdate = ref("");
    const ubicaciones = ref([]);
    const contactos = ref([]);
    const customersInSap = ref([]);
    const customerMatchInSap = ref("");
    const isLoading = ref(false);
    const isLoadingGetCustomerFromSap = ref(false);
    const isLoadingGetListCustomerLocations = ref(false);
    const isLoadingGetListCustomerContacts = ref(false);
    const isShowDialogAddOrUpdateCustomer = ref(false);
    const isShowDialogAddOrUpdateCustomerLocation = ref(false);
    const isShowDialogAddOrUpdateCustomerContact = ref(false);
    const isShowDialogValidCustomerInSAP = ref(false);
    const searchValue = ref("");
    const panelActual = ref(1);
    const noMore = ref(false);

    onMounted(() => getAllCustomers());

    const isMobile = computed(() => mobile.value);

    const actionSelectedCustomer = async (index) => {
      try {
        customer.value = { ...customers.value[index] };
        ubicaciones.value = await fetchGetListCustomerLocations(
          customer.value.id
        );
        contactos.value = await fetchGetListCustomerContacts(customer.value.id);
      } catch (error) {
        notify({ type: "error", text: error.message });
      }
    };

    const searchListOfCustomersByTerm = useDebounceFn(
      async () => {
        if (!searchValue.value) return getAllCustomers();

        try {
          isLoading.value = true;
          customer.value = null;
          ubicaciones.value = [];
          contactos.value = [];
          noMore.value = true;
          const records = await fetchGetListCustomers({
            search: searchValue.value,
          });
          console.log("records", records);
          customers.value = records;
        } catch (error) {
          notify({ type: "error", text: error.message });
        } finally {
          isLoading.value = false;
        }
      },
      300,
      { maxWait: 5000 }
    );

    const getAllCustomers = async (isScroll = false) => {
      console.log("entro getAllCustomers...");
      if (!isScroll) {
        customers.value = [];
        ubicaciones.value = [];
        contactos.value = [];
        customer.value = null;
        noMore.value = false;
      }

      if (isLoading.value || noMore.value) return;

      try {
        isLoading.value = true;
        const records = await fetchGetListCustomers({
          sort: "DESC",
          sortColumn: "fecha_modificacion",
          countRecords: 20,
          countRecordsShown: customers.value.length,
        });

        if (!records.length) {
          noMore.value = true;
          return;
        }

        for (let r = 0; r < records.length; r++) {
          const element = records[r];
          customers.value.push(element);
        }
        // try {
        //   isLoading.value = true;
        //   let records = [];
        //   if (searchValue.value) {
        //     noMore.value = true;
        //     records = await fetchGetListCustomers({
        //       search: searchValue.value,
        //     });
        //     customers.value = records;
        //   } else {
        //     records = await fetchGetListCustomers({
        //       sort: "DESC",
        //       sortColumn: "fecha_modificacion",
        //       countRecords: 20,
        //       countRecordsShown: customers.value.length,
        //     });
        //     if (!records.length) {
        //       noMore.value = true;
        //       return;
        //     }

        //     for (let r = 0; r < records.length; r++) {
        //       const element = records[r];
        //       customers.value.push(element);
        //     }
        //   }
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoading.value = false;
      }
    };

    const getListCustomerLocations = async () => {
      try {
        isLoadingGetListCustomerLocations.value = true;
        ubicaciones.value = await fetchGetListCustomerLocations(
          customer.value.id
        );
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoadingGetListCustomerLocations.value = true;
      }
    };

    const getListCustomerContacts = async () => {
      try {
        isLoadingGetListCustomerContacts.value = true;
        contactos.value = await fetchGetListCustomerContacts(customer.value.id);
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoadingGetListCustomerContacts.value = true;
      }
    };

    const closeDialogAddOrUpdateCustomer = () => {
      customerIdUpdate.value = "";
      isShowDialogAddOrUpdateCustomer.value = false;
    };
    const openDialogAddOrUpdateCustomer = (value = "") => {
      customerIdUpdate.value = value;
      isShowDialogAddOrUpdateCustomer.value = true;
    };

    const openDialogValidCustomerInSAP = () => {
      isShowDialogValidCustomerInSAP.value = true;
      getCustomerOfSap();
    };

    const closeDialogValidCustomerInSAP = () => {
      isShowDialogValidCustomerInSAP.value = false;
      customersInSap.value = [];
      customerMatchInSap.value = null;
    };

    const closeDialogAddOrUpdateCustomerLocation = () =>
      (isShowDialogAddOrUpdateCustomerLocation.value = false);
    const openDialogAddOrUpdateCustomerLocation = (id) => {
      locationId.value = id;
      isShowDialogAddOrUpdateCustomerLocation.value = true;
    };
    const closeDialogAddOrUpdateCustomerContact = () =>
      (isShowDialogAddOrUpdateCustomerContact.value = false);
    const openDialogAddOrUpdateCustomerContact = (id) => {
      locationId.value = id;
      isShowDialogAddOrUpdateCustomerContact.value = true;
    };

    const getListCustomersAndSelected = async (idEmmited) => {
      if (searchValue.value) await searchListOfCustomersByTerm();
      else await getAllCustomers();
      const position = customers.value.findIndex((e) => e.id === idEmmited);
      actionSelectedCustomer(position);
    };

    const slidesImages = ({
      imagen_uno,
      imagen_dos,
      imagen_tres,
      imagen_cuatro,
    }) => {
      const slides = [];
      if (imagen_uno) slides.push(imagen_uno);
      if (imagen_dos) slides.push(imagen_dos);
      if (imagen_tres) slides.push(imagen_tres);
      if (imagen_cuatro) slides.push(imagen_cuatro);

      if (!slides.length)
        slides.push("/public/assets/placeholder-location-image.png");
      return slides;
    };

    const getCustomerOfSap = async () => {
      try {
        customersInSap.value = [];
        customerMatchInSap.value = null;
        isLoadingGetCustomerFromSap.value = true;

        let numero_documento = parseDocumentNumberToSapCode();

        const { lista } = await fetchGetCustomerOfSAP(numero_documento);
        if (!lista.length)
          return notify({
            type: "error",
            text: "No existe ningun cliente registrado en SAP con este numero de documento",
          });

        customersInSap.value = lista;
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoadingGetCustomerFromSap.value = false;
      }
    };

    const updateSapCodeOfCustomer = async () => {
      try {
        await fetchUpdateCustomer(customer.value.id, {
          codigo_sap: customerMatchInSap.value.codigoSapCliente,
        });
        getListCustomersAndSelected(customer.value.id);
        closeDialogValidCustomerInSAP();
      } catch (error) {
        notify({ type: "error", text: error.message });
      }
    };

    const parseDocumentNumberToSapCode = () => {
      let sapcode = `C${customer.value.numero_documento}`;

      if (customer.value.tipo_documento === "DNI")
        sapcode = `C000${customer.value.numero_documento}`;

      return sapcode;
    };

    const removeCustomerSelected = () => {
      customer.value = "";
      ubicaciones.value = [];
      contactos.value = [];
    };

    return {
      searchListOfCustomersByTerm,
      parseDocumentNumberToSapCode,
      updateSapCodeOfCustomer,
      isShowDialogValidCustomerInSAP,
      openDialogValidCustomerInSAP,
      closeDialogValidCustomerInSAP,
      // fetchByScroll,
      ubicaciones,
      contactos,
      searchValue,
      isMobile,
      customer,
      customers,
      panelActual,
      isLoading,
      getAllCustomers,
      actionSelectedCustomer,
      isShowDialogAddOrUpdateCustomer,
      isShowDialogAddOrUpdateCustomerLocation,
      isShowDialogAddOrUpdateCustomerContact,
      closeDialogAddOrUpdateCustomerContact,
      openDialogAddOrUpdateCustomerContact,
      closeDialogAddOrUpdateCustomer,
      openDialogAddOrUpdateCustomer,
      getThemePreference,
      closeDialogAddOrUpdateCustomerLocation,
      openDialogAddOrUpdateCustomerLocation,
      locationId,
      getListCustomersAndSelected,
      slidesImages,
      customerIdUpdate,
      getListCustomerLocations,
      getListCustomerContacts,
      noMore,
      getCustomerOfSap,
      customersInSap,
      customerMatchInSap,
      removeCustomerSelected,
    };
  },
});
</script>
