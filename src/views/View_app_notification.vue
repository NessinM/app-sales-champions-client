<template lang="pug">
notifications.pa-1(position="top right")
  template(#body="props")
    v-alert.text-xs.pa-3.font-bold.elevation-5.m-1(
      dark,
      :color="props.item.type",
      :icon="props.item.type === 'success' ? '$mdiCheck' : '$mdiProgressAlert'",
      @click="props.close"
    )
      span.text-white {{ props.item.text }}
</template>
<script>
import { defineComponent } from "vue";
export default defineComponent({
  name: "ViewAppNotification",
  setup() {
    return {};
  },
});
</script>
