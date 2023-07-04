<template lang="pug">
v-navigation-drawer.elevation-6(
  key="navigation-theme-settings",
  v-model="is_active_drawer_theme_settings",
  width="400",
  location="right",
  temporary,
  floating,
  :color="isThemeDark ? 'background' : 'white'"
)
  //- :scrim="false"
  v-card.pa-1.elevation-4.mb-2(
    rounded="0",
    :height="getThemePreference.height_navbar_app",
    color="primary"
  )
    v-list-item
      template(#append)
        v-btn(
          variant="text",
          size="small",
          color="white",
          icon="$mdiClose",
          @click="toggleDrawerPreference()"
        )
      v-list-item-title
        span.font-bold.text-lg Preferencias

  v-list.pa-2(:bg-color="isThemeDark ? 'background' : 'white'")
    v-list-item
      v-list-item-title
        | Temas
      v-item-group.p-1.mt-2.flex(
        v-model="getThemePreference.name_current_theme",
        mandatory,
        @update:model-value="setNameCurrentTheme"
      )
        v-item(
          v-for="(p, index) in geThemesLight",
          v-slot="{ isSelected, toggle }",
          :key="index",
          :value="p.name"
        )
          v-card.mx-1.items-center.justify-center(
            class="!flex !rounded-[4rem]",
            :color="p.primary",
            height="40  ",
            width="40 ",
            @click="toggle"
          )
            v-icon(
              v-if="isSelected",
              color="white",
              size="20",
              icon="$mdiCheck"
            )
      v-item-group.p-1.flex(
        v-model="getThemePreference.name_current_theme",
        mandatory,
        @update:model-value="setNameCurrentTheme"
      )
        v-item(
          v-for="(p, index) in geThemesDark",
          v-slot="{ isSelected, toggle }",
          :key="index",
          :value="p.name"
        )
          v-card.mx-1(
            class="!flex",
            :color="p.primary",
            height="40",
            width="40",
            @click="toggle"
          )
            v-img.flex.items-center.justify-center(
              cover,
              gradient="to bottom, #312d4b00, #312d4b",
              height="40",
              width="40"
            )
              v-icon(
                v-if="isSelected",
                color="white",
                size="20",
                icon="$mdiCheck"
              )
    v-list-item
      v-list-item-title
        | Menu colapsado
      template(#append)
        v-switch(
          v-model="getThemePreference.callapsed_menu",
          color="primary",
          hide-details,
          density="comfortable",
          :class="isThemeDark ? '' : 'text-slate-400'"
        )
    v-list-item
      v-list-item-title
        | Expandir menu colapsado
      template(#append)
        v-switch(
          v-model="getThemePreference.hover_collapsed_menu",
          color="primary",
          hide-details,
          density="comfortable",
          :class="isThemeDark ? '' : 'text-slate-400'"
        )
    v-list-item
      v-list-item-title
        | Menu semioscuro
      template(#append)
        v-switch(
          v-model="getThemePreference.semi_dark_menu",
          color="primary",
          hide-details,
          density="comfortable",
          :class="isThemeDark ? '' : 'text-slate-400'"
        )
    v-list-item
      v-list-item-title
        | Sabados y domingos en la agenda
      template(#append)
        v-switch(
          v-model="showSundayAndSaturday",
          color="primary",
          hide-details,
          density="comfortable",
          :class="isThemeDark ? '' : 'text-slate-400'",
          @update:model-value="setDatesByTypeCalendary"
        )
</template>
<script>
import { defineComponent, computed } from "vue";
import { useThemeStore, useCalendarStore } from "@/store";
import { storeToRefs } from "pinia";
import { useTheme } from "vuetify/lib/framework.mjs";
export default defineComponent({
  name: "ViewAppPreferences",
  setup() {
    const storeThemeApp = useThemeStore();
    const storeCalendary = useCalendarStore();
    const { setDatesByTypeCalendary } = storeCalendary;

    const {
      is_active_drawer_theme_settings,
      getThemePreference,
      geThemesDark,
      geThemesLight,
    } = storeToRefs(storeThemeApp);
    const { showSundayAndSaturday } = storeToRefs(storeCalendary);

    const theme = useTheme();

    const isThemeDark = computed(() => theme.current.value.dark);

    const toggleDrawerPreference = () =>
      storeThemeApp.setActiveDrawerThemeSettings(
        !is_active_drawer_theme_settings.value
      );
    const setNameCurrentTheme = (name) => {
      theme.global.name.value = name;
    };
    return {
      toggleDrawerPreference,
      getThemePreference,
      is_active_drawer_theme_settings,
      geThemesDark,
      geThemesLight,
      setNameCurrentTheme,
      isThemeDark,
      showSundayAndSaturday,
      setDatesByTypeCalendary,
    };
  },
});
</script>
