<template>
  <section class="flex justify-between gap-[10px] items-center">
    <div class="flex items-center gap-[10px]">
      <UButton
        v-if="!isLargeScreen"
        @click="isOpen = true"
        variant="soft"
        icon="solar:hamburger-menu-linear"
      >
      </UButton>
      <h1 class="text-[40px] font-bold flex-1">{{ props.name }}</h1>
    </div>
    <div>
      <slot />
    </div>
  </section>

  <USlideover
    side="left"
    v-model="isOpen"
    :ui="{
      width: 'max-w-[250px] ',
    }"
  >
    <Sidenav />
  </USlideover>
</template>

<script setup lang="ts">
const isOpen = ref(false);
const props = defineProps<{
  name: string;
}>();
const isLargeScreen = useMediaQuery("(min-width: 1024px)");

</script>

<style scoped></style>
