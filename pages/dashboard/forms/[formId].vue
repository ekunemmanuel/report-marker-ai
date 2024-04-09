<template>
  <div v-if="!pending && form" class="space-y-3">
    <Head>
      <title>{{ form.title }}</title>
      <meta name="description" content="{{ form.description }}" />
    </Head>
    <TopBar name="" />
    <UTabs @change="onChange" :items="items" class="w-full">
      <template #form="{ item }">
        <MyForm :form="form" :questions="questions" />
      </template>

      <template #response="{ item }">
        <Responses v-if="user" :uId="user.uId" :refresh="refresh" :fId="fId" />
      </template>

      <template #report="{ item }"> {{ item.label }} </template>
    </UTabs>
  </div>
</template>

<script setup lang="ts">
import TopBar from "~/components/TopBar.vue";
import type { MyForm } from "~/types";

const user = useUser();
const refresh = ref(false);
const { params } = useRoute();
const fId = params.formId as string;

const { data: form, pending } = await useFetch<MyForm>(
  `/api/v1/users/${user.value?.uId}/forms/${fId}`
);

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
  redirect: "/",
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
