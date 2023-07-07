<template lang="pug">
svg(
  version="1.0",
  xmlns="http://www.w3.org/2000/svg",
  width="224.000000pt",
  height="224.000000pt",
  viewBox="0 0 224.000000 224.000000",
  preserveAspectRatio="xMidYMid meet"
)
  g(
    transform="translate(0.000000,224.000000) scale(0.100000,-0.100000)",
    stroke="none",
    :fill="fillColor"
  )
    path(
      d="M1004 2040 c-90 -20 -172 -53 -256 -101 -46 -26 -56 -37 -53 -53 3\
                    -12 19 -93 35 -181 17 -88 35 -184 41 -213 l11 -53 61 57 c85 79 183 140 280\
                    176 105 39 264 49 370 24 154 -36 317 -127 471 -261 l78 -68 -7 34 c-27 129\
                    -122 296 -230 404 -208 208 -518 299 -801 235z"
    )
    path(
      d="M458 1728 c-113 -104 -208 -266 -248 -422 -77 -305 18 -634 244 -843\
                    65 -60 170 -133 192 -133 10 0 322 238 367 280 4 4 -32 21 -80 38 -195 70\
                    -340 193 -417 355 -24 50 -51 124 -60 164 -31 138 -17 356 33 536 10 37 18 67\
                    17 67 -1 0 -22 -19 -48 -42z"
    )
    path(
      d="M1618 1223 c23 -70 26 -94 26 -228 1 -163 -7 -199 -67 -320 -89 -179\
                    -274 -325 -542 -428 l-89 -35 60 -13 c88 -20 303 -17 387 5 155 41 275 107\
                    385 210 94 89 149 164 197 270 58 126 91 296 79 416 l-6 65 -217 64 c-119 36\
                    -221 66 -228 68 -7 3 -1 -27 15 -74z"
    )
</template>
<script>
import { computed, defineComponent } from "vue";
import { useTheme } from "vuetify/lib/framework.mjs";
export default defineComponent({
  name: "ComponentLogoApplication",
  setup() {
    const { current } = useTheme();

    const fillColor = computed(() => current.value.colors.primary);
    return {
      fillColor,
    };
  },
});
</script>
