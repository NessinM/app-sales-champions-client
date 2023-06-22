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
            a.inline-block.rounded-lg.border.border-white.px-8.py-3.text-center.text-base.font-semibold.text-white.transition.cursor-pointer(
              class="hover:text-slate-600 hover:bg-white"
            )
              span Ir a casa
    .absolute.top-0.left-0.-z-10.flex.h-full.w-full.items-center.justify-between.space-x-5(
      class="md:space-x-8 lg:space-x-14"
    )
      .h-full.bg-gradient-to-t(class="w-1/3 from-[#FFFFFF14] to-[#C4C4C400]")
      .flex.h-full(class="w-1/3")
        .h-full.bg-gradient-to-b(class="w-1/2 from-[#FFFFFF14] to-[#C4C4C400]")
        .h-full.bg-gradient-to-t(class="w-1/2 from-[#FFFFFF14] to-[#C4C4C400]")
      .h-full.bg-gradient-to-b(class="w-1/3 from-[#FFFFFF14] to-[#C4C4C400]")
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
