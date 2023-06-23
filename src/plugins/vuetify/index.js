import "vuetify/styles";

import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import * as components from "vuetify/components";
import * as labsComponents from "vuetify/labs/components";
import * as directives from "vuetify/directives";
import { md3 } from "vuetify/blueprints";
import { es } from "vuetify/locale";
import themes from "./themes.js";
import icons from "./icons.js";

const vuetify = createVuetify({
  blueprint: md3, // obtiene los estilos de google Material 3
  components: {
    ...components,
    ...labsComponents,
  },
  directives,
  theme: {
    options: { customProperties: true },
    defaultTheme: themes.default_theme,
    themes: { ...themes.themes_light, ...themes.themes_dark },
  },
  icons: {
    defaultSet: "mdi",
    aliases: {
      ...aliases,
      ...icons,
    },
    sets: {
      mdi,
    },
  },
  locale: {
    locale: "es",
    fallback: "es",
    messages: { es },
  },
});

export default vuetify;
