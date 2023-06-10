<template lang="pug">
v-card.flex.items-center.justify-center.w-full.dropzone(
  v-if="state.files.length < 4",
  v-bind="getRootProps()",
  flat,
  color="background ",
  @click="() => {}"
)
  .flex.flex-col.items-center.justify-center.w-full.h-54.border-2.border-dashed.rounded-lg.cursor-pointer(
    :class="isThemeDark ? 'border-slate-600' : 'border-slate-300'"
  )
    input(v-bind="getInputProps()")
    .flex.flex-col.items-center.justify-center.pt-5.pb-6
      v-icon.w-10.h-10.mb-3.text-slate-400(
        icon="$mdiCloudUploadOutline",
        size="60"
      )
      p.mb-2.text-sm.text-slate-400
        span.font-semibold
          | Haga clic para cargar
          | o arrastrar y soltar
      p.text-xs.text-slate-400 SVG, PNG, JPG or GIF (MAX. 800x400px)
v-row.my-4(v-if="state.files.length")
  v-col.relative(
    v-for="(image, index) in state.files",
    :key="index",
    cols="12",
    lg="3",
    md="3",
    sm="12"
  )
    small.absolute.right-3.z-10.pa-1.px-3.bg-white.font-bold.rounded-bl-md.opacity-3.text-xs
      | {{ formatBytes(image.size) }}
    v-hover(v-slot="{ isHovering, props }")
      v-card.h-full.w-full.relative.overflow-hidden(
        v-bind="props",
        :class="{ 'drop-shadow-xl': isHovering }",
        height="135"
      )
        v-img.align-end.text-white(
          height="100",
          :class="{ 'blur-sm': isHovering }",
          lazy-src="../../public/assets/placeholder-sede-image.jpg",
          cover,
          src="https://www.idl.org.pe/wp-content/uploads/2019/10/IMG_34041.png",
          gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
        )
          template(#placeholder)
            .d-flex.align-center.justify-center.fill-height
              v-progress-circular(color="primary", indeterminate)
          v-card-title
            .text-xs.opacity-1 {{ image.name }}
        v-btn.w-full(
          color="error",
          :rounded="0",
          @click="handleClickDeleteFile(index)"
        )
          span.font-bold.text-xs Eliminar

//- .files(v-if="state.files.length")
//-   .file-item(v-for="(file, index) in state.files", :key="index")
//-     span {{ file.name }}
//-     span.delete-file(@click="handleClickDeleteFile(index)") Delete
</template>

<script>
import { computed, defineComponent, reactive, ref, watch } from "vue";
import { useDropzone } from "vue3-dropzone";
import { useTheme } from "vuetify/lib/framework.mjs";
export default defineComponent({
  name: "ComponentDropzoneUploadFile",
  setup() {
    const theme = useTheme();

    const isThemeDark = computed(() => theme.current.value.dark);
    const extencionesImagenes = ref(["image/png", "image/jpg", "image/jpeg"]);

    const state = reactive({
      files: [],
    });

    const { getRootProps, getInputProps, isDragActive, ...rest } = useDropzone({
      onDrop,
    });

    watch(state, () => {
      /* eslint-disable */ /* eslint-disable */ console.log(
        ...oo_oo(
          `6ae6fad4_0`,
          ...oo_oo(`1055e3b0_0`, `3ef70bdb_0`, "state", state)
        )
      );
    });

    watch(isDragActive, () => {
      /* eslint-disable */ /* eslint-disable */ console.log(
        ...oo_oo(
          `6ae6fad4_1`,
          ...oo_oo(
            `1055e3b0_1`,
            `3ef70bdb_1`,
            "isDragActive",
            isDragActive.value,
            rest
          )
        )
      );
    });

    function formatBytes(bytes, decimals = 2) {
      if (!+bytes) return "0 Bytes";

      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    }

    function onDrop(acceptFiles, rejectReasons) {
      /* eslint-disable */ /* eslint-disable */ console.log(
        ...oo_oo(
          `6ae6fad4_2`,
          ...oo_oo(`1055e3b0_2`, `3ef70bdb_2`, acceptFiles)
        )
      );
      /* eslint-disable */ /* eslint-disable */ console.log(
        ...oo_oo(
          `6ae6fad4_3`,
          ...oo_oo(`1055e3b0_3`, `3ef70bdb_3`, rejectReasons)
        )
      );
      state.files = acceptFiles;
    }

    function handleClickDeleteFile(index) {
      state.files.splice(index, 1);
    }

     //const previewFile = (file) => {
     //  var reader = new FileReader();
     //  const dataImage = "";
     //  if (extencionesImagenes.value.includes(file.type)) {
     //    reader.onloadend = () => (dataImage = reader.result);
     //    reader.readAsDataURL(file);
     //  }
 //
     //  return dataImage;
     //};

    return {
      extencionesImagenes,
      isThemeDark,
      state,
      getRootProps,
      getInputProps,
      handleClickDeleteFile,
      formatBytes,
    };
  },
});
</script>
