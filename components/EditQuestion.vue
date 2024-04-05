<template>
  <UCard
    :ui="{
      ring: '',
      divide: 'divide-y divide-gray-100 dark:divide-gray-800',
    }"
  >
    <template #header>
      <div class="flex items-center justify-between">
        <h3
          class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
        >
          Edit Question
        </h3>
        <UButton
          color="gray"
          variant="ghost"
          icon="i-heroicons-x-mark-20-solid"
          class="-my-1"
          @click="closeModal"
        />
      </div>
    </template>

    <UForm
      :schema="questionSchema"
      :state="question"
      class="space-y-4 pt-4"
      @submit="editQuestion"
    >
      <UFormGroup label="Question" name="question">
        <UTextarea v-model="question.question" />
      </UFormGroup>

      <UFormGroup label="Required" name="required">
        <UCheckbox v-model="question.required" />
      </UFormGroup>
      <UFormGroup label="Type" name="type">
        <USelectMenu
          class="capitalize"
          v-model="question.type"
          :options="['multiple', 'single', 'text']"
        />
      </UFormGroup>
      <div v-if="question.type != 'text'" class="space-y-4">
        <div class="flex gap-[10px] justify-between items-center">
          <UFormGroup label="Options" name="options" class="flex-1">
            <UInput v-model="option" />
          </UFormGroup>
          <UButton class="" @click="addOptions"> Add Option</UButton>
        </div>

        <ul class="space-y-[10px]">
          <li v-for="(option, index) in question.options" :key="option">
            <div class="flex gap-[10px] items-center justify-between">
              <p>
                {{ option }}
              </p>
              <div class="space-x-[10px]">
                <UButton
                  variant="solid"
                  color="rose"
                  class="px-[10px]"
                  icon="ic:baseline-delete"
                  @click="deleteOption(index)"
                />
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="space-x-[10px] flex justify-end">
        <UButton type="submit" label="Save" />
        <UButton
          color="rose"
          variant="ghost"
          label="Close"
          @click="closeModal"
        />
      </div>
    </UForm>
  </UCard>
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { MyForm, Question } from "~/types";
import type { FormSubmitEvent } from "#ui/types";

const props = defineProps<{
  form: MyForm;
  question: Question;
  closeModal: Function;
}>();

const option = ref("");
const question = toReactive(props.question);
const form = toRef(props, "form");

const questionSchema = z
  .object({
    question: z.string().min(1, "Question is required"),
    type: z.enum(["multiple", "single", "text"]),
    required: z.boolean(),
    options: z.array(z.string()).optional(),
  })

  .refine(
    (data) => {
      // If type is "text", options are not required
      if (data.type === "text") {
        return true;
      }
      // If type is "single" or "multiple", options are required
      return Array.isArray(data.options) && data.options.length > 1;
    },
    {
      // Custom error message
      message:
        "At least two options are required for single or multiple choice questions",
      path: ["options"], // Specify the path of the field that this error is associated with
    }
  );

type QuestionSchema = z.output<typeof questionSchema>;

function editQuestion(event: FormSubmitEvent<QuestionSchema>) {
  const data = event.data;

  const q = form.value.questions.find((q) => q.qId === question.qId);

  if (!q) {
    return;
  }
  q.question = data.question;
  q.type = data.type;
  q.required = data.required;
  if (data.type !== "text") {
    q.options = data.options;
  } else {
    delete q.options;
  }

  props.closeModal();
}

function addOptions() {
  question.options = question.options ?? [];
  if (!option.value) {
    return;
  }
  question.options.push(option.value);
  option.value = "";
}

function deleteOption(index: number) {
  if (!question.options) {
    return;
  }
  question.options.splice(index, 1);
}
</script>

<style scoped></style>
