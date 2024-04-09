<template>
  <div class="flex flex-col h-[calc(100vh-40px)] gap-[10px]">
    <div
      class="grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] grid gap-[10px]"
    >
      <div class="p-4 flex justify-between bg-primary/40 rounded-xl">
        <div class="flex flex-col space-y-4 justify-between">
          <UIcon
            class="text-[60px] bg-primary-400/40 p-[10px] rounded-md"
            name="simple-icons:googleforms"
          />
          <span> Last Form Generated </span>
        </div>
      </div>
      <div class="p-4 flex justify-between bg-primary/40 rounded-xl">
        <div class="flex flex-col space-y-4 justify-between">
          <UIcon
            class="text-[60px] bg-slate-500 p-[10px] rounded-md"
            name="simple-icons:googleforms"
          />
          <span> No of Forms </span>
        </div>
        <span class="text-[50px] font-bold"> 4 </span>
      </div>
      <div class="p-4 flex justify-between bg-primary/40 rounded-xl">
        <div class="flex flex-col space-y-4 justify-between">
          <UIcon
            class="text-[60px] bg-slate-500 p-[10px] rounded-md"
            name="material-symbols:edit-document-rounded"
          />
          <span> No of Reports </span>
        </div>
        <span class="text-[50px] font-bold"> 4 </span>
      </div>

      <div class="p-4 flex justify-between bg-primary/40 rounded-xl">
        <div class="flex flex-col space-y-4 justify-between">
          <UIcon
            class="text-[60px] bg-slate-500 p-[10px] rounded-md"
            name="simple-icons:googleforms"
          />
          <span> No of Forms </span>
        </div>
        <span class="text-[50px] font-bold"> 4 </span>
      </div>
    </div>

    <div class="flex-1">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Bar } from "vue-chartjs";

const formNames = ref(["Form 1", "Form 2", "Form 3", "Form 4", "Form 5"]);
const peoplePerForm = ref([40, 20, 12, 50, 10]);
const chartData = ref({
  labels: formNames.value,
  datasets: [
    {
      label: "Data One",
      backgroundColor: "green",
      data: peoplePerForm.value,
    },
  ],
});
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
});

definePageMeta({
  layout: "dashbord-layout",
  redirect: "/",
});

useHead({
  title: "Dashboard",
  meta: [
    {
      name: "description",
      content: "Dashboard",
    },
  ],
});
const { data } = useAuth();
const user = useUser();
user.value = {
  name: data.value?.user?.name || "",
  email: data.value?.user?.email || "",
  uId: data.value?.user?.uId || "",
};
</script>

<style scoped></style>
