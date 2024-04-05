<template>
  <aside class="h-full">
    <UCard class="flex flex-col flex-1" :ui="ui">
      <!-- <template #header>
        <Placeholder class="h-8" />
      </template> -->
      <nav>
        <ul class="space-y-4 overflow-y-auto">
          <UButton
            @click="goToNewForm"
            class="w-full block px-[20px] py-[10px]  duration-200"
          >
            <div class="flex justify-center items-center gap-[10px]">
              <UIcon class="text-[20px]" name="material-symbols:add-rounded" />
              <span class="truncate"> New Form</span>
            </div>
          </UButton>
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
          <UButton @click="logout" label="LogOut" color="red" variant="ghost" />
          <ClientOnly>
            <UButton
              :icon="
                isDark
                  ? 'i-heroicons-moon-20-solid'
                  : 'i-heroicons-sun-20-solid'
              "
              variant="ghost"
              aria-label="Theme"
              @click="toggleColorMode"
            />
            <template #fallback>
              <div class="w-8 h-8" />
            </template>
          </ClientOnly>
        </div>
      </template>
    </UCard>
  </aside>
</template>

<script lang="ts" setup>
import { v4 } from "uuid";
const { logout } = useMyFirebase();


const router = useRouter();

function goToNewForm() {
  const newFormId = computed(() => v4());
  router.push({
    name: "dashboard-forms-n-newFormId",
    params: { newFormId: newFormId.value },
  });
}
const colorMode = useColorMode();

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set() {
    colorMode.preference = colorMode.value === "dark" ? "light" : "dark";
  },
});

const links = ref([
  { name: "Dashboard", to: "dashboard" },
  { name: "Forms", to: "dashboard-forms" },
  { name: "Profile", to: "dashboard-profile" },
]);

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

const r = useRoute();
// console.log(r);
</script>

<style scoped></style>
