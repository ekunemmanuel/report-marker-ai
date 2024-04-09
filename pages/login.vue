<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
const { signIn } = useAuth();

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

const loading = ref(false);
const loginWithGoogleLoading = ref(false);

type Schema = z.output<typeof schema>;

const state = reactive({
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = event.data;
  loading.value = true;
  console.log(data);

  const d = await signIn("credentials", data, {
    redirect: "false",
  });

  console.log(d);
  loading.value = false;
}

async function loginWithGoogle() {
  loginWithGoogleLoading.value = true;
  await signIn("google");
  loginWithGoogleLoading.value = false;
}

const isLoading = computed(() => loading.value || loginWithGoogleLoading.value);

definePageMeta({
  middleware: ["guess"],
  auth: false,
  redirect: "/",
});

useHead({
  title: "Login",
  meta: [
    {
      name: "description",
      content: "Login to your account",
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
            Login
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
            label="Login with Google"
            color="gray"
            size="lg"
            padded
            icon="i-simple-icons-google"
            @click="loginWithGoogle"
            :loading="loginWithGoogleLoading"
            :disabled="isLoading"
          />
        </div>
        <div
          class="pt-[10px] flex w-full items-center justify-center gap-[10px]"
        >
          <div class="">
            <UButton
              to="/register"
              label="Don't have an account? Register here"
              variant="link"
              :disabled="isLoading"
            />
          </div>
        </div>
      </div>
    </UCard>
  </div>
</template>
