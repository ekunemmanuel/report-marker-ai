<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Must be at least 8 characters"),
});

const loading = ref(false);
const loginWithGoogleLoading = ref(false);

const { logInWithGoogle, login } = useMyFirebase();

type Schema = z.output<typeof schema>;

const state = reactive({
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  const data = event.data;
  loading.value = true;
  await login(data.email, data.password);
  loading.value = false;
}

async function loginWithGoogle() {
  loginWithGoogleLoading.value = true;
  await logInWithGoogle();
  loginWithGoogleLoading.value = false;
}

const isLoading = computed(() => loading.value || loginWithGoogleLoading.value);

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

        <UButton
          color="black"
          label="Login with Google"
          icon="i-simple-icons-google"
          block
          @click="loginWithGoogle"
          :loading="loginWithGoogleLoading"
          :disabled="isLoading"
        />

        <div class="pt-[10px] flex w-full items-center gap-[10px]">
          <div class="flex-1">
            <UButton
              to="/register"
              label="Don't have an account? Register here"
              variant="link"
              :disabled="isLoading"
            />
          </div>

          <div>
            <UButton
              color="white"
              to="/forgot-password"
              label="Forgot password?"
              variant="link"
              :disabled="isLoading"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
