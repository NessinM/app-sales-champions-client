<template lang="pug">
v-app-bar.elevation-2.rounded-0(
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
  v-avatar.mx-4(color="white")
    span.text-sm.font-bold.text-primary NA
</template>
<script>
import { computed, defineComponent } from "vue";
import { storeToRefs } from "pinia";
import { useThemeStore } from "@/store";
import { useDisplay } from "vuetify/lib/framework.mjs";
import { enviroments } from "@/helps/constants";
export default defineComponent({
  name: "ViewAppBarNavigation",
  setup() {
    const store = useThemeStore();
    const { mobile } = useDisplay();
    const { getThemePreference, getOptionsMenuSideBar } = storeToRefs(store);

    const isVisibilityApplicationBar = computed(
      () => getThemePreference.value.navbar_type === "sticky"
    );

    const isMobile = computed(() => mobile.value);

    return {
      getThemePreference,
      isMobile,
      isVisibilityApplicationBar,
      enviroments,
      getOptionsMenuSideBar,
    };
  },
});
</script>
