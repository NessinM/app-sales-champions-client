import { defineStore } from "pinia";
import themes from "@/plugins/vuetify/themes";

export const useThemeStore = defineStore("theme-store", {
  state: () => ({
    is_active_drawer_theme_settings: false,
    light_themes: themes.light_themes,
    dark_themes: themes.dark_themes,
    settings: {
      drawer: true,
      name_current_theme: themes.default_theme,
      callapsed_menu: true,
      hover_collapsed_menu: false,
      semi_dark_menu: false,
      height_navbar_app: 56,
    },
  }),
  getters: {
    geThemesLight: (state) => state.light_themes,
    geThemesDark: (state) => state.dark_themes,
    getThemePreference: (state) => state.settings,
  },
  actions: {
    setActiveDrawerThemeSettings(active = false) {
      this.is_active_drawer_theme_settings = active;
    },
  },
});
