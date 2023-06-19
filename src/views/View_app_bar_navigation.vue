<template lang="pug">
v-app-bar.elevation-2.rounded-0(
  v-if="getSessionUserLogged && isMobile",
  color="primary",
  :height="getThemePreference.height_navbar_app",
  rounded="0"
)
  template(v-if="isMobile", #prepend)
    v-app-bar-nav-icon(
      color="white",
      @click="getThemePreference.drawer = !getThemePreference.drawer"
    )
  v-app-bar-title(v-if="getThemePreference.callapsed_menu")
    strong.text-sm.font-bold {{ enviroments.APP_NAME }}
  v-spacer
  v-menu(rounded)
    template(#activator="{ props }")
      v-avatar.mx-4.cursor-pointer(color="white", v-bind="props")
        span.text-sm.font-bold.text-primary NA
    v-card.elevation-2
      v-list.pa-0.ma-0(density="compact")
        v-list-item(@click="() => {}")
          v-list-item-title
            v-icon.mr-2(icon="$mdiImageSyncOutline")
            span.text-md.font-bold Preferencias
        v-list-item(@click="distroySession()")
          v-list-item-title.text-error
            v-icon.mr-2(icon="$mdiTrashCanOutline")
            span.text-md.font-bold Cerrar sesión
</template>
<script>
import { computed, defineComponent } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore, useThemeStore } from "@/store";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { enviroments } from "@/helps/constants";
export default defineComponent({
  name: "ViewAppBarNavigation",
  setup() {
    const storeTheme = useThemeStore();
    const authStore = useAuthStore();
    const { mobile } = useDisplay();
    const { getThemePreference, getOptionsMenuSideBar } =
      storeToRefs(storeTheme);
    const { getSessionUserLogged } = storeToRefs(authStore);

    const isMobile = computed(() => mobile.value);

    return {
      getThemePreference,
      isMobile,
      enviroments,
      getOptionsMenuSideBar,
      getSessionUserLogged,
    };
  },
});
</script>
