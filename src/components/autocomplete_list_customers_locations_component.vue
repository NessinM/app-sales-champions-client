<template lang="pug">
v-autocomplete.mx-2.text-slate-500(
  v-model="selected",
  :items="list",
  :loading="isLoading",
  :disabled="isLoading",
  :error="!!errorMessage",
  :error-messages="errorMessage ? errorMessage : ''",
  closable-chips,
  chips,
  color="primary",
  :label="label",
  item-title="direccion",
  item-value="id",
  multiple,
  variant="outlined",
  density="compact",
  hide-details="auto"
)
  template(#chip="{ item, props }")
    v-chip(
      v-bind="props",
      rounded
      color="primary",
      @click:close="onClickRemoveFromChip(item.raw.id, index)"
    )
      small.font-extrabold.uppercase {{ item.raw.titulo }}
  template(#item="{ item, index }")
    v-list-item.py-2(
      :active="list[index].active",
      active-class="bg-primary",
      @click="addOrRemoveItemToSelected(item.raw?.id, index)"
    )
      template(#prepend)
        v-square-avatar-of-text(
          :text="item?.raw?.titulo",
          text-size="xs",
          :avatar-size="32"
        )
      v-list-item-title
        span.font-extrabold.text-xs {{ item?.raw?.titulo }}
      v-list-item-subtitle
        small.font-bold {{ item?.raw?.direccion }}
</template>

<script>
import { notify } from "@kyvg/vue3-notification";
import { defineComponent, onMounted, ref, toRefs, watch } from "vue";
import { useAppStore } from "@/store";
import SquareAvatarOfTextComponent from "./square_avatar_of_text_component.vue";
export default defineComponent({
  name: "AutocompleteCustomersComponent",
  components: {
    "v-square-avatar-of-text": SquareAvatarOfTextComponent,
  },
  props: {
    errorMessage: {
      type: String,
      default: "",
    },
    customerLocationId: {
      type: String,
      default: "",
    },
    customerId: {
      type: String,
      default: "",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "Listado de contactos",
    },
  },
  emits: ["updated"],
  setup(props, { emit }) {
    const { multiple, customerId, customerLocationId } = toRefs(props);

    const isLoading = ref(false);
    const selected = ref([]);
    const list = ref([]);
    const { fetchGetListCustomerLocations } = useAppStore();

    onMounted(async () => getLocationsOfCustomer());
    watch(customerId, () => getLocationsOfCustomer());

    const addOrRemoveItemToSelected = (id, index) => {
      const indexInList = list.value.findIndex((e) => e.id === id);
      if (multiple.value) {
        const indexSelected = selected.value.findIndex((e) => e === id);
        if (indexSelected !== -1) {
          selected.value.splice(indexSelected, 1);
          list.value[index].active = false;
        } else {
          selected.value.push(id);
          list.value[indexInList].active = true;
        }
      } else {
        if (!selected.value.length) {
          selected.value.push(id);
          list.value[indexInList].active = true;
        } else {
          const idLastItem = selected.value.pop();
          const indexListLastItem = list.value.findIndex(
            (e) => e.id === idLastItem
          );

          selected.value = [];
          list.value[indexListLastItem].active = false;

          if (idLastItem !== id) {
            selected.value = [id];
            list.value[indexInList].active = true;
          }
        }
      }
      emit("updated", selected.value);
    };

    const onClickRemoveFromChip = (id) => {
      const indexList = list.value.findIndex((e) => e.id === id);
      if (indexList !== -1) {
        list.value[indexList].active = false;
      }
    };

    const getLocationsOfCustomer = async () => {
      if (!customerId.value) return;

      try {
        isLoading.value = true;
        list.value = await fetchGetListCustomerLocations(customerId.value);
        if (!customerLocationId.value) return;

        if (multiple.value) {
          alert("todavia falta desarrollar");
        } else {
          selected.value.push(customerLocationId.value);
        }
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoading.value = false;
      }
    };

    return {
      isLoading,
      list,
      selected,
      addOrRemoveItemToSelected,
      onClickRemoveFromChip,
    };
  },
});
</script>
