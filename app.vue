<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
  </div>
</template>
<script setup>
const { data } = useAuth();
const user = useUser();
user.value = {
  name: data.value?.user?.name || "",
  email: data.value?.user?.email || "",
  uId: data.value?.user?.uId || "",
};
</script>
