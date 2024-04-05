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
          Form Header
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
      :schema="formHeaderSchema"
      :state="formHeader"
      class="space-y-4 pt-4"
      @submit="onSubmitFormHeader"
    >
      <UFormGroup label="Title" name="title">
        <UInput v-model="formHeader.title" />
      </UFormGroup>
      <UFormGroup label="Description" name="description">
        <UTextarea v-model="formHeader.description" />
      </UFormGroup>
      <UButton type="submit"> Submit </UButton>
    </UForm>
  </UCard>
</template>

<script lang="ts" setup>
import { z } from "zod";
import type { MyForm, Question } from "~/types";
import type { FormSubmitEvent } from "#ui/types";

const props = defineProps<{
  form: MyForm;
  formHeader: FormHeader;
  closeModal: Function;
}>();

const form = toRef(props, "form");
const formHeader = toReactive(props.formHeader);

const formHeaderSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(5, "Description is required"),
});

type FormHeader = z.output<typeof formHeaderSchema>;

function onSubmitFormHeader(event: FormSubmitEvent<FormHeader>) {
  const data = event.data;
  form.value.title = data.title;
  form.value.description = data.description;
  props.closeModal();
}
</script>

<style scoped></style>
