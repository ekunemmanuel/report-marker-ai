<template>
  <Suspense>
    <SharedForm />
    <template #fallback>
      <div class="max-w-[600px] mx-auto space-y-[30px]">
        <p v-if="error">{{ error }}</p>
        <UIcon name="line-md:loading-twotone-loop" class="size-[50px]" />
      </div>
    </template>
  </Suspense>
</template>

<script lang="ts" setup>
const { notification } = useNotification();

const error = ref<string | null>(null);

onErrorCaptured(() => {
  notification(
    "Error",
    "Sorry something went wrong. Please try again later.",
    "error"
  );
  error.value = "Sorry something went wrong. Please try again later.";
});

definePageMeta({
  auth: false,
  layout: false,
  redirect: "/",
});
</script>

<style scoped></style>
