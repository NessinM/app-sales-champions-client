import colors from "vuetify/lib/util/colors";

// "background":"#161122",
// "surface":"#241d34",
// "surface-variant":"#BDBDBD",
// "on-surface-variant":"#424242",
// "primary":"#FFC400",
// "primary-darken-1":"#3700B3",
// "secondary":"#03DAC5",
// "secondary-darken-1":"#03DAC5",
// "error":"#ff1744",
// "info":"#2979ff",
// "success":"#00e676",
// "warning":"#ffc400",
// "on-background":"#fff",
// "on-surface":"#fff",
// "on-primary":"#fff",
// "on-primary-darken-1":"#fff",
// "on-secondary":"#000",
// "on-secondary-darken-1":"#000",
// "on-error":"#fff",
// "on-info":"#fff",
// "on-success":"#fff",
// "on-warning":"#000"

const themes_light = {
  track: {
    dark: false,
    colors: {
      background: "#f8fafc",
      primary: "#9155fd",
      surface: "#fff",
      "on-surface": "#2d4258",
      info: colors.blue.accent3,
      success: "#00e676",
      warning: colors.amber.accent3,
      error: colors.red.accent3,
    },
  },
  datacont: {
    dark: false,
    colors: {
      primary: "#d8060d",
      // secondary : '#fff1f2',
      secondary: "#d8060d",
      background: "#f8fafc",
      surface: "#fff",
      "on-surface": "#2d4258",
      info: colors.blue.accent3,
      success: "#00e676",
      warning: colors.amber.accent3,
      error: colors.red.accent3,
    },
  },
  reprodata: {
    dark: false,
    colors: {
      primary: "#e6007e",
      background: "#f8fafc",
      surface: "#fff",
      "on-surface": "#2d4258",
      info: colors.blue.accent3,
      success: "#00e676",
      warning: colors.amber.accent3,
      error: colors.red.accent3,
    },
  },
  yellow: {
    dark: false,
    colors: {
      primary: "#FFC400",
      background: "#f8fafc",
      surface: "#fff",
      "on-surface": "#2d4258",
      info: colors.blue.accent3,
      success: "#00e676",
      warning: colors.amber.accent3,
      error: colors.red.accent3,
      "on-primary": "#fff",
    },
  },
  green: {
    dark: false,
    colors: {
      primary: "#00E676",
      background: "#f8fafc",
      surface: "#fff",
      "on-surface": "#2d4258",
      info: colors.blue.accent3,
      success: "#00e676",
      warning: colors.amber.accent3,
      error: colors.red.accent3,
      "on-primary": "#fff",
    },
  },
  blue: {
    dark: false,
    colors: {
      primary: "#00B0FF",
      background: "#f8fafc",
      surface: "#fff",
      "on-surface": "#2d4258",
      info: colors.blue.accent3,
      success: "#00e676",
      warning: colors.amber.accent3,
      error: colors.red.accent3,
    },
  },
};

const themes_dark = {
  "track-dark": {
    dark: true,
    colors: {
      background: "#161122",
      primary: "#9155fd",
      surface: "#241d34",
      "on-surface": "#fff",
      info: colors.blue.accent3,
      success: "#00e676",
      warning: colors.amber.accent3,
      error: colors.red.accent3,
    },
  },
  "datacont-dark": {
    dark: true,
    colors: {
      background: "#161122",
      primary: "#d8060d",
      surface: "#241d34",
      "on-surface": "#fff",
      info: colors.blue.accent3,
      success: "#00e676",
      warning: colors.amber.accent3,
      error: colors.red.accent3,
    },
  },
  "reprodata-dark": {
    dark: true,
    colors: {
      background: "#161122",
      primary: "#e6007e",
      surface: "#241d34",
      "on-surface": "#fff",
      info: colors.blue.accent3,
      success: "#00e676",
      warning: colors.amber.accent3,
      error: colors.red.accent3,
    },
  },
  "yellow-dark": {
    dark: true,
    colors: {
      background: "#161122",
      primary: "#FFC400",
      surface: "#241d34",
      "on-surface": "#fff",
      info: colors.blue.accent3,
      success: "#00e676",
      warning: colors.amber.accent3,
      error: colors.red.accent3,
      "on-primary": "#fff",
    },
  },
  "green-dark": {
    dark: true,
    colors: {
      background: "#161122",
      primary: "#00E676",
      surface: "#241d34",
      "on-surface": "#fff",
      info: colors.blue.accent3,
      success: "#00e676",
      warning: colors.amber.accent3,
      error: colors.red.accent3,
      "on-primary": "#fff",
    },
  },
  "blue-dark": {
    dark: true,
    colors: {
      background: "#161122",
      primary: "#00B0FF",
      surface: "#241d34",
      "on-surface": "#fff",
      info: colors.blue.accent3,
      success: "#00e676",
      warning: colors.amber.accent3,
      error: colors.red.accent3,
    },
  },
};

const light_themes = Object.keys(themes_light).map((e) => {
  return { ...themes_light[e]?.colors, name: e };
});
const dark_themes = Object.keys(themes_dark).map((e) => {
  return { ...themes_dark[e]?.colors, name: e };
});

const default_theme = "datacont";

export default {
  themes_light,
  themes_dark,
  light_themes,
  dark_themes,
  default_theme,
};
