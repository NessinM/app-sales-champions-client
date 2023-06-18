<template lang="pug">
v-avatar(:color="bgColor", density="compact", :size="avatarSize")
  span.font-extrabold(:class="`text-${textColor} text-${textSize}`") {{ valueAvatar }}
</template>

<script>
import { defineComponent, onMounted, ref } from "vue";
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
  },
  setup(props) {
    const valueAvatar = ref("");
    onMounted(() => (valueAvatar.value = avatarWithInitials(props.text)));

    return {
      valueAvatar,
    };
  },
});
</script>
