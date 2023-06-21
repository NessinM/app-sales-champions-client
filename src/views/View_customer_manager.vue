<template lang="pug">
v-dialog(
  v-model="isShowDialogAddOrUpdateCustomer",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '500'"
)
  v-card(:rounded="isMobile ? 0 : 5")
    v-form-add-edit-customer(
      :customer-id="customerIdUpdate",
      @created="getListCustomerAndSelected",
      @updated="getListCustomerAndSelected",
      @close="closeDialogAddOrUpdateCustomer"
    )
v-dialog(
  v-model="isShowDialogAddOrUpdateCustomerLocation",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '700'"
)
  v-card(:rounded="isMobile ? 0 : 5")
    v-form-add-edit-customer-location(
      :customer-id="customer?.id",
      :customer-location-id="locationId",
      @created="getListCustomerAndSelected",
      @updated="getListCustomerAndSelected",
      @close="closeDialogAddOrUpdateCustomerLocation"
    )
v-dialog(
  v-model="isShowDialogAddOrUpdateCustomerContact",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '700'"
)
  v-card(:rounded="isMobile ? 0 : 5")
    v-form-add-edit-customer-contact(
      :customer-id="customer?.id",
      :customer-contact-id="locationId",
      @created="getListCustomerAndSelected",
      @updated="getListCustomerAndSelected",
      @close="closeDialogAddOrUpdateCustomerContact"
    )

