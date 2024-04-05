<template>
  <div class="grid grid-cols-[250px,1fr] h-screen duration-200">
    <Sidenav />
    <div class="p-[10px] h-screen overflow-y-auto">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
// const ro = useRouter();

// console.log(ro.getRoutes());
</script>

<style scoped></style>
