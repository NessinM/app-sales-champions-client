<template lang="pug">
v-navigation-drawer.elevation-0.z-10(
  v-if="getSessionUserLogged",
  v-model="getThemePreference.drawer",
  density="compact",
  :temporary="isMobile",
  :rail="getThemePreference.callapsed_menu && !isMobile",
  :expand-on-hover="getThemePreference.hover_collapsed_menu",
  :theme="getThemePreference.semi_dark_menu ? `${getThemePreference.name_current_theme}-dark` : getThemePreference.name_current_theme",
  color="background",
  width="320",
  floating
)
  v-list.bg-primary.elevation-2.pa-0(
    nav,
    sticky,
    color="primary",
    density="compact"
  )
    v-list-item.ma-2.font-bold(:title="enviroments.APP_NAME")
      template(#prepend)
        v-avatar(color="background", size="32")
          v-logo-application
  v-list(nav, color="primary")
    v-list-item.mb-2(
      v-for="(item, index) in getOptionsMenuSideBar",
      :key="index",
      :prepend-icon="item.icon",
      :value="item.value",
      :title="item.title",
      :subtitle="item.subtitle",
      :to="item.to",
      exact
    )
</template>
<script>
import { ref, defineComponent, computed } from "vue";
import { useDisplay } from "vuetify";
import { useAppStore, useAuthStore, useThemeStore } from "@/store";
import { storeToRefs } from "pinia";
import { enviroments } from "@/helps/constants";
import { notify } from "@kyvg/vue3-notification";
import LogoApplication from "@/components/component_logo_application.vue";
export default defineComponent({
  name: "ViewAppNavigationDrawer",
  components: {
    "v-logo-application": LogoApplication,
  },
  setup() {
    const { mobile, name, platform } = useDisplay();

    const storeApp = useAppStore();
    const storeTheme = useThemeStore();
    const storeAuth = useAuthStore();
    const { getOptionsMenuSideBar } = storeToRefs(storeApp);
    const { getThemePreference } = storeToRefs(storeTheme);
    const { getSessionUserLogged } = storeToRefs(storeAuth);
    const { fetchHandleLogout } = storeAuth;

    const drawer = ref(true);
    const temporary = ref(true);
    const rail = ref(true);

    const mobileChangeVisibilityDrawer = () => {
      drawer.value = !drawer.value;
    };
    const changeRailDrawerExpand = () => {
      rail.value = !rail.value;
    };

    const distroySession = async () => {
      try {
        await fetchHandleLogout();
        window.location.reload();
      } catch ({ message }) {
        notify({ type: "error", text: message });
      }
    };

    const isMobile = computed(() => mobile.value);

    return {
      drawer,
      rail,
      isMobile,
      temporary,
      name,
      platform,
      mobileChangeVisibilityDrawer,
      changeRailDrawerExpand,
      getThemePreference,
      enviroments,
      fetchHandleLogout,
      getOptionsMenuSideBar,
      distroySession,
      getSessionUserLogged,
    };
  },
});
</script>
