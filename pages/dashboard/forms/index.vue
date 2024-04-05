<template>
  <div class="flex justify-between gap-[10px] items-center">
    <h1 class="text-[40px] font-bold flex-1">Forms</h1>
    <div>
      <UButton @click="goToNewForm" block>
        <div class="flex justify-center items-center gap-[10px]">
          <UIcon class="text-[20px]" name="material-symbols:add-rounded" />
          <span class="truncate"> New Form</span>
        </div>
      </UButton>
    </div>
  </div>
  <ClientOnly>
    <Forms />

    <template #fallback>
      <div class="">
        <p v-if="error">{{ error }}</p>
        <USkeleton class="h-[104px] w-[100%]" />
      </div>
    </template>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { v4 } from "uuid";
const newFormId = computed(() => v4());

const router = useRouter();

function goToNewForm() {
  router.push({
    name: "dashboard-forms-n-newFormId",
    params: { newFormId: newFormId.value },
  });
}

definePageMeta({
  layout: "dashbord-layout",
     
});

const error = ref<string | null>(null);

onErrorCaptured(() => {
  error.value = "Sorry something went wrong. Please try again later.";
});

useHead({
  title: "My Forms",
  meta: [
    {
      name: "description",
      content: "My Forms",
    },
  ],
});
</script>

<style scoped></style>
