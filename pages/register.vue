<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const { signIn } = useAuth();

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

const loading = ref(false);
const registerLoading = ref(false);

const { createProfile } = useApiCalls();
const { notification } = useNotification();

type Schema = z.output<typeof schema>;

const state = reactive({
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const data = event.data;
    loading.value = true;
    await createProfile(data.email, data.password);

    navigateTo("/login");
    notification(
      "Success",
      "Account created successfully. Please login.",
      "success"
    );
  } catch (error) {
    console.error(error);
    notification(
      "Error",
      "An error occurred. Please try again later.",
      "error"
    );
  } finally {
    loading.value = false;
  }
}

async function registerWithGoogle() {
  registerLoading.value = true;
  await signIn("google");
  registerLoading.value = false;
}

const isLoading = computed(() => loading.value || registerLoading.value);
definePageMeta({
  middleware: "guess",
  auth: false,
  redirect: "/",
});
useHead({
  title: "Register",
  meta: [
    {
      name: "description",
      content: "Register for an account",
    },
  ],
});
</script>

<template>
  <div
    class="grid min-h-[calc(100vh-60px)] p-[10px] place-items-center bg-zinc-100 dark:bg-transparent"
  >
    <UCard
      :ui="{
        ring: '',
        base: 'max-w-[600px] w-full',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h1
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            Register
          </h1>
        </div>
      </template>

      <div class="space-y-4">
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormGroup label="Email" name="email">
            <UInput v-model="state.email" :disabled="isLoading" />
          </UFormGroup>

          <UFormGroup label="Password" name="password">
            <UInput
              v-model="state.password"
              type="password"
              :disabled="isLoading"
            />
          </UFormGroup>

          <UButton :loading="loading" type="submit" :disabled="isLoading">
            Submit
          </UButton>
        </UForm>

        <UDivider label="OR" />
        <div class="flex items-center justify-center">
          <UButton
            color="gray"
            label="Sign up with Google"
            icon="i-simple-icons-google"
            size="lg"
            padded
            :disabled="isLoading"
            :loading="registerLoading"
            @click="registerWithGoogle"
          />
        </div>

        <div class="pt-[10px] flex w-full items-center justify-center">
          <div class="">
            <UButton
              to="/login"
              label="Already have an account? Login here"
              variant="link"
              :disabled="isLoading"
            />
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
