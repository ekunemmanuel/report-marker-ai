<template>
  <div class="max-w-[600px] mx-auto space-y-[10px]">
    <div class="sticky top-[-10px] z-[10] py-[10px] dark:bg-[#121212] bg-white">
      <div class="flex justify-end gap-[10px] items-center">
        <UDropdown :items="actions(form)">
          <UButton
            color="emerald"
            variant="soft"
            trailing-icon="i-heroicons-chevron-down-20-solid"
            label="Options"
          />
          <template #delete="{ item }">
            <div
              class="flex actions-center gap-[6px] text-red-600 w-full text-[14px] font-bold"
            >
              <UIcon :name="item.icon" class="text-[20px]" />
              {{ item.label }}
            </div>
          </template>
        </UDropdown>
      </div>
    </div>
    <div class="flex justify-between gap-[10px] items-end">
      <div class="space-y-3">
        <h1 class="text-5xl font-bold">{{ form.title }}</h1>
        <p class="text-gray-500">{{ form.description }}</p>
      </div>
    </div>
    <UDivider class="" />

    <div>
      <ul class="space-y-[20px]">
        <li
          v-for="(question, index) in form.questions"
          :key="index"
          class="p-4 border border-gray-200 dark:border-gray-800 rounded-lg shadow-md dark:shadow-lg bg-white dark:bg-gray-800 flex gap-[10px]"
        >
          <div class="font-bold">
            {{ index + 1 }}
          </div>
          <div class="flex-1">
            <p class="font-bold text-[18px]">
              {{ question.question }}
              <span class="text-red-500">
                {{ question.required ? "*" : "" }}
              </span>
            </p>
            <p>
              <span class="capitalize">
                {{ parseQuestionType(question.type) }}
              </span>
            </p>
            <ul class="pl-[20px]">
              <li
                v-for="(option, index) in question.options"
                :key="index"
                class="list-disc after:"
              >
                {{ option }}
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </div>

    <UModal
      prevent-close
      v-model="isOpen"
      :ui="{
        width: 'w-full sm:max-w-[600px]',
        background: 'bg-transparent dark:bg-transparent',
        rounded: 'rounded-none',
        shadow: 'shadow-none',
      }"
      ><div class="text-[50px] flex justify-center">
        <UIcon name="eos-icons:bubble-loading" />
      </div>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import type { MyForm, Question } from "~/types";
import { useShare } from "@vueuse/core";
import { isClient } from "@vueuse/shared";
const { deleteForm } = useApiCalls();
const { notification } = useNotification();
const isOpen = ref(false);
const user = useUser();

const props = defineProps<{
  questions: Question[];
  form: MyForm;
}>();

const actions = (row: MyForm) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        navigateTo(`/dashboard/forms/e/${row.fId}`);
      },
    },
    {
      label: "Share",
      icon: "material-symbols:share",
      click: () => {
        startShare();
      },
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        removeForm();
      },
      slot: "delete",
    },
  ],
];
const form = toRef(props.form);

async function startShare() {
  if (!user.value) return;
  const shareOptions = ref({
    url: isClient
      ? `${location.origin}/forms/s/${user.value.uId}/${form.value.fId}`
      : ``,
  });
  const { share, isSupported } = useShare(shareOptions);
  try {
    return await share();
  } catch (err) {
    return err;
  }
}

async function removeForm() {
  try {
    isOpen.value = true;
    if (!user.value) return;

    await deleteForm(user.value.uId, form.value.fId);

    notification("Success", "Form deleted successfully", "success");

    navigateTo("/dashboard/forms");
  } catch (error) {
    notification("Error", "Form failed to delete", "error");
  } finally {
    isOpen.value = false;
  }
}
</script>

<style scoped></style>
