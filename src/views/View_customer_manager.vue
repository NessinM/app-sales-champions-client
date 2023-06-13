<template lang="pug">
v-dialog(
  v-model="isShowDialogEditCustomer",
  :fullscreen="isMobile",
  scrollable,
  :width="isMobile ? '100%' : '500'"
)
  v-form-customer(:customer-id="customer.id")

v-row.h-full(no-gutters)
  v-col(cols="12", lg="3 ", md="4", sm="12")
    .flex.flex-col
      .flex.align-center.justify-center
        v-text-field(
          v-model="searchValue",
          flat,
          prepend-inner-icon="$mdiFolderSearch",
          color="primary",
          variant="filled",
          clearable,
          placeholder="Ingrese una razón social, ruc",
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
          @click="getAllCustomers()"
        )
          v-icon.mr-1(icon="$mdiPlus", color="white", size="27")
          small.font-bold.text-white Agregar nuevo cliente
      perfect-scrollbar.overflow-y-auto.pb-5(class="h-[calc(100vh-115px)]")
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

        v-list.pa-0(
          :lines="false",
          density="compact",
          mandatory,
          color="primary",
          @update:selected="actionSelectedCustomer"
        )
          v-list-item(
            v-for="(i, index) in customers",
            :key="index",
            :value="index"
          )
            template(#prepend)
              v-avatar(color="background", density="compact")
                v-img(:src="i.imagen_perfil")
            v-list-item-title
              span.font-extrabold.text-md {{ i.razon_social }}
            v-list-item-subtitle
              span.text-xs {{ i.numero_documento }} - {{ i.sub_sector }}
            template(#append)
              v-chip(color="grey", density="comfortable")
                v-icon(start, size="13", icon="$mdiShieldStarOutline")
                small.font-medium Nuevo
              v-btn(color="grey", icon="$mdiDotsVertical", variant="text")
  v-col(cols="12", lg="9", md="8", sm="12")
    .items-center.flex.justify-center.h-full(v-if="!customer")
      .flex-col.items-center.flex.justify-center.bg-background.pa-4.rounded-full(
        class="h-1/3 w-1/2"
      )
        v-icon.text-slate-300(
          start,
          size="90",
          icon="$mdiAccountArrowLeft",
          color="white"
        )
        small.text-slate-300.text-md.font-semibold.my-2 Seleccione un usuario del panel lateral izquierdo
    .bg-primary.flex.items-center.justify-center(
      v-else,
      class="!sticky !top-0 !z-10 h-1/6",
      rounded="0",
      color="primary"
    )
      v-list-item
        template(#prepend)
          v-avatar(color="background", density="compact", size="80")
            v-img(:src="customer.imagen_perfil")
        v-list-item-title
          span.text-2xl.font-bold {{ customer.razon_social }}
        v-list-item-subtitle
          span.text-md {{ customer.numero_documento }} - Banca y seguros
        template(#append)
          v-btn.mx-4(
            icon="$mdiPencil",
            @click="isShowDialogEditCustomer = true"
          )
          //- v-avatar(color="background", density="compact", size="80")
          //-   v-img(:src="customer.imagen_perfil")
        //- v-list-item-action
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
    .pa-4
      v-row
        v-col(cols="12", lg="3", md="6", sm="12")
          v-hover(v-slot="{ isHovering, props }")
            v-card.mx-auto.pa-4(
              height="215",
              :elevation="isHovering ? 4 : 1",
              :class="{ 'on-hover text-white': isHovering }",
              v-bind="props",
              :color="isHovering ? 'primary' : 'background'"
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
        //- vc-form-customer-edit(v-else, :customer="customer")
</template>
<script>
import { computed, defineComponent, ref, onMounted } from "vue";
import { useAppStore } from "@/store";
import { useDisplay, useTheme } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
import FormCustomer from "@/components/component_form_customer.vue";
export default defineComponent({
  name: "ViewCustomerManager",
  components: {
    "v-form-customer": FormCustomer,
  },
  setup() {
    const { mobile } = useDisplay();
    const { fetchGetListCustomers } = useAppStore();

    const theme = useTheme();
    const customers = ref([]);
    const customer = ref(null);
    const filteredCustomers = ref([]);
    const isLoading = ref(true);
    const isShowDialogEditCustomer = ref(false);
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
            item.email_notificacion.toLowerCase().includes(searchTerm)
        );
      }
    };

    const actionSelectedCustomer = ([index]) => {
      customer.value = { ...customers.value[index] };
    };

    const getAllCustomers = async () => {
      try {
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
      isShowDialogEditCustomer,
    };
  },
});
</script>
