<template lang="pug">
section.skewed.shadow-lg(class="shadow-slate-500/50")
.flex.h-full.w-full.justify-center.align-center.flex-col.bg-background
  v-card-title.text-white.z-10
    .flex.flex-col.justify-center.items-center
      strong.font-extrabold.text-3xl {{ enviroments.APP_NAME }}
      span.font-light.text-xs Sistema de gestión y seguimiento comercial
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
    v-card.flex.align-center.justify-center.mb-8(
      height="150",
      color="background",
      elevation="0"
    )
      v-img.align-center(src="/assets/background_login_maps.jpg", cover)
    v-form(@submit.prevent="fetchAuthenticateCredentials()")
      v-text-field.text-slate-500(
        v-model="form.email",
        type="text",
        color="primary",
        label="Nombre de usuario",
        placeholder="Ingrese un valor valido",
        prepend-inner-icon="$mdiAccountOutline",
        density="compact",
        variant="outlined"
      )
      v-text-field.text-slate-500(
        v-model="form.password",
        color="primary",
        label="Contraseña",
        placeholder="Ingrese una contraseña para el usuario",
        :type="!isTypePassword ? 'text' : 'password'",
        prepend-inner-icon="$mdiLockOutline",
        :append-inner-icon="!isTypePassword ? '$mdiEye' : '$mdiEyeOff'",
        persistent-hint,
        density="compact",
        variant="outlined",
        @click:append-inner="isTypePassword = !isTypePassword"
      )
      .my-3
        v-btn(
          color="primary",
          density="default",
          :disabled="!form.password || !form.email",
          block,
          :loading="isLoading",
          type="submit"
        )
          strong.text-xs Validar credenciales
    .flex.justify-center.mt-4
      span.text-xs.cursor-pointer.text-primary.underline-offset-4.font-bold.underline(
        class="hover:opacity-60",
        @click="registerUser()"
      )
        v-icon(icon="$mdiLinkVariant")
        |
        | Si olvidaste tu contraseña o la deseas cambiar
  v-divider
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
import { ref, defineComponent, computed } from "vue";
import { useDisplay } from "vuetify";
import { notify } from "@kyvg/vue3-notification";
import { enviroments } from "@/helps/constants";
import { useAuthStore } from "@/store";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ViewAuthLogin",
  setup() {
    const router = useRouter();
    const { mobile } = useDisplay();
    const { fetchHandleLogin, fetchHandleUserRegister } = useAuthStore();

    const isTypePassword = ref(true);
    const isLoading = ref(false);
    const form = ref({
      email: "psoliz@datacont.com",
      password: "12345678",
    });

    const fetchAuthenticateCredentials = async () => {
      try {
        isLoading.value = true;
        await fetchHandleLogin(form.value);
        window.location.reload();
      } catch ({ message }) {
        notify({ type: "error", text: message });
      } finally {
        isLoading.value = false;
      }
    };

    const registerUser = async () => {
      try {
        // const values = {
        //   nombre: "Pedro Osorio Soliz",
        //   email: "psoliz@datacont.com",
        //   password: "12345678",
        //   passwordConfirm: "12345678",
        //   perfil: "jefe",
        // };
        const values = {
          nombre: "Nesyn Meomer Alvarado Bedoya",
          email: "nalvarado@datacont.com",
          password: "12345678",
          passwordConfirm: "12345678",
          perfil: "jefe",
        };
        await fetchHandleUserRegister(values);
      } catch (error) {
        notify({ type: "error", text: error.message });
      }
    };

    const goToPageForgotPasswordRecovery = () =>
      router.push("/forgot-password-recovery");

    const isMobile = computed(() => mobile.value);

    return {
      isTypePassword,
      fetchAuthenticateCredentials,
      enviroments,
      isMobile,
      form,
      isLoading,
      goToPageForgotPasswordRecovery,
      registerUser,
    };
  },
});
</script>
