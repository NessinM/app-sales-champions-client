<template lang="pug">
.relative.h-54.mx-2
  small.absolute.right-0.z-10.pa-1.px-3.bg-white.font-bold.rounded-bl-md.text-xs(
    v-if="sizeFile"
  )
    | {{ sizeFile }}
  v-hover(v-slot="{ isHovering, props }")
    v-card.w-full.relative.overflow-hidden(
      v-bind="props",
      :class="{ 'elevation-5': isHovering }"
    )
      v-img.align-end.text-white(
        height="128",
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
          //- .text-xs.opacity-1 {{ file.name }}
          .text-xs.opacity-1 sadsadsa
      slot
      //- v-btn.w-full(
      //-   color="error",
      //-   :rounded="0",
      //-   @click="handleClickDeleteFile()"
      //- )
      //-   span.font-bold.text-xs Eliminar
</template>
<script>
import { computed, defineComponent, onMounted, ref, toRefs } from "vue";
import { useTheme } from "vuetify/lib/framework.mjs";
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
    const extencionesImagenes = ref(["image/png", "image/jpg", "image/jpeg"]);

    onMounted(() => {
      if (urlImage.value) {
        file.value = urlImage.value;
        return;
      }

      if (fileBuffer.value) {
        const reader = new FileReader();
        if (extencionesImagenes.value.includes(fileBuffer.value.type)) {
          reader.onload = (e) => (file.value = e.target.result);
          reader.readAsDataURL(fileBuffer.value);
        }
        sizeFile.value = formatBytes(fileBuffer.value.size);
      }
    });

    const formatBytes = (bytes, decimals = 2) => {
      if (!+bytes) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const isThemeDark = computed(() => theme.current.value.dark);

    return {
      isThemeDark,
      formatBytes,
      file,
      sizeFile,
    };
  },
});
</script>
