<template lang="pug">
v-navigation-drawer.elevation-6(
  key="navigation-theme-settings",
  v-model="is_active_drawer_theme_settings",
  v-click-outside="onClickOutside",
  width="350",
  location="right",
  temporary,
  floating,
  :color="isThemeDark ? 'background' : 'white'",
  :scrim="false"
)
  v-card.pa-1.elevation-4(
    rounded="0",
    flat,
    :height="getThemePreference.height_navbar_app",
    color="primary"
  )
    v-list-item(
      title="PERSONALIZADOR DE TEMA",
      subtitle="Personalizar y previsualizar en tiempo real"
    )
      template(#append)
        v-btn(
          variant="text",
          size="small",
          color="white",
          icon="$mdiClose",
          @click="toggleDrawerPreference()"
        )
  //- perfect-scrollbar( class="h-[calc(100vh-70px)]" )
  perfect-scrollbar
    v-list.pa-2.h-full(:bg-color="isThemeDark ? 'background' : 'white'")
      v-list-item.mb-2
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
          | Transición en paginas
        v-select.my-4.m-1(
          v-model="getThemePreference.router_transition",
          density="compact",
          :class="isThemeDark ? '' : 'text-slate-400'",
          color="primary",
          variant="solo",
          item-title="name",
          item-value="value",
          :items="getTransitionsRouterView",
          label
        )
</template>
<script>
import { defineComponent, computed } from "vue";
import { useThemeStore } from "@/store";
import { storeToRefs } from "pinia";
import { useTheme } from "vuetify/lib/framework.mjs";
export default defineComponent({
  name: "ViewAppPreferences",
  setup() {
    const storeThemeApp = useThemeStore();

    const {
      is_active_drawer_theme_settings,
      getThemePreference,
      geThemesDark,
      geThemesLight,
      getTransitionsRouterView,
    } = storeToRefs(storeThemeApp);

    const theme = useTheme();

    const isThemeDark = computed(() => theme.current.value.dark);

    const toggleDrawerPreference = () =>
      storeThemeApp.setActiveDrawerThemeSettings(
        !is_active_drawer_theme_settings.value
      );
    const setNameCurrentTheme = (name) => {
      theme.global.name.value = name;
    };

    const onClickOutside = (a) => {
      console.log("onClickOutsideonClickOutside", a);
    };

    return {
      toggleDrawerPreference,
      getThemePreference,
      is_active_drawer_theme_settings,
      geThemesDark,
      geThemesLight,
      setNameCurrentTheme,
      getTransitionsRouterView,
      isThemeDark,
      onClickOutside,
    };
  },
});
</script>
