<template lang="pug">
v-autocomplete.mx-2.text-slate-500(
  v-model="selected",
  :items="list",
  :loading="isLoading",
  :disabled="isLoading",
  :error="!!errorMessage",
  :error-messages="errorMessage ? errorMessage : ''",
  color="primary",
  :label="label",
  item-title="nombre",
  item-value="id",
  multiple,
  variant="outlined",
  density="compact",
  hide-details="auto"
)
  template(#chip="{ item }")
    //- v-chip(
    //-   v-bind="props",
    //-   color="primary",
    //-   @click:close="onClickRemoveFromChip(item.raw.id, index)"
    //- )
    small.font-extrabold.uppercase.text-primary {{ item.raw.nombre }}
  template(#item="{ item, index }")
    v-list-item.py-2(
      :active="list[index].active",
      active-class="bg-primary",
      @click="addOrRemoveItemToSelected(item.raw?.id, index)"
    )
      template(#prepend)
        v-avatar(
          v-if="item?.raw?.imagen_perfil",
          color="background",
          :size="32"
        )
          v-img(:src="item?.raw?.imagen_perfil")
        v-square-avatar-of-text(
          v-else,
          :text="item?.raw?.nombre",
          text-size="xs",
          :avatar-size="32"
        )
      v-list-item-title
        span.font-extrabold.text-xs {{ item?.raw?.nombre }}
      v-list-item-subtitle
        span.font-xs.font-bold {{ item?.raw?.numero_documento }} - {{ item?.raw?.cargo }}
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
    const { multiple, customerId } = toRefs(props);

    const isLoading = ref(false);
    const selected = ref([]);
    const list = ref([]);
    const { fetchGetListCustomerContacts } = useAppStore();

    onMounted(async () => getContactsOfCustomer());
    watch(customerId, () => getContactsOfCustomer());

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

    const getContactsOfCustomer = async () => {
      if (!customerId.value) return;

      try {
        isLoading.value = true;
        const { contacts } = await fetchGetListCustomerContacts(
          customerId.value
        );
        list.value = contacts;
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
