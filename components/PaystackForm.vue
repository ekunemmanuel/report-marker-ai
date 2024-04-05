<template>
  <UButton @click="payWithPaystack" :loading="loading"> Pay </UButton>
</template>

<script lang="ts" setup>
const user = useUser();
const { makePayment } = useApiCalls();
const loading = ref(false);

async function payWithPaystack() {
  try {
    loading.value = true;
  if (!user.value) return;
    await makePayment(user.value.email, 3000);
  } catch (error) {
    console.log(error);
  } finally {
    loading.value = false;
  }
}

useHead({});
</script>

<style scoped></style>
