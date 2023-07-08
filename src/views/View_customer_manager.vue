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
      @created="(id) => getAllCustomers(false, id)",
      @updated="getOneCustomerUpdated",
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
      @input="searchListOfCustomersByTerm()"
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
    v-card.py-1.px-4(flat, rounded="0")
      v-btn.w-full(
        color="success",
        rounded="3",
        variant="elevated",
        @click="openDialogAddOrUpdateCustomer()"
      )
        v-icon.mr-1(icon="$mdiPlus", color="white", size="27")
        span.font-extrabold.text-white Agregar nuevo cliente
    perfect-scrollbar.overflow-y-auto.bg-surface(
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
            small.text-xs.font-bold {{ i.tipo_documento }} - {{ i.numero_documento }}
            small.text-xs.font-bold.ml-1(v-if="i.sub_sector") - {{ i.sub_sector }}
          template(#append)
            v-chip(
              label="",
              :color="i.codigo_sap ? 'success' : 'orange'",
              size="small"
            )
              v-icon.mr-1(
                :icon="!i.codigo_sap ? '$mdiAccountAlert' : '$mdiAccountCheck'",
                size="12",
                :color="!i.codigo_sap ? 'orange' : 'success'"
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
    .items-center.flex.justify-center.h-full.bg-background(
      v-if="!customer && !isMobile"
    )
      .flex-col.items-center.flex.justify-center.pa-4.rounded-full(
        class="h-1/3 w-1/2",
        :class="{ 'bg-slate-100': !isThemeDark, 'backdrop-brightness-75': isThemeDark }"
      )
        v-icon(
          start,
          size="90",
          icon="$mdiAccountArrowLeft",
          :class="{ 'text-slate-300': !isThemeDark }"
        )
        small.text-md.font-semibold.my-2(
          :class="{ 'text-slate-300': !isThemeDark }"
        ) Seleccione un usuario del panel lateral izquierdo
    perfect-scrollbar.overflow-y-auto(
      v-if="customer",
      :class="{ 'h-[calc(100vh-56px)]': isMobile, 'h-screen': !isMobile, 'bg-white': !isThemeDark, 'bg-background': isThemeDark }"
    )
      v-sheet.elevation-1.overflow-hidden(
        :disabled="isLoading",
        color="primary",
        :class="!isMobile ? 'ma-4 mb-0 rounded-lg' : 'rounded-0'"
      )
        v-list.py-0(bg-color="primary")
          v-list-item.pa-4(
            @click="openDialogAddOrUpdateCustomer(customer?.id)"
          )
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
                :size="!isMobile ? 55 : 40"
              )
                v-img(:src="customer.logo_corporativo")
              v-square-avatar-of-text(
                v-else,
                :text="customer.razon_social",
                :avatar-size="!isMobile ? 55 : 40",
                :text-size="isMobile ? 'md' : 'lg'",
                bg-color="white",
                text-color="primary"
              )
            v-list-item-title
              span.font-extrabold(:class="isMobile ? 'text-md' : 'text-lg'") {{ customer.razon_social }}
            v-list-item-subtitle
              span.text-md {{ customer.tipo_documento }} - {{ customer.numero_documento }}
              span.text-md.mx-1(v-if="!isMobile") - {{ customer.sub_sector || "Seleccione un sector" }}
            template(#append)
              v-row(v-if="!isMobile", justify="end", no-gutters)
                v-col.text-center(
                  v-if="!customer.codigo_sap && (customer.tipo_documento === 'DNI' || customer.tipo_documento === 'RUC')",
                  cols="auto"
                )
                  v-card.mr-4(
                    width="110",
                    height="90",
                    color="white",
                    @click.stop="openDialogValidCustomerInSAP()"
                  )
                    .flex.items-center.justify-center.flex-col.h-full
                      v-avatar.mb-1(
                        icon="$mdiDatabaseSearch",
                        color="primary",
                        variant="tonal"
                      )
                      span.text-xs.font-extrabold Buscar en SAP
                v-col.text-center(v-if="panelActual === 1", cols="auto")
                  v-card(
                    width="110",
                    height="90",
                    color="white",
                    @click.stop="openDialogAddOrUpdateCustomerLocation()"
                  )
                    .flex.items-center.justify-center.flex-col.h-full
                      v-avatar.mb-1(
                        icon="$mdiOfficeBuildingPlus",
                        color="primary",
                        variant="tonal"
                      )
                      span.text-xs.font-extrabold Nueva ubicacion
                v-col.text-center(v-if="panelActual === 2", cols="auto")
                  v-card(
                    width="110",
                    height="90",
                    color="white",
                    @click.stop="openDialogAddOrUpdateCustomerContact()"
                  )
                    .flex.items-center.justify-center.flex-col.h-full
                      v-avatar.mb-1(
                        icon="$mdiAccountMultiplePlus",
                        color="primary",
                        variant="tonal"
                      )
                      span.text-xs.font-extrabold Nuevo contacto
        v-spacer(v-if="!isMobile")
        .w-full
          v-tabs(
            v-model="panelActual",
            :disabled="isLoading",
            :align-tabs="isMobile ? 'end' : 'start'",
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
          .flex-col.items-center.flex.justify-center.rounded-full.mt-20.h-56.pa-8.text-xs.text-center(
            class="w-[50vh]",
            :class="{ 'bg-background': !isThemeDark }"
          )
            v-icon(
              :class="{ 'text-slate-300': !isThemeDark }",
              start,
              :size="isMobile ? 60 : 90",
              icon="$mdiDomain"
            )
            span.font-semibold.mx-2(
              :class="{ 'text-slate-300': !isThemeDark }"
            ) No se encontró ninguna ubicacion registrado
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
                :elevation="isHovering ? 3 : 1",
                :disabled="isLoading"
              )
                v-carousel(
                  v-if="l.imagen_uno || l.imagen_dos || l.imagen_tres || l.imagen_cuatro",
                  height="130",
                  :hide-delimiters="false",
                  hide-delimiter-background,
                  :show-arrows="false",
                  :interval="5000",
                  cycle,
                  touch,
                  color="white"
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
                        height="130",
                        :src="slide",
                        gradient="to bottom, rgba(0,0,0,.1), #2d4258bd",
                        cover=""
                      )
                        v-btn.ma-2(
                          v-if="l.id === customer.ubicacionId",
                          color="primary",
                          :rounded="3",
                          size="small"
                        )
                          v-icon(start="", icon="$mdiMapMarker")
                          strong.font-extrabold(class="text-[10px]") Fiscal
                .flex.justify-center.items-center.cursor-pointer(
                  v-else,
                  v-ripple,
                  class="h-[130px]",
                  :class="{ 'bg-slate-100': !isThemeDark, '': isThemeDark }",
                  @click="openDialogAddOrUpdateCustomerLocation(l.id)"
                )
                  .w-16
                    v-logo-application.w-full(
                      :color="isThemeDark ? current.colors.background : current.colors.surface"
                    )
                v-list.py-0
                  v-list-item.py-3(
                    @click="openDialogAddOrUpdateCustomerLocation(l.id)"
                  )
                    v-list-item-title
                      strong.font-extrabold.text-xs {{ l.titulo }}
                    v-list-item-subtitle
                      span.font-bold.text-xs.text-slate-400 {{ l.direccion }}
                    template(#append="")
                      v-menu
                        template(#activator="{ props: menuProps }")
                          v-btn(
                            icon,
                            variant="text",
                            density="comfortable",
                            v-bind="menuProps",
                            color="primary"
                          )
                            v-icon(
                              icon="$mdiDotsVertical",
                              size="25",
                              color="primary"
                            )
                        v-list
                          v-list-item(
                            @click="openDialogAddOrUpdateCustomerLocation(l.id)"
                          )
                            v-list-item-title
                              span.font-md.font-extrabold Editar localización
                            v-list-item-subtitle cambia datos y adjunta imagenes
                          v-list-item(
                            @click="openDialogAddOrUpdateCustomerLocation(l.id)"
                          )
                            v-list-item-title
                              span.font-md.font-extrabold Seleccionar como fiscal
                            v-list-item-subtitle Fijar esta localización como sede principal
                          v-list-item(
                            @click="openDialogAddOrUpdateCustomerLocation(l.id)"
                          )
                            v-list-item-title
                              span.font-md.font-extrabold Ubicar en el mapa
                            v-list-item-subtitle Mostrar la localización en el mapa central
                          v-list-item(
                            @click="openDialogAddOrUpdateCustomerLocation(l.id)"
                          )
                            v-list-item-title
                              span.font-md.font-extrabold Programar un evento
                            v-list-item-subtitle Agrega un evento con esta localización
                          v-list-item(
                            @click="openDialogAddOrUpdateCustomerLocation(l.id)"
                          )
                            v-list-item-title
                              span.font-md.font-extrabold.text-error Desactivar localización
                            v-list-item-subtitle No se mostrará mas esta localización

      .pa-4(v-if="panelActual === 2")
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
                    v-square-avatar-of-text.mb-2(
                      :text="c.nombre",
                      :avatar-size="!isMobile ? 55 : 40",
                      :text-size="isMobile ? 'md' : 'lg'",
                      bg-color="white",
                      text-color="primary"
                    )
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
import { computed, defineComponent, nextTick, onMounted, ref } from "vue";
import { useAppStore, useThemeStore } from "@/store";
import { useDisplay, useTheme } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
import { useDebounceFn } from "@vueuse/core";
import SquareAvatarOfTextComponent from "@/components/square_avatar_of_text_component.vue";
import FormAddOrEditCustomerComponent from "@/components/form_add_edit_customer_component.vue";
import FormAddOrEditCustomerLocationComponent from "@/components/form_add_edit_customer_location_component.vue";
import FormAddOrEditCustomerContactComponent from "@/components/form_add_edit_customer_contact_component.vue";
import LogoApplication from "@/components/component_logo_application.vue";
export default defineComponent({
  name: "ViewCustomerManager",
  components: {
    "v-square-avatar-of-text": SquareAvatarOfTextComponent,
    "v-form-add-edit-customer": FormAddOrEditCustomerComponent,
    "v-form-add-edit-customer-location": FormAddOrEditCustomerLocationComponent,
    "v-form-add-edit-customer-contact": FormAddOrEditCustomerContactComponent,
    "v-logo-application": LogoApplication,
  },
  setup() {
    const { mobile } = useDisplay();
    const { current } = useTheme();
    const { getThemePreference } = useThemeStore();
    const {
      fetchGetListCustomers,
      fetchGetListCustomerLocations,
      fetchGetListCustomerContacts,
      fetchGetCustomerOfSAP,
      fetchUpdateCustomer,
      fetchGetOneCustomer,
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
    const renderCustomerContainer = ref(false);

    onMounted(() => getAllCustomers());

    const isMobile = computed(() => mobile.value);
    const isThemeDark = computed(() => current.value.dark);

    const actionSelectedCustomer = async (index) => {
      try {
        renderCustomerContainer.value = false;
        customer.value = { ...customers.value[index] };
        ubicaciones.value = await fetchGetListCustomerLocations(
          customer.value.id
        );
        contactos.value = await fetchGetListCustomerContacts(customer.value.id);
        nextTick(() => (renderCustomerContainer.value = true));
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

    const getAllCustomers = async (
      isScroll = false,
      idCustomerSelected = ""
    ) => {
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

        if (idCustomerSelected) {
          const position = customers.value.findIndex(
            (e) => e.id === idCustomerSelected
          );
          actionSelectedCustomer(position);
        }
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

    const getOneCustomerUpdated = async (idCustomer = "") => {
      if (idCustomer) {
        try {
          const customerGet = await fetchGetOneCustomer(idCustomer);
          customer.value = { ...customerGet };
        } catch (error) {
          notify({ type: "error", text: error.message });
        }
      }
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
        const customerUpdated = await fetchUpdateCustomer(customer.value.id, {
          codigo_sap: customerMatchInSap.value.codigoSapCliente,
        });
        console.log("customerUpdated", customerUpdated);
        await getOneCustomerUpdated(customer.value.id);
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
      renderCustomerContainer,
      current,
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
      getOneCustomerUpdated,
      slidesImages,
      customerIdUpdate,
      getListCustomerLocations,
      getListCustomerContacts,
      noMore,
      getCustomerOfSap,
      customersInSap,
      customerMatchInSap,
      removeCustomerSelected,
      isThemeDark,
    };
  },
});
</script>
