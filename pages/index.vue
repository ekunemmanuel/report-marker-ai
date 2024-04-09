<script setup lang="ts">
const { data } = useAuth();
const user = useUser();
user.value = {
  name: data.value?.user?.name || "",
  email: data.value?.user?.email || "",
  uId: data.value?.user?.uId || "",
};
definePageMeta({
  auth: false,
});
useHead({
  title: "Report-Lysis",
  meta: [
    {
      name: "description",
      content: "Home page",
    },
  ],
});
</script>

<template>
  <div class="max-w-[1000px] mx-auto px-[10px]">
  </div>
</template>

<style scoped></style>
