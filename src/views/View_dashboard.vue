<template lang="pug">
.h-full.w-full
  section.skewed.shadow-lg(class="shadow-slate-500/50")
    div(class="py-[120px]")
      .mx-auto.text-center
        .flex.justify-center.items-center
          h2.mb-2.font-extrabold.leading-none.text-white.flex(
            class="text-[40px] sm:text-[70px] md:text-[90px]"
          )
            | FLYC
          .w-20.h-20.rounded-full.overflow-hidden.bg-white.flex.items-center.justify-center
            v-icon(icon="$mdiMapMarker", color="primary", size="50")
          h2.mb-2.font-extrabold.leading-none.text-white.flex(
            class="text-[40px] sm:text-[70px] md:text-[90px]"
          )
            | M
        h4.mb-3.font-light.leading-tight.text-white.text-md.italic
          | Sistema comercial para mejorar las ventas.
        //- p.mb-8.text-sm.text-white
        //-   | La página que buscas puede que se elimine
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "ViewDashboard",
  setup() {
    return {};
  },
});
</script>
