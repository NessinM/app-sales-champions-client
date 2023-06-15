<template lang="pug">
//- .relative.h-54.mx-2(v-if="file")
//-   small.absolute.right-0.z-10.pa-1.px-3.bg-white.font-bold.rounded-bl-md.text-xs
//-     | {{ formatBytes(file.size) }}
//-   v-hover(v-slot="{ isHovering, props }")
//-     v-card.w-full.relative.overflow-hidden(
//-       v-bind="props",
//-       :class="{ 'elevation-5': isHovering }"
//-     )
//-       v-img.align-end.text-white(
//-         height="128",
//-         :class="{ 'blur-sm': isHovering }",
//-         lazy-src="/assets/placeholder-location-image.jpg",
//-         cover,
//-         :src="previewImage",
//-         gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
//-       )
//-         template(#placeholder)
//-           .d-flex.align-center.justify-center.fill-height
//-             v-progress-circular(color="primary", indeterminate)
//-         v-card-title
//-           .text-xs.opacity-1 {{ file.name }}
//-       v-btn.w-full(
//-         color="error",
//-         :rounded="0",
//-         @click="handleClickDeleteFile()"
//-       )
//-         span.font-bold.text-xs Eliminar
div(v-if="file")
  v-square-preview-customer-location(:file-buffer="file")
    v-btn.w-full(
      color="error",
      :rounded="0",
      @click="deleteFileLocationImage()"
    )
      span.font-bold.text-xs Eliminar
v-card.mx-2(
  v-else,
  v-bind="getRootProps()",
  :class="isThemeDark ? 'border-slate-600' : 'border-slate-200'",
  :color="isDragActiveIndicator ? 'background' : ''"
)
  .flex.flex-col.items-center.justify-center.border-2.border-dashed.rounded-lg.pa-2.ma-2
    input(v-bind="getInputProps()")
    .flex.flex-col.items-center.justify-center
      v-icon.w-10.h-10.mb-3(
        icon="$mdiCloudUploadOutline",
        :class="isDragActiveIndicator ? 'text-primary' : 'text-slate-300'",
        :size="isDragActiveIndicator ? 82 : 50"
      )
      small.text-xs.text-slate-400(v-if="isDragActiveIndicator") Suelta el archivo para visualizar
      small.text-xs.text-slate-400(v-else) Solo se admite archivos de tipo imagen
        strong.mx-1 (PNG, JPG, JPEG)
</template>

<script>
import { notify } from "@kyvg/vue3-notification";
import { computed, defineComponent, ref, toRefs, watch } from "vue";
import { useDropzone } from "vue3-dropzone";
import { useTheme } from "vuetify/lib/framework.mjs";
import SquarePreviewImageCustomerLocation from "./square_preview_image_customer_location_component.vue";
export default defineComponent({
  name: "ComponentDropzoneUploadFile",
  components: {
    "v-square-preview-customer-location": SquarePreviewImageCustomerLocation,
  },
  props: {
    numberImage: {
      type: Number,
      default: 0,
    },
  },
  emits: ["load-image", "delete-image"],
  setup(props, { emit }) {
    const { numberImage } = toRefs(props);
    const theme = useTheme();

    const extencionesImagenes = ref(["image/png", "image/jpg", "image/jpeg"]);
    const isDragActiveIndicator = ref(false);
    const file = ref("");
    const previewImage = ref("");

    const onDrop = (acceptFiles, rejectReasons) => {
      if (rejectReasons.length) {
        const messageErrors = rejectReasons[0].errors
          .map((e) => e.message)
          .toString();
        return notify({ type: "error", text: messageErrors });
      }
      file.value = acceptFiles[0];
      previewFile();
      emit("load-image", { numberImage: numberImage.value, file: file.value });
    };

    const { getRootProps, getInputProps, isDragActive, ...rest } = useDropzone({
      multiple: false,
      accept: extencionesImagenes.value,
      onDrop,
    });

    // watch(file.value, () => {
    // });

    watch(isDragActive, () => {
      isDragActiveIndicator.value = isDragActive.value;
      console.log("rest", rest);
    });

    const isThemeDark = computed(() => theme.current.value.dark);
    const formatBytes = (bytes, decimals = 2) => {
      if (!+bytes) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const deleteFileLocationImage = () => {
      file.value = null;
      emit("delete-image", numberImage.value);
    };

    const previewFile = () => {
      var reader = new FileReader();
      if (extencionesImagenes.value.includes(file.value.type)) {
        reader.onload = (e) => (previewImage.value = e.target.result);
        reader.readAsDataURL(file.value);
      }
    };

    return {
      extencionesImagenes,
      isThemeDark,
      getRootProps,
      getInputProps,
      deleteFileLocationImage,
      formatBytes,
      file,
      previewImage,
      isDragActiveIndicator,
    };
  },
});
</script>
