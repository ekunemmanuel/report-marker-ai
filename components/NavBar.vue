<template>
  <div
    class="flex justify-between gap-[10px] p-[10px] max-w-[800px] mx-auto items-center"
  >
    <NuxtLink to="/"> Report-Lysis </NuxtLink>
    <div class="flex items-center gap-[10px]">
      <div class="space-x-[10px]" v-if="status == 'unauthenticated'">
        <UButton
          variant="link"
          color="emerald"
          v-if="route.path !== '/login'"
          to="/login"
          >Login</UButton
        >
        <UButton variant="link" v-if="route.path !== '/register'" to="/register"
          >Register</UButton
        >
      </div>
      <div v-else class="space-x-[10px] flex items-center">
        <UDropdown :items="items">
          <UAvatar
            :src="data?.user?.image"
            :alt="data?.user?.email"
            class="capitalize"
          />

          <template #account="{ item }">
            <div class="text-left">
              <p>Signed in as</p>
              <p class="truncate font-medium text-gray-900 dark:text-white">
                {{ item.label }}
              </p>
            </div>
          </template>

          <template #item="{ item }">
            <span class="truncate">{{ item.label }}</span>
          </template>

          <template #signout="{ item }">
            <div
              class="flex actions-center gap-[6px] text-red-600 w-full text-[14px] font-bold"
            >
              <UIcon :name="item.icon" class="text-[20px]" />
              {{ item.label }}
            </div>
          </template>
        </UDropdown>
      </div>
      <UButton
        :icon="
          isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
        "
        variant="ghost"
        aria-label="Theme"
        @click="toggleColorMode"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { status, data, signOut } = useAuth();
const route = useRoute();

const items = [
  [
    // {
    //   label: "Dashboard",
    //   click: async () => {
    //     navigateTo("/dashboard");
    //   },
    // },
    {
      label: "Forms",
      click: async () => {
        navigateTo("/dashboard/forms");
      },
    },
    {
      label: "Profile",
      click: async () => {
        navigateTo("/dashboard/profile");
      },
    },
  ],

  [
    {
      label: "Sign Out",
      icon: "solar:logout-2-linear",
      click: async () => {
        await signOut();
      },
      slot: "signout",
    },
  ],
];

const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const toggleColorMode = () => {
  isDark.value = !isDark.value;
};
</script>

<style scoped></style>
