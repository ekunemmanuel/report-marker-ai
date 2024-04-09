<template>
  <ClientOnly>
    <div
      class="grid h-screen duration-200"
      :class="[isLargeScreen ? 'grid-cols-[250px,1fr]' : ' grid-cols-1']"
    >
      <Sidenav v-if="isLargeScreen" />
      <div class="p-[10px] h-screen overflow-y-auto">
        <slot />
      </div>
    </div>
  </ClientOnly>
</template>

<script setup>
const isLargeScreen = useMediaQuery("(min-width: 1024px)");
console.log();
</script>
