<template lang="pug">
v-layout.w-screen.h-screen
  v-drawer-preferences-theme
  v-drawer-sidebar-application
  v-navbar-application(v-if="getSessionUserLogged")
  //- v-main.overflow-y-auto(
  //-   :class="[`h-[calc(100vh-${getThemePreference.height_navbar_app}px)]`]"
  //- )
  v-main.overflow-y-auto
    router-view
  v-app-notify
  .absolute.elevation-5.overflow-hidden.right-0(
    v-if="getSessionUserLogged && !isMobile",
    class="top-[40%] !rounded-l-lg"
  )
    v-btn(icon="$mdiCogOutline", :rounded="0", @click="togglePreference")
</template>

<script>
import { computed, defineComponent } from "vue";
import { storeToRefs } from "pinia";
import { useThemeStore, useAuthStore } from "@/store";
import { useDisplay } from "vuetify/lib/framework.mjs";
import navigationDrawer from "@/views/View_app_navigation_drawer.vue";
import preferencesApplicationDrawer from "@/views/View_app_preferences_drawer.vue";
import navigationApplicationBar from "@/views/View_app_bar_navigation.vue";
import notificationApplication from "@/views/View_app_notification.vue";
export default defineComponent({
  name: "App",
  components: {
    "v-drawer-sidebar-application": navigationDrawer,
    "v-drawer-preferences-theme": preferencesApplicationDrawer,
    "v-navbar-application": navigationApplicationBar,
    "v-app-notify": notificationApplication,
  },
  setup() {
    const appThemeStore = useThemeStore();
    const { mobile } = useDisplay();

    const authStore = useAuthStore();
    const { is_active_drawer_theme_settings, getThemePreference } =
      storeToRefs(appThemeStore);
    const { getSessionUserLogged } = storeToRefs(authStore);

    const togglePreference = () =>
      appThemeStore.setActiveDrawerThemeSettings(
        !is_active_drawer_theme_settings.value
      );

    const isMobile = computed(() => mobile.value);

    return {
      isMobile,
      togglePreference,
      getThemePreference,
      getSessionUserLogged,
    };
  },
});
</script>

<style lang="scss">
@import "@/plugins/vuetify/sass/_overview.scss";
@import "@/styles/main.scss";
</style>
