<template>
  <aside class="h-full">
    <UCard class="flex flex-col flex-1" :ui="ui">
      <template #header>
        <UButton
              variant="ghost"
              color="emerald"
              class="w-full px-[20px] py-[10px] duration-200"
              to="/"
            >
              <div class="flex justify-center items-center gap-[10px]">
                <UIcon
                  class="text-[20px]"
                  name="material-symbols-light:other-houses-rounded"
                />
                <span class="truncate"> Report-Lysis</span>
              </div></UButton
            >
      </template>

      <nav>
        <ul class="space-y-4 overflow-y-auto">
     
          <li v-for="(link, index) in links" :key="index">
            <UButton
              class="w-full block px-[20px] py-[10px] dark:text-white text-black duration-200"
              active-class="dark:!text-primary text-primary dark:bg-transparent bg-primary-100"
              variant="outline"
              :to="{ name: link.to }"
              >{{ link.name }}</UButton
            >
          </li>
        </ul>
      </nav>
      <template #footer>
        <div class="flex justify-between items-center">
          <UButton
            @click="signOut"
            label="Sign Out"
            color="red"
            variant="ghost"
            icon="solar:logout-2-linear"
          />
          <UButton
            :icon="
              isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'
            "
            variant="ghost"
            aria-label="Theme"
            @click="toggleColorMode"
          />
        </div>
      </template>
    </UCard>
  </aside>
</template>

<script lang="ts" setup>
const { signOut } = useAuth();

const links = ref([
  // { name: "Dashboard", to: "dashboard" },
  { name: "Forms", to: "dashboard-forms" },
  { name: "Profile", to: "dashboard-profile" },
]);
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

const ui = {
  body: {
    base: "flex-1 h-screen overflow-y-auto",
    padding: "!px-[10px] !py-[10px] sm:p-0",
  },
  ring: "",
  rounded: "!rounded-r-xl rounded-none",
  divide: "divide-y divide-gray-100 dark:divide-gray-800",
  base: "flex-1 h-screen",
  footer: {
    base: "",
    background: "",
    padding: "!px-[10px] !py-[10px] sm:p-0",
  },
  header: {
    base: "",
    background: "",
    padding: "!px-[10px] !py-[10px] sm:p-0",
  },
};
</script>

<style scoped></style>
