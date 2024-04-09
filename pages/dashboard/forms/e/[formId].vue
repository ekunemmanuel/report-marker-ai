<template>
  <div class="max-w-[600px] w-full mx-auto">
    <div v-if="pending">
      <div class="text-[50px] flex justify-center">
        <UIcon name="eos-icons:bubble-loading" />
      </div>
    </div>
    <div v-if="form" class="space-y-4">
      <div
        class="sticky z-[10] top-[-10px] pb-[5px] dark:bg-[#121212] bg-white"
      >
        <div class="pt-[10px]">
          <UButton
            variant="ghost"
            color="gray"
            class="px-[10px]"
            icon="material-symbols:arrow-back-ios-new-rounded"
            @click="back"
          />
        </div>
        <div class="space-y-[30px]">
          <div
            class="flex justify-between gap-[10px] items-end dark:bg-[#121212] bg-white"
          >
            <div class="space-y-3">
              <h1 class="text-5xl font-bold">{{ form.title }}</h1>
              <p class="text-gray-500 text-wrap break-all">
                {{ form.description }}
              </p>
            </div>
            <UButton
              variant="ghost"
              color="gray"
              class="px-[10px]"
              icon="material-symbols:edit-rounded"
              @click="editFormHeader"
            />
          </div>
          <UDivider class="" />
        </div>
      </div>

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
            <div class="space-x-[10px]">
              <UButton
                variant="solid"
                class="px-[10px]"
                color="gray"
                icon="material-symbols:edit-rounded"
                @click="openEditQuestionModal(question.qId)"
              />
              <UButton
                variant="solid"
                color="rose"
                class="px-[10px]"
                icon="ic:baseline-delete"
                @click="deleteQuestion(question.qId)"
              />
            </div>
          </li>
        </ul>
      </div>

      <div class="flex justify-center gap-[10px]">
        <UButton
          label="Add Question"
          variant="ghost"
          class="px-[10px]"
          @click="openQuestionModal"
        />
        <UButton
          label="Generate Questions"
          variant="solid"
          class="px-[10px]"
          @click="generateQuestions"
        />
      </div>
      <div class="flex justify-end gap-[10px]">
        <UButton
          label="Update"
          variant="solid"
          class="px-[10px]"
          icon="ph:check-bold"
          @click="safeForm"
        />
      </div>
    </div>
  </div>

  <UModal
    v-model="isOpen"
    prevent-close
    :ui="{
      width: 'w-full sm:max-w-[600px]',
      background:
        isGenerateQuestionsOpen || isSaving
          ? 'bg-transparent dark:bg-transparent'
          : 'bg-white dark:bg-gray-900',

      rounded:
        isGenerateQuestionsOpen || isSaving ? 'rounded-none' : 'rounded-lg',
      shadow: isGenerateQuestionsOpen || isSaving ? 'shadow-none' : 'shadow-xl',
    }"
  >
    <div v-if="isAddQuestionOpen">
      <AddQuestion
        :question="question"
        :closeModal="closeModal"
        :form="form!"
      />
    </div>
    <div v-if="isEditFormHeaderOpen">
      <FormHeader
        :form="form!"
        :formHeader="formHeader"
        :closeModal="closeModal"
      />
    </div>
    <div v-if="isEditQuestionOpen">
      <EditQuestion
        :question="question"
        :closeModal="closeModal"
        :form="form!"
      />
    </div>

    <div v-if="isGenerateQuestionsOpen || isSaving">
      <div class="text-[50px] flex justify-center">
        <UIcon name="eos-icons:bubble-loading" />
      </div>
    </div>
  </UModal>
</template>

<script setup lang="ts">
import type { MyForm, Question } from "~/types";
import { v4 } from "uuid";
import { parseQuestionType } from "~/utils/index";
const { notification } = useNotification();
const { params } = useRoute();
const { updateForm, getForm } = useApiCalls();

const user = useUser();

const isOpen = ref(false);
const isEditFormHeaderOpen = ref(false);
const isAddQuestionOpen = ref(false);
const isEditQuestionOpen = ref(false);
const isGenerateQuestionsOpen = ref(false);
const fId = ref<string>(params.formId as string);
const isSaving = ref(false);

const { data: form, pending } = await useLazyAsyncData(
  "form",

  async () => await getForm(user.value!.uId, fId.value)
);
const formHeader = reactive({
  title: form.value?.title || "",
  description: form.value?.description || "",
});

const question = reactive<Question>({
  question: "",
  type: "text",
  required: false,
  options: [] as string[],
  qId: "",
});

function closeModal() {
  isOpen.value = false;
  isEditFormHeaderOpen.value = false;
  isAddQuestionOpen.value = false;
  isEditQuestionOpen.value = false;
  isGenerateQuestionsOpen.value = false;
  isSaving.value = false;
  question.question = "";
  question.required = false;
  question.type = "text";
  question.options = undefined;
  question.qId = "";
  formHeader.title = "Form Title";
  formHeader.description = "Form Description";
}

function openQuestionModal() {
  isOpen.value = true;
  isAddQuestionOpen.value = true;
  isEditFormHeaderOpen.value = false;
}

function openEditQuestionModal(qid: string) {
  isOpen.value = true;
  isEditQuestionOpen.value = true;
  if (!form.value) return;
  const q = form.value.questions.find((q) => q.qId === qid);
  if (!q) return;
  question.question = q.question;
  question.required = q.required;
  question.type = q.type;
  if (q.type !== "text" && q.options) {
    question.options = q.options;
  }
  question.qId = q.qId;
}

function generateQuestions() {
  const genratedQuestions = useQuestions();
  isOpen.value = true;
  isGenerateQuestionsOpen.value = true;

  setTimeout(() => {
    genratedQuestions.value.map((q) => {
      if (!form.value) return;
      const id = v4();
      form.value.questions.push({
        ...q,
        qId: id,
      });
    });

    closeModal();
  }, 500);
}

function deleteQuestion(qId: string) {
  if (!form.value) return;
  const index = form.value.questions.findIndex((q) => q.qId === qId);
  if (index === -1) {
    notification("Error", "Question not found", "error");
    return;
  }
  form.value.questions.splice(index, 1);
  closeModal();
}

function editFormHeader() {
  isOpen.value = true;
  isEditFormHeaderOpen.value = true;
  isAddQuestionOpen.value = false;
  isEditQuestionOpen.value = false;
}

async function safeForm() {
  try {
    if (!user.value) return;
    if (!form.value) return;
    if (
      !formHeader.title ||
      !formHeader.description ||
      form.value.questions.length === 0
    ) {
      notification("Error", "Form is not complete", "error");
      return;
    }
    isOpen.value = true;
    isSaving.value = true;

    await updateForm(user.value.uId, form.value);
  } catch (error) {
    console.error(error);
    notification("Error", "An error occurred while saving the form", "error");
  } finally {
    closeModal();
  }
}

function back() {
  navigateTo(`/dashboard/forms/${fId.value}`);
}

definePageMeta({
  layout: "dashbord-layout",
  redirect: "/",
});
useHead({
  title: "Edit Form",
  meta: [
    {
      name: "description",
      content: "Edit Form Page",
    },
  ],
});
</script>

<style scoped></style>
