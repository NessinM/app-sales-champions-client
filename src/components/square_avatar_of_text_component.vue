<template lang="pug">
v-avatar(
  :color="bgColor",
  density="compact",
  :variant="variant",
  :size="avatarSize"
)
  span.font-extrabold(:class="`text-${textColor} text-${textSize}`") {{ valueAvatar }}
</template>

<script>
import { defineComponent, onMounted, ref, toRefs, watch } from "vue";
import { avatarWithInitials } from "@/helps/converts";
export default defineComponent({
  name: "SquareAvatarOfTextComponent",
  props: {
    text: {
      type: String,
      default: "ND",
    },
    avatarSize: {
      type: Number,
      default: 32,
    },
    textSize: {
      type: String,
      default: "xs",
    },
    textColor: {
      type: String,
      default: "white",
    },
    bgColor: {
      type: String,
      default: "primary",
    },
    variant: {
      type: String,
      default: "elevated",
      validator(value) {
        return [
          "text",
          "flat",
          "elevated",
          "tonal",
          "outlined",
          "plain",
        ].includes(value);
      },
    },
  },
  setup(props) {
    const { text } = toRefs(props);
    const valueAvatar = ref("");

    onMounted(() => (valueAvatar.value = avatarWithInitials(text.value)));

    watch(text, () => {
      console.log("cambio", props.text);
      valueAvatar.value = avatarWithInitials(text.value);
    });

    return {
      valueAvatar,
    };
  },
});
</script>
