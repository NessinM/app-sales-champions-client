import PerfectScrollbar from "vue3-perfect-scrollbar";
import "vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css";

export default {
  scroll: PerfectScrollbar,
  config: {
    watchOptions: true,
    options: {
      suppressScrollX: true,
    },
  },
};
