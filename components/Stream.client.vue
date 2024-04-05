<template>
  <div>stream data {{ user }}</div>
</template>

<script lang="ts" setup>
import type { User } from "~/types";

const user = useUser();

const { eventSource } = useEventSource(
  `http://localhost:3000/api/v1/${user.value?.uId}`,
  ["notice", "update"] as const,
  {
    autoReconnect: {
      retries: 3,
      delay: 1000,
      onFailed() {},
    },
  }
);

eventSource.value!.onmessage = function (event) {
  const data = JSON.parse(event.data) as User;

  user.value = data;

  console.log(data);

  // Update UI or perform actions based on the received data
};

eventSource.value!.onopen = function (event) {
  console.log("SSE connection opened");
};

onBeforeUnmount(() => {
  eventSource.value!.close();
});
</script>

<style scoped></style>
