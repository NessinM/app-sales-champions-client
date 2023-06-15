<template lang="pug">
v-dialog(
  v-model="isShowDialogAddCustomer",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '500'"
)
  v-card(:rounded="isMobile ? 0 : 5")
    v-form-add-edit-customer(
      @created="getAllCustomers",
      @close="closeDialogAddCustomer"
    )
v-dialog(
  v-model="isShowDialogAddCustomerLocation",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '700'"
)
  v-card(:rounded="isMobile ? 0 : 5")
    v-form-add-edit-customer-location(
      :customer-id="customer.id",
      :customer-location-id="locationId",
      @created="getAllCustomers",
      @close="closeDialogAddCustomerLocation"
    )

v-row.h-full(no-gutters)
  v-col(cols="12", lg="3 ", md="4", sm="12")
    .flex.flex-col
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
          bg-color="background",
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
      .p-2
        v-btn.w-full(
          color="success",
          rounded="3",
          variant="elevated",
          @click="openDialogAddCustomer"
        )
          v-icon.mr-1(icon="$mdiPlus", color="white", size="27")
          small.font-bold.text-white Agregar nuevo cliente
      perfect-scrollbar.overflow-y-auto.pb-5(class="h-[calc(100vh-170px)]")
        v-alert.ma-4(
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

        v-list(
          mandatory,
          color="primary",
          @update:selected="actionSelectedCustomer"
        )
          v-list-item.py-3(
            v-for="(i, index) in customers",
            :key="index",
            :value="index"
          )
            template(#prepend)
              v-avatar(color="background", density="compact")
                v-img(:src="i.logo_corporativo")
            v-list-item-title
              span.font-extrabold.text-xs {{ i.razon_social }}
            v-list-item-subtitle
              span.text-xs {{ i.numero_documento }} - {{ i.sub_sector }}
            template(#append)
              v-chip(color="grey", density="comfortable")
                v-icon(start, size="13", icon="$mdiShieldStarOutline")
                small.font-medium Nuevo
  v-col(cols="12", lg="9", md="8", sm="12")
    .items-center.flex.justify-center.h-full(v-if="!customer")
      .flex-col.items-center.flex.justify-center.bg-background.pa-4.rounded-full(
        class="h-1/3 w-1/2"
      )
        v-icon.text-slate-300(start, size="90", icon="$mdiAccountArrowLeft")
        small.text-slate-300.text-md.font-semibold.my-2 Seleccione un usuario del panel lateral izquierdo
    .h-full.bg-background(v-else)
      .bg-white.flex.items-center.justify-center.h-32(class="!sticky !top-0 !z-10")
        v-list-item
          template(#prepend)
            v-avatar(color="background", density="compact", size="75")
              v-img(:src="customer.logo_corporativo")
          v-list-item-title
            span.text-lg.font-extrabold {{ customer.razon_social }}
          v-list-item-subtitle
            span.text-md {{ customer.numero_documento }} - Banca y seguros
          template(#append)
            v-btn.mx-4(icon="$mdiPencil")
      v-tabs(
        v-model="panelActual",
        align-tabs="end",
        density="compact",
        color="primary",
        bg-color="white"
      )
        v-tab(:value="1")
          span.font-bold(class="text-[11px]") Ubicaciones
        v-tab(:value="2")
          span.font-bold(class="text-[11px]") Contactos
      v-divider
      .pa-4
        v-row
          v-col(cols="12", lg="3", md="6", sm="12")
            v-hover(v-slot="{ isHovering, props }")
              v-card.mx-auto.pa-4(
                height="215",
                :elevation="isHovering ? 4 : 1",
                :class="{ 'on-hover text-white': isHovering }",
                v-bind="props",
                :color="isHovering ? 'primary' : 'white'",
                @click="openDialogAddCustomerLocation()"
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
                @click="openDialogAddCustomerLocation(l.id)"
              )
                v-carousel(
                  height="150",
                  hide-delimiters,
                  :show-arrows="false",
                  :interval="5000",
                  cycle,
                  touch
                )
                  v-carousel-item(
                    v-for="(slide, i) in [l.imagen_uno, l.imagen_dos, l.imagen_tres, l.imagen_cuatro]",
                    :key="i"
                  )
                    v-card.mx-auto.cursor-pointer(:rounded="0")
                      v-img.align-end.text-white(
                        height="150",
                        :src="slide",
                        gradient="to bottom, rgba(0,0,0,.1), #2d4258a1",
                        cover=""
                      )
                        v-card-title
                          .text-sm.font-bold {{ l.nombre }}
                v-list
                  v-list-item
                    v-list-item-title
                      span.font-bold.text-sm {{ l.direccion }}
                    v-list-item-subtitle
                      span.text-xs {{ l.distrito }} - {{ l.provincia }} - {{ l.departamento }}
                    template(#prepend="")
                      v-avatar(color="primary")
                        v-icon(color="white", icon="$mdiMapMarkerOutline")
</template>
<script>
import { computed, defineComponent, ref, onMounted } from "vue";
import { useAppStore, useThemeStore } from "@/store";
import { useDisplay, useTheme } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
import FormAddOrEditCustomerComponent from "@/components/form_add_edit_customer_component.vue";
import FormAddOrEditCustomerLocationComponent from "@/components/form_add_edit_customer_location_component.vue";
export default defineComponent({
  name: "ViewCustomerManager",
  components: {
    "v-form-add-edit-customer": FormAddOrEditCustomerComponent,
    "v-form-add-edit-customer-location": FormAddOrEditCustomerLocationComponent,
  },
  setup() {
    const { mobile } = useDisplay();
    const { getThemePreference } = useThemeStore();
    const { fetchGetListCustomers } = useAppStore();

    const theme = useTheme();

    const customers = ref([]);
    const customer = ref(null);
    const locationId = ref("");
    const filteredCustomers = ref([]);
    const isLoading = ref(true);
    const isShowDialogAddCustomer = ref(false);
    const isShowDialogAddCustomerLocation = ref(false);
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

    const actionSelectedCustomer = ([index]) => {
      customer.value = { ...customers.value[index] };
    };

    const getAllCustomers = async () => {
      try {
        closeDialogAddCustomer();
        closeDialogAddCustomerLocation();
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

    const closeDialogAddCustomer = () =>
      (isShowDialogAddCustomer.value = false);
    const openDialogAddCustomer = () => (isShowDialogAddCustomer.value = true);

    const closeDialogAddCustomerLocation = () =>
      (isShowDialogAddCustomerLocation.value = false);
    const openDialogAddCustomerLocation = (id) => {
      locationId.value = id;
      isShowDialogAddCustomerLocation.value = true;
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
      isShowDialogAddCustomer,
      isShowDialogAddCustomerLocation,
      closeDialogAddCustomer,
      openDialogAddCustomer,
      getThemePreference,
      closeDialogAddCustomerLocation,
      openDialogAddCustomerLocation,
      locationId,
    };
  },
});
</script>
