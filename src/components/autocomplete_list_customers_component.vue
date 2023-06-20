<template lang="pug">
v-autocomplete.mx-2.text-slate-500.my-1(
  v-model="selected",
  :items="list",
  chips="",
  :loading="isLoading",
  :disabled="isLoading",
  closable-chips="",
  color="primary",
  label="Clientes",
  item-title="razon_social",
  item-value="id",
  multiple="",
  density="compact",
  variant="outlined"
)
  //- @update:modelValue=""
  template(#chip="{ props, item, index }")
    v-chip.mx-1(
      v-bind="props",
      color="primary",
      @click:close="desactiveItemList(item.raw.id, index)"
    )
      small.font-bold {{ item.raw.razon_social }}
  template(#item="{ item, index }")
    v-list-item.py-2(
      :active="list[index].active",
      active-class="bg-primary",
      @click="selectOption(item.raw?.id, index)"
    )
      template(#prepend)
        v-avatar(
          v-if="item?.raw?.logo_corporativo",
          color="background",
          :size="35"
        )
          v-img(:src="item?.raw?.logo_corporativo")
        v-square-avatar-of-text(
          v-else,
          :text="item?.raw?.razon_social",
          text-size="sm",
          :avatar-size="35"
        )
      v-list-item-title
        span.font-extrabold.text-xs {{ item?.raw?.razon_social }}
      v-list-item-subtitle
        span.text-xs {{ item?.raw?.sub_sector }}
</template>

<script>
import { notify } from "@kyvg/vue3-notification";
import { defineComponent, onMounted, ref } from "vue";
import { useAppStore } from "@/store";
import SquareAvatarOfTextComponent from "./square_avatar_of_text_component.vue";
export default defineComponent({
  name: "AutocompleteCustomersComponent",
  components: {
    "v-square-avatar-of-text": SquareAvatarOfTextComponent,
  },
  setup() {
    const isLoading = ref(false);
    const selected = ref([]);
    const list = ref([]);
    const { fetchGetListCustomers } = useAppStore();

    onMounted(async () => {
      try {
        isLoading.value = true;
        const { customers } = await fetchGetListCustomers();
        list.value = customers;
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoading.value = false;
      }
    });

    const selectOption = (id, index) => {
      const indexSelected = selected.value.findIndex((e) => e === id);
      if (indexSelected !== -1) {
        selected.value.splice(indexSelected, 1);
        list.value[index].active = false;
      } else {
        selected.value.push(id);
        list.value[index].active = true;
      }
    };

    const desactiveItemList = (id) => {
      const indexList = list.value.findIndex((e) => e.id === id);
      if (indexList !== -1) {
        list.value[indexList].active = false;
      }
    };

    return {
      isLoading,
      list,
      selected,
      selectOption,
      desactiveItemList,
    };
  },
});
</script>
