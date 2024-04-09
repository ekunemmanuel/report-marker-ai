<template>
  <div>
    <TopBar name="Forms">
      <UButton @click="goToNewForm" block>
        <div class="flex justify-center items-center gap-[10px]">
          <UIcon class="text-[20px]" name="material-symbols:add-rounded" />
          <span class="truncate"> New Form</span>
        </div>
      </UButton>
    </TopBar>
    <Forms />
  </div>
</template>

<script lang="ts" setup>
import { v4 } from "uuid";
import TopBar from "~/components/TopBar.vue";
const newFormId = computed(() => v4());

const router = useRouter();

function goToNewForm() {
  router.push({
    name: "dashboard-forms-n-newFormId",
    params: { newFormId: newFormId.value },
  });
}
const error = ref<string | null>(null);

onErrorCaptured(() => {
  error.value = "Sorry something went wrong. Please try again later.";
});

definePageMeta({
  layout: "dashbord-layout",
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
