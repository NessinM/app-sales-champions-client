import { createApp } from "vue";

//  global styles
import "animate.css";
import "@/styles/tailwind.scss";

// template app
import appTemplate from "@/App.vue";

// routes
import routes from "@/router";

// dependencias
import notifications from "@kyvg/vue3-notification";

// plugins
import vuetify from "@/plugins/vuetify";
import pinia from "@/plugins/pinia";
import perfectScroll from "@/plugins/scroll";

createApp(appTemplate)
  .use(vuetify)
  .use(pinia)
  .use(notifications)
  .use(perfectScroll.scroll, perfectScroll.config)
  .use(routes)
  .mount("#app");
