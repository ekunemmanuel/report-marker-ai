<template>
  <div v-if="form">
    <Head>
      <title>{{ form.title }}</title>
      <meta name="description" content="{{ form.description }}" />
    </Head>
    <UTabs @change="onChange" :items="items" class="w-full">
      <template #form="{ item }">
        <MyForm :form="form" :questions="questions" />
      </template>

      <template #response="{ item }">
        <Suspense>
          <Responses v-if="user" :uId="user.uId" :refresh="refresh" :fId="fId" />
          <template #fallback>
            <div class="flex flex-col gap-4 items-center justify-center w-full">
              <USkeleton v-for="i in 5" :key="i" class="h-[104px] w-[100%]" />
            </div>
          </template>
        </Suspense>
      </template>

      <template #report="{ item }"> {{ item.label }} </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
const myForms = useForms();
const user = useUser();
const refresh = ref(false);

const { params } = useRoute();
const fId = params.formId as string;
const form = computed(() => {
  const data = myForms.value.find((f) => f.fId === fId);

  if (!data) {
    // redirect to 404
    navigateTo("/dashboard/forms");
  }
  return data;
});
async function onChange(index: number) {
  if (index === 1) {
    // fetch responses
    try {
      refresh.value = true;
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } finally {
      refresh.value = false;
    }
  }
}

const questions = form.value?.questions ?? [];

const items = [
  {
    slot: "form",
    label: "Form",
  },
  {
    slot: "response",
    label: "Response",
  },
  {
    slot: "report",
    label: "Report",
  },
];

definePageMeta({
  layout: "dashbord-layout",
     
});
useHead({
  title: form.value?.title ?? "Form",
  meta: [
    {
      name: form.value?.description ?? "Form",
      content: "Form",
    },
  ],
});
</script>

<style scoped></style>
