<template lang="pug">
.h-full.w-full
  section.bg-primary.relative(class="py-[120px]")
    .container.mx-auto
      .-mx-4.flex
        .w-full.px-4
          .mx-auto.text-center(class="max-w-[400px]")
            h2.mb-2.font-bold.leading-none.text-white(
              class="text-[50px] sm:text-[80px] md:text-[100px]"
            )
              | 404
            h4.mb-3.font-semibold.leading-tight.text-white.text-2xl
              | ¡Ups! esa pagina no se encuentra
            p.mb-8.text-sm.text-white
              | La página que buscas puede que se elimine
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "ViewAppErrorPage404",
  setup() {
    return {};
  },
});
</script>
