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
  item-title="razon_social",
  item-value="id",
  multiple,
  density="compact",
  variant="outlined",
  hide-details="auto"
)
  template(#chip="{ item, props }")
    v-chip.mx-1(
      v-bind="props",
      color="primary",
      @click:close="onClickRemoveFromChip(item.raw.id, index)"
    )
      small.font-extrabold {{ item.raw.razon_social }}
  template(#item="{ item, index }")
    v-list-item.py-2(
      :active="list[index].active",
      active-class="bg-primary",
      @click="addOrRemoveItemToSelected(item.raw?.id, index)"
    )
      template(#prepend)
        v-avatar(
          v-if="item?.raw?.logo_corporativo",
          color="background",
          :size="32"
        )
          v-img(:src="item?.raw?.logo_corporativo")
        v-square-avatar-of-text(
          v-else,
          :text="item?.raw?.razon_social",
          text-size="xs",
          :avatar-size="32"
        )
      v-list-item-title
        span.font-extrabold.text-xs {{ item?.raw?.razon_social }}
      v-list-item-subtitle
        span.font-bold.text-xs {{ item?.raw?.numero_documento }} - {{ item?.raw?.sub_sector }}
</template>

<script>
import { notify } from "@kyvg/vue3-notification";
import { defineComponent, onMounted, ref, toRefs } from "vue";
import { useAppStore } from "@/store";
import SquareAvatarOfTextComponent from "./square_avatar_of_text_component.vue";
export default defineComponent({
  name: "AutocompleteCustomersComponent",
  components: {
    "v-square-avatar-of-text": SquareAvatarOfTextComponent,
  },
  props: {
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
      default: "Listado de clientes",
    },
    errorMessage: {
      type: String,
      default: "",
    },
  },
  emits: ["updated"],
  setup(props, { emit }) {
    const { multiple, customerId } = toRefs(props);
    const isLoading = ref(false);
    const selected = ref([]);
    const list = ref([]);
    const { fetchGetListCustomers } = useAppStore();

    onMounted(async () => {
      console.log("Renderizado......");
      try {
        isLoading.value = true;
        list.value = await fetchGetListCustomers();
        if (!customerId.value) return;
        if (multiple.value) {
          alert("todavia falta desarrollar");
        } else {
          console.log("customerId.value", customerId.value);
          selected.value.push(customerId.value);
          // if (customerId.value) {
          //   const positionCustomer = list.value.findIndex(
          //     (e) => e.id === customerId.value
          //   );
          //   console.log("positionCustomer", positionCustomer);
          //   if (positionCustomer === -1) return;
          // }
        }
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoading.value = false;
      }
    });

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
