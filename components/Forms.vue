<template>
  <div v-if="forms">
    <UTable
      :loading="pending"
      :loading-state="{
        icon: 'i-heroicons-arrow-path-20-solid',
        label: 'Loading...',
      }"
      :progress="{ color: 'primary', animation: 'carousel' }"
      class=""
      :rows="forms"
      :columns="columns"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No Forms.',
      }"
    >
      <template #description-data="{ row }">
        <span class="line-clamp-3">{{ row.description.value }}</span>
      </template>

      <template #createdAt-data="{ row }">
        <span class="line-clamp-1">{{ row.createdAt }}</span>
      </template>

      <template #updatedAt-data="{ row }">
        <span class="line-clamp-1">{{ row.updatedAt }}</span>
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="actions(row)">
          <UButton
            color="emerald"
            variant="soft"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
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
      </template>
    </UTable>
  </div>
  <UModal
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
</template>

<script lang="ts" setup>
import type { MyForm } from "~/types";
import { useShare } from "@vueuse/core";
import { isClient } from "@vueuse/shared";
const user = useUser();
const { deleteForm, getForms } = useApiCalls();
const { notification } = useNotification();

const isOpen = ref(false);

const actions = (row: MyForm) => [
  [
    {
      label: "View",
      icon: "mdi:eye",
      click: () => {
        navigateTo(`/dashboard/forms/${row.fId}`);
      },
    },
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
        startShare(row.fId);
      },
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        removeForm(row.fId);
      },
      slot: "delete",
    },
  ],
];

const {
  data: forms,
  pending,
  refresh,
} = await useLazyAsyncData(
  "form",
  async () => await getForms(user.value!.uId),
  {
    transform: (data) => {
      return data.map((form) => {
        return {
          ...form,
          description: {
            value: form.description,
            class: "w-[650px] break-all text-wrap",
          },
          createdAt: parseDate(form.createdAt ?? ""),
          updatedAt: form.updatedAt
            ? parseDate(form.updatedAt)
            : parseDate(form.createdAt ?? ""),
        };
      });
    },
  }
);

const columns = [
  {
    key: "title",
    label: "Title",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "createdAt",
    label: "Created At",
  },
  {
    key: "updatedAt",
    label: "Updated At",
  },
  {
    key: "actions",
    label: "Options",
  },
];

async function removeForm(fId: string) {
  try {
    isOpen.value = true;
    if (!user.value) return;
    await deleteForm(user.value.uId, fId);
    await refresh();
    notification("Success", "Form deleted successfully", "success");
  } catch (error) {
    notification("Error", "Form failed to delete", "error");
  } finally {
    isOpen.value = false;
  }
}

function parseDate(data: string) {
  const date = new Date(data);
  const formattedDate = `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  return formattedDate;
}

async function startShare(fId: string) {
  if (!user.value) return;
  const shareOptions = ref({
    url: isClient ? `${location.origin}/forms/s/${user.value.uId}/${fId}` : ``,
  });

  const { share, isSupported } = useShare(shareOptions.value);
  try {
    return await share();
  } catch (err) {
    return err;
  }
}
</script>

<style scoped></style>
