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
  :width="isMobile ? '100%' : '500'"
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
    .py-1.px-4
      v-btn.w-full(
        color="success",
        rounded="3",
        variant="elevated",
        @click="openDialogAddOrUpdateCustomer()"
      )
        v-icon.mr-1(icon="$mdiPlus", color="white", size="27")
        span.font-extrabold.text-white Agregar nuevo cliente
    perfect-scrollbar.overflow-y-auto(class="h-[calc(100vh-101px)]")
      v-alert.mx-4.my-2(
        v-if="!customers.length && !isLoading",
        variant="tonal",
        density="compact",
        color="error"
      )
        v-icon(start, size="20", icon="$mdiFolderSearch")
        small.text-xs.font-bold No existen datos coincidentes para esta busqueda
      .flex.flex-col.pa-8.items-center(v-if="isLoading")
        small.text-xs.text-primary.font-bold.italic Obteniendo listado de clientes...
        v-progress-linear.mt-2(
          color="primary",
          indeterminate,
          rounded,
          height="5"
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
            small.text-xs {{ i.numero_documento }} - {{ i.sub_sector }}
          template(#append)
            v-btn(
              icon,
              variant="text",
              density="comfortable",
              @click="() => {}"
            )
              v-icon(icon="$mdiDotsVertical", size="25" color="grey")
  v-col(
    cols="12",
    lg="9",
    :md="isMobile ? 12 : 8",
    sm="12",
    :class="{ 'absolute z-10': isMobile }"
  )
    .items-center.flex.justify-center.h-full.bg-primary(v-if="!customer && !isMobile")
      .flex-col.items-center.flex.justify-center.bg-background.pa-4.rounded-full(
        class="h-1/3 w-1/2"
      )
        v-icon.text-slate-300(start, size="90", icon="$mdiAccountArrowLeft")
        small.text-slate-300.text-md.font-semibold.my-2 Seleccione un usuario del panel lateral izquierdo
    .pa-4(v-if="customer")
      v-card.pt-4.px-4.d-flex.justify-center.flex-wrap.elevation-1.mb-4(
        color="primary",
        height="190"
      )
        v-container.flex
          .flex
            v-list-item.px-2
              template(#prepend)
                v-avatar(
                  v-if="customer.logo_corporativo",
                  color="background",
                  density="compact",
                  size="70"
                )
                  v-img(:src="customer.logo_corporativo")
                v-square-avatar-of-text(
                  v-else,
                  :text="customer.razon_social",
                  :avatar-size="70",
                  text-size="2xl",
                  bg-color="white",
                  text-color="primary"
                )
              v-list-item-title
                span.text-lg.font-extrabold {{ customer.razon_social }}
              v-list-item-subtitle
                span.text-md {{ customer.numero_documento }} -
                span.text-md.mx-1 {{ customer.sub_sector || "Seleccione un sector" }}
              template(#append)
                v-btn.mx-4(
                  icon="$mdiPencil",
                  @click="openDialogAddOrUpdateCustomer(customer?.id)"
                )
          v-spacer
          v-row(justify="end", dense="")
            v-col.text-center(
              cols="auto"
            )
              v-card.pa-4(width="112", color="white", @click="openDialogAddOrUpdateCustomerLocation()")
                v-avatar.mb-2(
                  icon="$mdiOfficeBuildingPlus",
                  color="primary",
                  variant="tonal"
                )
                span.text-xs.font-extrabold Ubicaciones
            v-col.text-center(
              cols="auto"
            )
              v-card.pa-4(width="112", color="white", @click="openDialogAddOrUpdateCustomerContact()")
                v-avatar.mb-2(
                  icon="$mdiAccountMultiplePlus",
                  color="primary",
                  variant="tonal"
                )
                span.text-xs.font-extrabold Contactos
        v-tabs.w-full(
          v-model="panelActual",
          align-tabs="end",
          density="compact",
          color="white",
          bg-color="primary"
        )
          v-tab(:value="1")
            span.font-extrabold(class="text-[10px]") Ubicaciones
              span.ml-1(v-if="ubicaciones.length") ({{ ubicaciones.length }})
          v-tab(:value="2")
            span.font-extrabold(class="text-[10px]") Contactos
              span.ml-1(v-if="contactos.length") ({{ contactos.length }})
      perfect-scrollbar(  v-if="panelActual === 1" class="h-[calc(100vh-241px)]")
        .items-center.flex.justify-center.h-full(v-if="!ubicaciones.length")
          .flex-col.items-center.flex.justify-center.bg-background.pa-4.rounded-full(
            class="h-1/3 w-1/2"
          )
            v-icon.text-slate-300(start, size="90", icon="$mdiDomain")
            small.text-slate-300.text-md.font-semibold.my-2 No se encontró ninguna ubicacion registrado para el cliente seleccionado
        v-row(v-else)
          v-col(
            v-for="(l, index) in ubicaciones",
            :key="index",
            cols="12",
            lg="4",
            md="6",
            sm="12"
          )
            v-hover(v-slot="{ isHovering, props }")
              v-card.mx-auto(
                v-bind="props"
                :elevation="isHovering ? 5 : 1",
              )
                v-carousel(
                  height="180",
                  :hide-delimiters="false",
                  hide-delimiter-background
                  :show-arrows="false",
                  :interval="5000",
                  cycle,
                  touch
                  color="primary"
                )
                  v-carousel-item(
                    v-for="(slide, i) in slidesImages(l)",
                    :key="i"
                  )
                    v-card.mx-auto.cursor-pointer(:rounded="0" @click="openDialogAddOrUpdateCustomerLocation(l.id)" )
                      v-img.align-start.text-white.text-end(
                        height="180",
                        :src="slide",
                        gradient="to bottom, rgba(0,0,0,.1), #fff", 
                        cover=""
                      )
                        v-btn.ma-4(v-if="l.id === customer.ubicacionId" color="white")
                          v-icon(start='' icon='$mdiMapMarker')
                          span.font-extrabold(class="text-[10px]")   Fiscal
                v-list-item.py-4(@click="openDialogAddOrUpdateCustomerLocation(l.id)")
                  v-list-item-title
                    strong.font-extrabold.text-xs {{ l.direccion }}
                  v-list-item-subtitle
                    span.font-bold.text-xs {{ l.distrito }} - {{ l.provincia }} - {{ l.departamento }}
                  template(#append="")
                    v-btn(
                      icon,
                      variant="text",
                      density="comfortable",
                      @click="() => {}"
                    )
                      v-icon(icon="$mdiDotsVertical", size="25" color="grey")
      perfect-scrollbar(  v-if="panelActual === 2" class="h-[calc(100vh-241px)]")
        .items-center.flex.justify-center.h-full(v-if="!contactos.length")
          .flex-col.items-center.flex.justify-center.bg-background.pa-4.rounded-full(
            class="h-1/3 w-1/2"
          )
            v-icon.text-slate-300(start, size="90", icon="$mdiAccountMultipleRemoveOutline")
            small.text-slate-300.text-md.font-semibold.my-2 No se encontró ningun contacto  registrado para el cliente seleccionado
        v-row(v-else)
          v-col(
            v-for="(c, index) in contactos",
            :key="index",
            cols="12",
            lg="4",
            md="6",
            sm="12"
          )
            v-hover(v-slot="{ isHovering, props }")
              v-card.mx-auto(
                :elevation="isHovering ? 3 : 1",
                v-bind="props",
                height="228"
                color="white",
                @click="openDialogAddOrUpdateCustomerContact(c.id)"
              )
                .flex.items-center.justify-center.h-full.flex-col
                  .flex.flex-col.items-center
                    v-avatar.mb-2(color='primary' size='60' variant="tonal")
                      span.font-bold NA
                    span.font-extrabold.text-md {{ c.nombre }}
                    span.text-xs.font-bold.text-slate-300 {{ c.cargo }}
                  .flex.mt-6
                    v-btn.mx-2(icon="$mdiPencil", color="primary")
                    v-btn.mx-2(icon="$mdiPhone", color="blue")
                    v-btn.mx-2(
                      color="success"
                      icon
                    )
                      v-icon(icon="$mdiWhatsapp", size="22" color="white")
</template>
<script>
import { computed, defineComponent, ref, onMounted } from "vue";
import { useAppStore, useThemeStore } from "@/store";
import { useDisplay } from "vuetify";
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
    const {
      fetchGetListCustomers,
      fetchGetListCustomerLocations,
      fetchGetListCustomerContacts,
    } = useAppStore();

    const customers = ref([]);
    const customer = ref(null);
    const locationId = ref("");
    const customerIdUpdate = ref("");
    const ubicaciones = ref([]);
    const contactos = ref([]);
    const filteredCustomers = ref([]);
    const isLoading = ref(true);
    const isShowDialogAddOrUpdateCustomer = ref(false);
    const isShowDialogAddOrUpdateCustomerLocation = ref(false);
    const isShowDialogAddOrUpdateCustomerContact = ref(false);
    const searchValue = ref("");
    const panelActual = ref(1);

    onMounted(() => getAllCustomers());

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

    const getAllCustomers = async () => {
      try {
        filteredCustomers.value = [];
        customers.value = [];
        isLoading.value = true;
        customers.value = await fetchGetListCustomers();
        filteredCustomers.value = { ...customers.value };
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

      if (!slides.length) slides.push('/public/assets/placeholder-location-image.jpg')
      return slides;
    };

    return {
      ubicaciones,
      contactos,
      searchValue,
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
