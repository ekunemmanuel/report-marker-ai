<template>
  <div class="max-w-[600px] mx-auto space-y-[30px]">
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
      <div>
        <h1 class="text-5xl font-bold">{{ form.title }}</h1>
        <p class="text-gray-500">{{ form.description }}</p>
      </div>
    </div>
    <UDivider class="" />
    <UForm :state="state" class="space-y-4">
      <UFormGroup
        v-for="(q, index) in form.questions"
        :key="index"
        :label="q.question"
        :name="q.qId"
        :required="q.required"
        :ui="{
          label: {
            required: 'after:ml-[5px] text-[18px] !font-bold pb-[5px]',
          },
        }"
      >
        <div
          v-if="q.type === 'single'"
          class="flex justify-between items-start gap-[10px]"
        >
          <URadioGroup
            v-model="state[q.qId]"
            :options="q.options"
            class="flex-1 capitalize"
          />
        </div>

        <div v-else-if="q.type === 'multiple'">
          <div class="flex justify-between items-start gap-[10px]">
            <USelectMenu
              class="flex-1"
              :label="q.question"
              v-model="state[q.qId]"
              :options="q.options"
              placeholder="You can select multiple options"
              multiple
            />
          </div>
          <ul>
            <li v-for="option in state[q.qId]" :key="option">
              <span>
                {{ option }}
              </span>
            </li>
          </ul>
        </div>

        <div v-else class="flex justify-between items-start gap-[10px]">
          <UTextarea
            class="flex-1"
            v-model="state[q.qId]"
            autoresize
            :maxrows="5"
          />
        </div>
      </UFormGroup>

      <UButton> Submit </UButton>
    </UForm>
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
import { z } from "zod";
import { useShare } from "@vueuse/core";
import { isClient } from "@vueuse/shared";
const { getForms, deleteForm } = useApiCalls();
const { notification } = useNotification();
const myForms = useForms();
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
const questions = toRef(props.questions);
const schema = z.object(
  questions.value.reduce((acc, question) => {
    if (question.type === "multiple") {
      acc[question.qId] = question.required
        ? z.array(z.string()).nonempty("Please select at least one option")
        : z.array(z.string()).optional();
    } else {
      acc[question.qId] = question.required
        ? z.string().min(1, "Please enter a value")
        : z.string().optional();
    }
    return acc;
  }, {} as Record<string, z.ZodTypeAny>)
);

type Schema = z.output<typeof schema>;

const state = reactive(
  questions.value.reduce((acc, question) => {
    if (question.type === "multiple") {
      if (Array.isArray(question.answer)) {
        acc[question.qId] = question.answer;
      } else if (typeof question.answer === "string") {
        acc[question.qId] = question.answer;
      } else {
        acc[question.qId] = [];
      }
    } else {
      acc[question.qId] = question.answer;
    }

    return acc;
  }, {} as Record<string, string | boolean | string[] | undefined>)
);

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
  isOpen.value = true;
  if (!user.value) return;

  await deleteForm(user.value.uId, form.value.fId);
  myForms.value = myForms.value.filter((f) => f.fId !== form.value.fId);

  notification("Success", "Form deleted successfully", "success");
  await getForms(user.value.uId);
  isOpen.value = false;
}
</script>

<style scoped></style>
