<template>
  <div>
    <TopBar name="Profile" />
    <Stream />
  </div>
</template>

<script setup lang="ts">
import TopBar from '~/components/TopBar.vue';

definePageMeta({
  layout: "dashbord-layout",
  redirect: "/",
});
useHead({
  title: "Profile",
  meta: [
    {
      name: "description",
      content: "Profile",
    },
  ],
});
</script>

<style scoped></style>
