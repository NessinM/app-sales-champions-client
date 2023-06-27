<template lang="pug">
v-card.pa-1(
  v-bind="getRootProps()",
  :class="isThemeDark ? 'border-slate-600' : 'border-slate-200'",
  :color="isDragActiveIndicator ? 'primary' : ''"
)
  .flex.flex-col.items-center.justify-center.border-2.border-dashed.rounded-lg.pa-6.ma-2
    input(v-bind="getInputProps()")
    .flex.flex-col.items-center.justify-center
      v-icon.w-10.h-10.mb-3(
        icon="$mdiCloudUploadOutline",
        :class="isDragActiveIndicator ? 'text-primary' : 'text-slate-200'",
        size="70"
      )
      small.text-xs(v-if="isDragActiveIndicator") Suelta el archivo para poder visualizar
      small.text-xs.text-medium(v-else) Solo se admite archivos de tipo imagen
        strong.mx-1.text-primary.text-bold (PNG, JPG, JPEG)
</template>

<script>
import { notify } from "@kyvg/vue3-notification";
import { computed, defineComponent, ref, toRefs, watch } from "vue";
import { useDropzone } from "vue3-dropzone";
import { useTheme } from "vuetify/lib/framework.mjs";
export default defineComponent({
  name: "ComponentDropzoneUploadFile",
  props: {
    accept: {
      type: Array,
      default: () => ["image/png", "image/jpg", "image/jpeg"]
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  emits: ["load-image"],
  setup(props, { emit }) {
    const { accept, multiple } = toRefs(props);
    const theme = useTheme();

    const isDragActiveIndicator = ref(false);
    const files = ref([]);
    const previewImage = ref("");

    const onDrop = (acceptFiles, rejectReasons) => {
      if (rejectReasons.length) {
        const messageErrors = rejectReasons[0].errors
          .map((e) => e.message)
          .toString();
        return notify({ type: "error", text: messageErrors });
      }
      files.value = acceptFiles;
      emit("load-image", [...files.value]);
    };

    const { getRootProps, getInputProps, isDragActive, ...rest } = useDropzone({
      multiple: multiple.value,
      accept: accept.value,
      onDrop,
    });

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

    return {
      isThemeDark,
      getRootProps,
      getInputProps,
      formatBytes,
      previewImage,
      isDragActiveIndicator,
    };
  },
});
</script>
