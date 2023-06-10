<template lang="pug">
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
      v-card.px-4.py-3.text-primary.text-xs.font-bold(rounded="0", flat) Total de clientes registrados {{ customers.length }}
      perfect-scrollbar.overflow-y-auto.pb-10(class="h-[calc(100vh-97px)]")
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
              span.font-extrabold.text-xs {{ i.razon_social }}
            v-list-item-subtitle
              span.text-xs {{ i.email_notificacion }}
            template(#append)
              v-chip(color="grey", density="comfortable")
                v-icon(start, size="13", icon="$mdiShieldStarOutline")
                small.font-medium Nuevo
              v-btn(color="grey", icon="$mdiDotsVertical", variant="text")
  v-col(cols="12", lg="9", md="8", sm="12")
    v-card.h-full.relative(
      rounded="0",
      elevation="0",
      :class="{ 'bg-background': isThemeDark }"
    )
      .items-center.flex.justify-center.h-full(v-if="!customer")
        .flex-col.items-center.flex.justify-center.bg-background.pa-4.rounded-full(
          class="h-1/3 w-1/2"
        )
          v-icon.text-slate-300(start, size="90", icon="$mdiAccountArrowLeft")
          small.text-slate-300.text-md.font-semibold.my-2 Seleccione un usuario del panel lateral izquierdo {{ customer }}
      vc-form-customer-edit(v-else, :customer="customer")
</template>
<script>
import { computed, defineComponent, ref, onMounted } from "vue";
import { useAppStore } from "@/store";
import { useDisplay, useTheme } from "vuetify";
import { notify } from "@kyvg/vue3-notification";

import FormCustomerEdit from "@/components/component_form_customer_edit.vue";
export default defineComponent({
  name: "ViewCustomerManager",
  components: {
    "vc-form-customer-edit": FormCustomerEdit,
  },
  setup() {
    const { mobile } = useDisplay();
    const { fetchGetListCustomers } = useAppStore();

    const theme = useTheme();
    const customers = ref([]);
    const customer = ref(null);
    const filteredCustomers = ref([]);
    const isLoading = ref(true);
    const searchValue = ref("");

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
      filterData,
      isLoading,
      getAllCustomers,
      actionSelectedCustomer,
    };
  },
});
</script>
