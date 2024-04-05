<template>
  <Suspense>
    <ClientOnly>
      <SharedForm />

      <template #placeholder>
        <div class="max-w-[600px] mx-auto min-h-screen grid place-items-center">
          <p v-if="error">{{ error }}</p>
          <UIcon name="line-md:loading-twotone-loop" class="size-[50px]" />
        </div>
      </template>

      <template #fallback>
        <div class="max-w-[600px] mx-auto min-h-screen grid place-items-center">
          <p v-if="error">{{ error }}</p>
          <UIcon name="line-md:loading-twotone-loop" class="size-[50px]" />
        </div>
      </template>
    </ClientOnly>

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
</script>

<style scoped></style>