v-row.h-full(no-gutters)
  v-col(cols="12", lg="3 ", md="4", sm="12")
    .flex.align-center.justify-center
      v-text-field(
        v-model="searchValue",
        flat,
        prepend-inner-icon="$mdiFolderSearch",
        color="primary",
        variant="solo",
        clearable,
        placeholder="Buscar por razón social, numero documento",
        type="text",
        hide-details,
        @input="filterData"
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
    v-divider(v-if="!isThemeDark")
    .p-2
      v-btn.w-full(
        color="success",
        rounded="3",
        variant="elevated",
        @click="openDialogAddOrUpdateCustomer()"
      )
        v-icon.mr-1(icon="$mdiPlus", color="white", size="27")
        small.font-bold.text-white Agregar nuevo cliente
    v-divider(v-if="!isThemeDark")
    perfect-scrollbar.overflow-y-auto.pb-5(class="h-[calc(100vh-170px)]")
      v-alert(
        v-if="!customers.length && !isLoading",
        variant="outlined",
        density="compact",
        color="error"
      )
        v-icon(start, size="20", icon="$mdiFolderSearch")
        small.text-xs.font-medium No existen datos coincidentes para esta busqueda
      .flex.flex-col.pa-8.items-center(v-if="isLoading")
        small.text-xs.text-primary.font-bold.italic Obteniendo listado de clientes...
        v-progress-linear.mt-2(
          color="primary",
          indeterminate,
          rounded,
          height="5"
        )

      v-list.py-0(mandatory, color="primary")
        v-list-item.py-2(
          v-for="(i, index) in customers",
          :key="index",
          :value="index",
          :active="customer?.id === i.id",
          @click="actionSelectedCustomer(index)"
        )
          template(#prepend)
            v-avatar(v-if="i.logo_corporativo", color="background", :size="32")
              v-img(:src="i.logo_corporativo")
            v-square-avatar-of-text(
              v-else,
              :text="i.razon_social",
              text-size="xs",
              :avatar-size="32"
            )
          v-list-item-title
            small.font-extrabold {{ i.razon_social }}
          v-list-item-subtitle
            span.text-xs {{ i.numero_documento }} - {{ i.sub_sector }}
          template(#append)
            v-chip(color="grey", density="comfortable")
              v-icon(start, size="13", icon="$mdiShieldStarOutline")
              small.font-bold Fiscal
  v-col(
    cols="12",
    lg="9",
    md="8",
    sm="12",
    :class="{ 'absolute z-10': isMobile }"
  )
    .items-center.flex.justify-center.h-full(v-if="!customer && !isMobile")
      .flex-col.items-center.flex.justify-center.bg-background.pa-4.rounded-full(
        class="h-1/3 w-1/2"
      )
        v-icon.text-slate-300(start, size="90", icon="$mdiAccountArrowLeft")
        small.text-slate-300.text-md.font-semibold.my-2 Seleccione un usuario del panel lateral izquierdo
    v-card.h-full(v-if="customer", rounded="0", elevation="0")
      v-toolbar(v-if="isMobile", color="primary")
        v-btn.hidden-xs-only(icon="", @click="customer = null")
          v-icon(icon="$mdiArrowLeft", color="white")
        v-toolbar-title(class="!ms-0")
          v-list-item.px-2
            template(#prepend)
              v-avatar(
                v-if="customer.logo_corporativo",
                color="background",
                density="compact",
                size="40"
              )
                v-img(:src="customer.logo_corporativo")
              v-square-avatar-of-text(
                v-else,
                :text="customer.razon_social",
                :avatar-size="40",
                text-size="sm",
                bg-color="white",
                text-color="primary"
              )
            v-list-item-title
              span.text-sm.font-extrabold {{ customer.razon_social }}
            v-list-item-subtitle
              span.text-md {{ customer.numero_documento }} -
              span.text-md.mx-1 {{ customer.sub_sector || "Seleccione un sector" }}
      .bg-primary.elevation-4(class="!sticky !top-0 !z-10")
        .h-24.flex.items-center.justify-center(v-if="!isMobile")
          v-list-item
            template(#prepend)
              v-avatar(
                v-if="customer.logo_corporativo",
                color="background",
                density="compact",
                size="55"
              )
                v-img(:src="customer.logo_corporativo")
              v-square-avatar-of-text(
                v-else,
                :text="customer.razon_social",
                :avatar-size="55",
                text-size="lg",
                bg-color="white",
                text-color="primary"
              )
            v-list-item-title
              span.text-sm.font-extrabold {{ customer.razon_social }}
            v-list-item-subtitle
              span.text-md {{ customer.numero_documento }} -
              span.text-md.mx-1 {{ customer.sub_sector || "Seleccione un sector" }}
            template(#append)
              v-btn.mx-4(
                icon="$mdiPencil",
                @click="openDialogAddOrUpdateCustomer(customer?.id)"
              )
        v-tabs(
          v-model="panelActual",
          align-tabs="end",
          density="compact",
          color="white",
          bg-color="primary"
        )
          v-tab(:value="1")
            span.font-bold(class="text-[10px]") Ubicaciones
              span.ml-1(v-if="customer.ubicaciones.length") ({{ customer.ubicaciones.length }})
          v-tab(:value="2")
            span.font-bold(class="text-[10px]") Contactos
              span.ml-1(v-if="customer.contactos.length") ({{ customer.contactos.length }})
      perfect-scrollbar.overflow-y-auto.pa-4(
        v-if="panelActual === 1",
        :class="isMobile ? 'h-[calc(100vh-157px)]' : 'h-[calc(100vh-190px)]'"
      )
        v-row
          v-col(cols="12", lg="3", md="6", sm="12")
            v-hover(v-slot="{ isHovering, props }")
              v-card.mx-auto.pa-4(
                :height="isMobile ? 160 : 225",
                :elevation="isHovering ? 6 : 1",
                :class="{ 'on-hover text-white': isHovering }",
                v-bind="props",
                :color="isHovering ? 'primary' : 'background'",
                @click="openDialogAddOrUpdateCustomerLocation()"
              )
                .flex.items-center.justify-center.h-full.flex-col
                  v-icon(
                    :size="isMobile ? 50 : 70",
                    icon="$mdiOfficeBuildingPlus",
                    :class="isHovering ? 'text-white' : 'text-slate-300'"
                  )
                  small.font-bold(
                    :class="isHovering ? 'text-white' : 'text-slate-300'"
                  ) Agregar nueva ubicacion
          v-col(
            v-for="(l, index) in customer.ubicaciones",
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
                @click="openDialogAddOrUpdateCustomerLocation(l.id)"
              )
                v-carousel(
                  height="160",
                  hide-delimiters,
                  :show-arrows="false",
                  :interval="5000",
                  cycle,
                  touch
                )
                  v-carousel-item(
                    v-for="(slide, i) in slidesImages(l)",
                    :key="i"
                  )
                    v-card.mx-auto.cursor-pointer(:rounded="0")
                      v-img.align-end.text-white(
                        height="160",
                        :src="slide",
                        gradient="to bottom, rgba(0,0,0,.1), #2d4258a1",
                        cover=""
                      )
                        v-card-title
                          .text-xs.font-bold {{ l.nombre }}
                v-list
                  v-list-item
                    v-list-item-title
                      span.font-extrabold.text-xs {{ l.direccion }}
                    v-list-item-subtitle
                      span.text-xs {{ l.distrito }} - {{ l.provincia }} - {{ l.departamento }}
                    template(#prepend="")
                      v-avatar(color="primary", size="32")
                        v-icon(color="white", icon="$mdiMapMarkerOutline")
      perfect-scrollbar.overflow-y-auto.pa-4(
        v-if="panelActual === 2",
        :class="isMobile ? 'h-[calc(100vh-157px)]' : 'h-[calc(100vh-190px)]'"
      )
        v-row
          v-col(cols="12", lg="3", md="6", sm="12")
            v-hover(v-slot="{ isHovering, props }")
              v-card.mx-auto.pa-4(
                :height="isMobile ? 160 : 225",
                :elevation="isHovering ? 6 : 1",
                :class="{ 'on-hover text-white': isHovering }",
                v-bind="props",
                :color="isHovering ? 'primary' : 'background'",
                @click="openDialogAddOrUpdateCustomerContact()"
              )
                .flex.items-center.justify-center.h-full.flex-col
                  v-icon(
                    :size="isMobile ? 50 : 70",
                    icon="$mdiAccountMultiplePlus",
                    :class="isHovering ? 'text-white' : 'text-slate-300'"
                  )
                  small.font-bold(
                    :class="isHovering ? 'text-white' : 'text-slate-300'"
                  ) Agregar nuevo contacto
          v-col(
            v-for="(c, index) in customer.contactos",
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
                @click="openDialogAddOrUpdateCustomerContact(c.id)"
              )
                v-card.elevation-5(
                  :rounded="0",
                  height="160",
                  color="background"
                )
                  .flex.items-center.justify-center.h-full
                    div
                      v-btn.mx-2(icon="$mdiPhone", color="blue")
                      v-btn.mx-2.text-white(
                        icon="$mdiWhatsapp",
                        color="success"
                      )

                v-list
                  v-list-item
                    v-list-item-title
                      span.font-extrabold.text-md {{ c.nombre }}
                    v-list-item-subtitle
                      span.text-xs.capitalize {{ c.cargo }}
                    template(#prepend="")
                      v-avatar(
                        v-if="c.imagen_perfil",
                        color="background",
                        density="compact",
                        size="32"
                      )
                        v-img(:src="c.imagen_perfil")
                      v-square-avatar-of-text(
                        v-else,
                        :text="c.nombre",
                        :avatar-size="32",
                        text-size="xs",
                        bg-color="primary",
                        text-color="white "
                      )
</template>
<script>
import { computed, defineComponent, ref, onMounted } from "vue";
import { useAppStore, useThemeStore } from "@/store";
import { useDisplay, useTheme } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
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
    const { fetchGetListCustomers } = useAppStore();

    const theme = useTheme();

    const customers = ref([]);
    const customer = ref(null);
    const locationId = ref("");
    const customerIdUpdate = ref("");
    const filteredCustomers = ref([]);
    const isLoading = ref(true);
    const isShowDialogAddOrUpdateCustomer = ref(false);
    const isShowDialogAddOrUpdateCustomerLocation = ref(false);
    const isShowDialogAddOrUpdateCustomerContact = ref(false);
    const searchValue = ref("");
    const panelActual = ref(1);

    onMounted(() => getAllCustomers());

    const isThemeDark = computed(() => theme.current.value.dark);
    const isMobile = computed(() => mobile.value);

    const filterData = () => {
      const searchTerm = searchValue.value.toLowerCase();
      customers.value = filteredCustomers.value;
      if (searchValue.value) {
        customers.value = customers.value.filter(
          (item) =>
            item.razon_social.toLowerCase().includes(searchTerm) ||
            item.correo_electronico.toLowerCase().includes(searchTerm)
        );
      }
    };

    const actionSelectedCustomer = (index) => {
      customer.value = { ...customers.value[index] };
    };

    const getAllCustomers = async () => {
      try {
        filteredCustomers.value = [];
        customers.value = [];
        isLoading.value = true;
        const response = await fetchGetListCustomers();
        filteredCustomers.value = response.customers;
        customers.value = response.customers;
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoading.value = false;
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

    const getListCustomerAndSelected = async (idEmmited) => {
      await getAllCustomers();
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
      return slides;
    };

    return {
      searchValue,
      isThemeDark,
      isMobile,
      customer,
      customers,
      panelActual,
      filterData,
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
      getListCustomerAndSelected,
      slidesImages,
      customerIdUpdate,
    };
  },
});
</script>
