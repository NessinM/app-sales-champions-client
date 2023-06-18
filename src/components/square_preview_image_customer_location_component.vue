<template lang="pug">
.relative.h-54.mx-2
  small.absolute.right-0.z-10.pa-1.px-3.bg-white.font-bold.rounded-bl-md.text-xs(
    v-if="sizeFile"
  )
    | {{ sizeFile }}
  v-hover(v-slot="{ isHovering, props }")
    v-card.w-full.relative.overflow-hidden(
      v-bind="props",
      :class="{ 'elevation-2': isHovering }"
    )
      v-img.align-end.text-white(
        height="126",
        :class="{ 'blur-sm': isHovering }",
        lazy-src="/assets/placeholder-location-image.jpg",
        cover,
        :src="file",
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      )
        template(#placeholder)
          .d-flex.align-center.justify-center.fill-height
            v-progress-circular(color="primary", indeterminate)
        v-card-title
          .text-xs.opacity-1 {{ fileName }}
      slot
</template>
<script>
import { computed, defineComponent, onMounted, ref, toRefs } from "vue";
import { useTheme } from "vuetify/lib/framework.mjs";
import { formatSizeBytes } from "@/helps/converts";
export default defineComponent({
  name: "ComponentLogoApplication",
  props: {
    urlImage: {
      type: String,
    },
    fileBuffer: {
      type: File,
      default: () => null,
    },
  },
  setup(props) {
    const { urlImage, fileBuffer } = toRefs(props);
    const theme = useTheme();

    const file = ref();
    const sizeFile = ref("");
    const fileName = ref("");
    const extencionesImagenes = ref(["image/png", "image/jpg", "image/jpeg"]);

    onMounted(() => {
      if (urlImage.value) {
        file.value = urlImage.value;
        fileName.value = urlImage.value.substring(
          urlImage.value.lastIndexOf("/") + 1
        );
        return;
      }

      if (fileBuffer.value) {
        const reader = new FileReader();
        if (extencionesImagenes.value.includes(fileBuffer.value.type)) {
          reader.onload = (e) => (file.value = e.target.result);
          reader.readAsDataURL(fileBuffer.value);
        }
        sizeFile.value = formatSizeBytes(fileBuffer.value.size);
        fileName.value = fileBuffer.value.name;
      }
    });

    const isThemeDark = computed(() => theme.current.value.dark);

    return {
      isThemeDark,
      file,
      sizeFile,
      fileName,
    };
  },
});
</script>
