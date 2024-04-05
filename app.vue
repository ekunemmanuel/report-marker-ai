<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />

    <VuePreloader
      :background-color="isDark ? '#121212' : '#ffffff'"
      :color="isDark ? '#ffffff' : '#121212'"
      transition-type="fade-up"
      :loading-speed="25"
      :transition-speed="1400"
    >
    </VuePreloader>
  </div>
</template>
<script setup>
import { VuePreloader } from "vue-preloader";
import "../node_modules/vue-preloader/dist/style.css";
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "light" ? "light" : "dark";
  },
});
</script>
