<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const schema = z.object({
  email: z.string().email("Invalid email"),
});

const loading = ref(false);

const { resetPassword } = useMyFirebase();

type Schema = z.output<typeof schema>;

const state = reactive({
  email: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log("s");
  const data = event.data;
  loading.value = true;
  await resetPassword(data.email);
  loading.value = false;
}

useHead({
  title: "Forgot Password",
  meta: [
    {
      name: "description",
      content: "Forgot your password? Reset it here",
    },
  ],
});
</script>

<template>
  <div class="grid min-h-screen place-items-center">
    <div
      class="max-w-[600px] w-full rounded-lg px-[30px] py-[30px] bg-slate-900"
    >
      <div class="space-y-4">
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" :disabled="loading" />
          </UFormGroup>

          <UButton type="submit" :loading="loading" :disabled="loading">
            Submit
          </UButton>
        </UForm>

        <div class="pt-[10px] flex w-full items-center justify-center">
          <div class="">
            <UButton
              to="/login"
              label="Go back to login"
              variant="link"
              :disabled="loading"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
