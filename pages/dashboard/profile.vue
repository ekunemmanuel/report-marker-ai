<template>
  <div>
    <h1 class="text-[40px] font-bold">Profile</h1>
    <Stream />
    <div v-if="data">
      <UAvatar :alt="alt" size="3xl" :src="data.photoURL" />
      <p>Email: {{ data.email }}</p>
      <p>Subscription: {{ data.subscription }}</p>
      <div v-if="data.plan">
        <h2>Plan</h2>
        <p v-if="data.plan">Name: {{ data.plan.name }}</p>
        <p>Interval: {{ data.plan.interval }}</p>
        <p>Amount: {{ data.plan.amount }}</p>
        <p>Description: {{ data.plan.description }}</p>
        <p>Currency: {{ data.plan.currency }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const user = useUser();
const { data } = await useLazyAsyncData("profile", () =>
  $fetch(`/api/v1/users/${user.value?.uId}`)
);

const alt = computed(() => data.value?.email.toUpperCase());
definePageMeta({
  layout: "dashbord-layout",

});
useHead({
  title: "Profile",
  meta: [
    {
      name: "description",
      content: "Profile",
    },
  ],
});
</script>

<style scoped></style>
