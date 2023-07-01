import { createApp } from "vue";

//  global styles
import "@/styles/tailwind.scss";
import "mapbox-gl/dist/mapbox-gl.css";

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

import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"
import moment from "moment/dist/moment";
import es from "moment/dist/locale/es";
mapboxgl.accessToken =
  "pk.eyJ1IjoibmFsdmFyYWRvIiwiYSI6ImNsajJ3cHMwOTFndzgzdG51MThqMmRma2wifQ.qWgUxB1Gcm4hplFyfc1DhQ";

moment.locale("es", es);
moment.updateLocale("es", {
  week: {
    dow: 7,
  },
});

createApp(appTemplate)
  .use(vuetify)
  .use(pinia)
  .use(notifications)
  .use(perfectScroll.scroll, perfectScroll.config)
  .use(routes)
  .mount("#app");
