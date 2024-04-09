<template>
  <p>Number of responses: {{ responseCount }}</p>
  <div>
    <UTable
      :loading="loading"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Loading...',
      }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      class=""
      :rows="rows"
      :columns="columns"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No Forms.',
      }"
    >
      <template #id-data="{ row }">
        <span class="line-clamp-1 text-wrap break-all">{{ row.rId }}</span>
      </template>

      <template #createdAt-data="{ row }">
        <span class="line-clamp-1">{{ row.createdAt }}</span>
      </template>

      <template #updatedAt-data="{ row }">
        <span class="line-clamp-1">{{ row.updatedAt }}</span>
      </template>

      <template #actions-data="{ row }">
        <UButton
          color="emerald"
          variant="ghost"
          icon="mdi:eye"
          @click="openModal(`${row.rId}`)"
        />
      </template>
    </UTable>
    <div
      class="flex justify-end px-3 gap-[10px] py-3.5 border-t border-gray-200 dark:border-gray-700"
    >
      <div>
        <USelectMenu v-model="selected" :options="pageCounts" />
      </div>
      <div>
        <UPagination
          v-model="page"
          :page-count="selected"
          :total="responses.length"
          :active-button="{ variant: 'soft' }"
          :inactive-button="{ color: 'white' }"
        />
      </div>
    </div>
  </div>

  <UModal
    v-model="isOpen"
    :ui="{
      width: 'w-full sm:max-w-[600px]',
      padding: 'p-4 sm:p-4',
      margin: '!sm:my-0 ',
      background:
        response == null
          ? 'bg-transparent dark:bg-transparent'
          : 'bg-white dark:bg-gray-900',

      rounded: response == null ? 'rounded-none' : 'rounded-lg',
      shadow: response == null ? 'shadow-none' : 'shadow-xl',
    }"
  >
    <div v-if="response" class="w-full mx-auto space-y-[30px] p-[20px]">
      <div class="flex justify-between gap-[10px] items-start">
        <div class="space-y-4">
          <h1 class="text-5xl font-bold">{{ response.title }}</h1>
          <p class="text-gray-500">{{ response.description }}</p>
        </div>
        <div>
          <UButton
            label="Close"
            color="rose"
            variant="soft"
            @click="closeModal"
          />
        </div>
      </div>
      <div>
        <ul class="space-y-[20px]">
          <li
            v-for="(question, index) in response.questions"
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
                  class="list-disc"
                >
                  {{ option }}
                </li>
              </ul>

              <p class="text-primary font-bold">
                <span>Answer: </span>
                <span
                  class="px-[20px] block"
                  v-if="Array.isArray(question.answer)"
                >
                  <li
                    class="list-disc"
                    v-for="(item, index) in question.answer"
                    :key="index"
                  >
                    {{ item }}
                  </li>
                </span>
                <span v-else-if="question.answer">
                  {{ question.answer }}
                </span>
                <span v-else> No answer </span>
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="text-[50px] flex justify-center">
      <UIcon name="eos-icons:bubble-loading" />
    </div>
  </UModal>
</template>

<script lang="ts" setup>
import type { FormResponse } from "~/types";
import { parseQuestionType } from "~/utils/index";

const { getResponse, getResponses } = useApiCalls();
const props = defineProps<{
  refresh: boolean;
  uId: string;
  fId: string;
}>();

const responses = ref<FormResponse[]>([]);
const loading = ref(false);
const uId = toRef(props, "uId");
const fId = toRef(props, "fId");
const refresh = toRef(props, "refresh");
const response = ref<FormResponse | null>(null);

const responseCount = computed(() => responses.value.length);
const isOpen = ref(false);

const columns = [
  {
    key: "id",
    label: "#",
  },
  {
    key: "createdAt",
    label: "Answered On",
    sortable: true,
  },
  {
    key: "actions",
    label: "View",
  },
];

async function openModal(id: string) {
  isOpen.value = true;
  const data = await getResponse(uId.value, fId.value, id);
  if (!data) return;
  response.value = {
    ...data,
    createdAt: parseDate(data.createdAt ?? ""),
    updatedAt: data.updatedAt
      ? parseDate(data.updatedAt)
      : parseDate(data.createdAt ?? ""),
  };
}

function closeModal() {
  isOpen.value = false;
  response.value = null;
}

const pageCounts = [5, 10, 15, 20, 50, 100];

const selected = ref(pageCounts[0]);

const page = ref(1);

const rows = computed(() => {
  return responses.value.slice(
    (page.value - 1) * selected.value,
    page.value * selected.value
  );
});

watch(
  refresh,
  async (newVal) => {
    if (newVal == true) {
      loading.value = true;
      const data = await getResponses(uId.value, fId.value);
      if (!data) return;
      responses.value = data.map((response) => {
        return {
          ...response,
          createdAt: parseDate(response.createdAt ?? ""),
          updatedAt: response.updatedAt
            ? parseDate(response.updatedAt)
            : parseDate(response.createdAt ?? ""),
        };
      });

      loading.value = false;
    }
  },
  { immediate: true }
);

function parseDate(data: string) {
  const date = new Date(data);
  const formattedDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return formattedDate;
}
</script>

<style scoped></style>
