<script setup lang="ts">
import { type Waitlist, waitlistSchema } from "~/schema";
import type { FormSubmitEvent } from "#ui/types";
const { notification } = useNotification();
const state = reactive({
  email: null,
});

const loading = ref(false);

async function joinWaitlist(event: FormSubmitEvent<Waitlist>) {
  console.log(event.data.email);
  try {
    loading.value = true;
    const { data, error } = await useFetch("/api/v1/waitlist", {
      method: "POST",
      body: {
        email: event.data.email,
      },
      watch: false,
    });

    if (error.value) {
      notification("Error", error.value.data.message, "error");
      return;
    }

    state.email = null;

    notification("Success", "You have been added to the waitlist!", "success");
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

definePageMeta({
  auth: false,
});
useHead({
  title: "Report-Lysis",
  meta: [
    {
      name: "description",
      content: "Home page",
    },
  ],
});
</script>

<template>
  <div class="max-w-[1000px] mx-auto p-[10px]">
    <div class="space-y-[40px] pt-[40px]">
      <h1
        class="text-5xl sm:text-7xl font-bold text-center max-w-[600px] mx-auto"
      >
        Effortless <span class="text-primary">Data Analysis</span> with
        <span class="text-primary">Report-lysis AI</span>
      </h1>

      <p
        class="text-base sm:text-lg lg:text-xl text-justify text-wrapas break-words mt-4 mb-8 max-w-[900px] mx-auto !leading-[33px]"
      >
        Stop wrestling with survey responses and get straight to the insights
        you need. <span class="font-bold">Report-lysis AI</span> is your
        one-stop shop for effortless data analysis, perfect for anyone – from
        beginners to seasoned professionals. Short on time or unsure what
        questions to ask? No problem! Just provide a prompt about your data, and
        our AI does the heavy lifting. It crafts insightful survey questions (if
        needed), analyzes the responses from your forms, and delivers clear,
        actionable reports. Uncover hidden trends, understand your audience
        better, and make data-driven decisions with ease. Unleash the power of
        your data with <span class="font-bold">Report-lysis AI</span>!
      </p>

      <UForm
        :state="state"
        :schema="waitlistSchema"
        @submit="joinWaitlist"
        class="flex gap-[10px] max-w-[600px] mx-auto"
      >
        <UFormGroup class="flex-1" name="email">
          <UInput
            v-model="state.email"
            type="email"
            placeholder="Enter your email address to Join the waitlist"
          />
        </UFormGroup>
        <div>
          <UButton :loading="loading" type="submit"> Get Early Access </UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>

<style scoped></style>
