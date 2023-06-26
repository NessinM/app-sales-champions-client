<template lang="pug">
section.skewed.shadow-lg(class="shadow-slate-500/50")
.flex.h-screen.w-screen.justify-center.align-center.flex-col
  v-card-title.text-white.z-10
    .flex.flex-col.justify-center.items-center
      strong.font-extrabold.text-2xl {{ enviroments.APP_NAME }}
      span.font-light.text-xs Sistema de gestión y seguimiento comercial {{ isLoading }}
  v-card.pa-6(
    :width="isMobile ? '350' : '400'",
    :loading="isLoading",
    :disabled="isLoading",
    class="!shadow-lg !shadow-slate-200/50"
  )
    template(#loader="{ isActive }")
      v-progress-linear(
        :active="isActive",
        color="primary",
        height="6",
        indeterminate
      )
    v-card.flex.align-center.justify-center.mb-4(
      height="200",
      color="background",
      elevation="0"
    )
      v-img.align-center(
        src="/assets/background_forgot_recovery.png",
        height="250",
        cover
      )
    v-form(ref="formRef", @submit.prevent="authenticateCredentials()")
      v-alert.text-xs.mb-4.font-bold(variant="tonal", color="blue")
        | Ingresa tu correo electrónico y te enviaremos un enlace para que recuperes el acceso a tu cuenta.

      v-text-field.text-slate-500(
        v-model="form.username",
        type="text",
        color="primary",
        label="Nombre de usuario",
        placeholder="Ingrese un valor valido",
        prepend-inner-icon="$mdiAccountOutline",
        density="compact",
        variant="outlined"
      )

      .my-3
        v-btn(
          color="primary",
          density="default",
          :disabled="!form.password || !form.username",
          block,
          :loading="isLoading",
          type="submit"
        )
          strong.text-xs Enviar enlace de inicio de sesión
    .flex.justify-center.mt-4
      span.text-xs.cursor-pointer.text-primary.underline-offset-4.font-bold.underline(
        class="hover:opacity-60",
        @click="goToPageLogin()"
      )
        v-icon(icon="$mdiLinkVariant")
        |
        | Ingresar mis credenciales para iniciar sesión
  blockquote.text-xs.font-medium.italic.text-center.text-slate-500.absolute.bottom-0.right-0.py-4.px-4
    | © {{ new Date().getFullYear() }} -
    span.relative.inline-block.mx-2(
      class="before:block before:absolute before:-inset-1 before:-skew-y-3",
      :class="`before:bg-slate-300`"
    )
      span.relative.text-white.font-bold {{ enviroments.APP_NAME }}
    |
    | . Todos los derechos reservados.
</template>
<script>
import { ref, defineComponent } from "vue";
import { useDisplay } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
import { enviroments } from "@/helps/constants";
import { useAuthStore } from "@/store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ViewAuthLogin",
  setup() {
    const { mobile } = useDisplay();
    const authStore = useAuthStore();
    const router = useRouter();

    const isTypePassword = ref(true);
    const isLoading = ref(false);
    const formRef = ref("");
    const form = ref({
      username: "nalvarado@datacont.com",
      password: "tukutin41",
    });

    const authenticateCredentials = async () => {
      try {
        isLoading.value = true;
        await authStore.fetchHandleLogin(form.value);
      } catch (error) {
        notify({ type: "error", text: error.message });
      } finally {
        isLoading.value = false;
      }
    };

    const goToPageLogin = () => {
      router.push("/login");
    };

    return {
      isTypePassword,
      authenticateCredentials,
      enviroments,
      isMobile: mobile,
      form,
      formRef,
      isLoading,
      goToPageLogin,
    };
  },
});
</script>
