<template>
  <div class="max-w-[600px] mx-auto pb-[30px]">
    <div v-if="isNotEmpty" class="space-y-[30px]">
      <div
        class="sticky z-[10] top-[-10px] pb-[5px] dark:bg-[#121212] bg-white"
      >
        <div class="flex justify-between gap-[10px] items-end py-[10px]">
          <div class="space-y-3">
            <h1 class="text-5xl font-bold">{{ formHeader.title }}</h1>
            <p class="text-gray-500">{{ formHeader.description }}</p>
          </div>
        </div>
        <UDivider class="" />
      </div>

      <div class="px-[5px]">
        <UForm
          :state="state"
          class="space-y-4"
          :schema="schema"
          @submit="onSubmit"
        >
          <div
            v-for="(q, index) in questions"
            :key="q.qId"
            class="flex gap-[10px] items-baseline"
          >
            <div class="text-[18px] font-bold">
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <UFormGroup
                :label="q.question"
                :name="q.qId"
                :required="q.required"
                :ui="{
                  ring: '',
                  divide: 'divide-y divide-gray-100 dark:divide-gray-800',
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

                <div v-else-if="q.type === 'multiple'" class="space-y-[10px]">
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
                  <ul class="px-[20px]">
                    <li
                      v-for="option in state[q.qId]"
                      :key="option"
                      class="list-disc after:"
                    >
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
            </div>
          </div>

          <UButton type="submit">Submit</UButton>
        </UForm>
      </div>
    </div>

    <div v-else>
      <div class="flex justify-center items-center min-h-screen">
        <div class="flex flex-col gap-[30px] text-center">
          <div class="flex gap-[10px] items-center">
            <UIcon name="heroicons-outline:document-text" class="size-[50px]" />
            <p>There was an error fetching the form. Please try again later.</p>
          </div>
          <div>
            <UButton to="/" class="text-center">Go back</UButton>
          </div>
        </div>
      </div>
    </div>

    <UModal v-model="isOpen" prevent-close>
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
              Confirm Submission
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isOpen = false"
              :disabled="loading"
            />
          </div>
        </template>

        <div class="space-y-4">
          <p>Are you sure you want to submit the form?</p>
        </div>

        <template #footer>
          <div class="flex items-center justify-end gap-[10px]">
            <UButton
              color="red"
              variant="soft"
              label="No"
              class="-my-1"
              @click="closeModal"
              :disabled="loading"
            />
            <UButton
              variant="solid"
              label="Yes"
              class="-my-1"
              @click="verifySubmition"
              :loading="loading"
            />
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script lang="ts" setup>
import type { Question, MyForm } from "~/types";
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { v4 } from "uuid";

const { submitForm } = useApiCalls();

const { params } = useRoute();
const fId = ref(params.formId as string);
const id = ref(params.id as string);
const { notification } = useNotification();
const isOpen = ref(false);

const loading = ref(false);

const questions = toRef<Question[]>([]);
const formHeader = ref({
  title: "",
  description: "",
});
try {
  const {
    data: form,
    pending,
    refresh,
    error,
  } = await useFetch<MyForm>(`/api/v1/users/${id.value}/forms/${fId.value}`);

  await refresh();
  if (error.value || !form.value) {
    throw "There was an error fetching the form. Please try again later.";
  }
  formHeader.value.title = form.value.title;
  formHeader.value.description = form.value.description;
  questions.value = form.value.questions;
} catch (error: any) {
  notification("Error", error, "error");
  setTimeout(() => {
    navigateTo("/");
  }, 2000);
}

// Initialize the state object with reactive()
const state = reactive({
  // Initialize dynamic qId values based on question types
  ...questions.value.reduce((acc, question) => {
    if (question.type === "text") {
      // For text type, initialize as an empty string
      acc[question.qId] = "";
    } else if (question.type === "multiple") {
      // For multiple type, initialize as an empty array
      acc[question.qId] = [];
    } else if (question.type === "single") {
      // For single type, initialize as null or a default value
      acc[question.qId] = ""; // or set a default value here
    }
    return acc;
  }, {} as Record<string, string | boolean | string[] | null>),
  // Other state properties...
});

// Define the schema using Zod
const schema = z.object(
  questions.value.reduce((acc, question) => {
    if (question.type === "multiple") {
      acc[question.qId] = question.required
        ? z.array(z.string()).nonempty("Please select at least one option")
        : z.array(z.string()).optional();
    } else if (question.type === "single") {
      acc[question.qId] = question.required
        ? z.string().min(1, "Please select an option")
        : z.string().optional();
    } else {
      acc[question.qId] = question.required
        ? z.string().min(1, "Please enter a value")
        : z.string().optional();
    }
    return acc;
  }, {} as Record<string, z.ZodTypeAny>)
);
type Schema = z.output<typeof schema>;

const isNotEmpty = computed(() => questions.value.length > 0);

async function verifySubmition() {
  try {
    const response = {
      fId: fId.value,
      title: formHeader.value.title,
      description: formHeader.value.description,
      questions: questions.value,
      rId: v4(),
    };

    loading.value = true;
    await submitForm(id.value, response);
  } catch (error) {
  } finally {
    loading.value = false;
    closeModal();
  }
}

function closeModal() {
  isOpen.value = false;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const dataWithQuestion: Question[] = questions.value.map((question) => {
    return {
      ...question,
      answer: event.data[question.qId],
    };
  });
  questions.value = dataWithQuestion;

  isOpen.value = true;
}

useHead({
  title: formHeader.value?.title || "No title",
  meta: [
    {
      name: "description",
      content: formHeader.value?.description || "No description",
    },
  ],
});
</script>

<style scoped></style>
