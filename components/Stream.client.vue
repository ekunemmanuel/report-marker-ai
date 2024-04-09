<template>
  <div>stream data {{ user }}</div>
</template>

<script lang="ts" setup>
import type { User } from "~/types";

const user = useUser();

const { eventSource } = useEventSource(
  `${location.origin}/api/v1/users/${user.value?.uId}`,
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
  const data = JSON.parse(event.data);

  user.value = {
    uId: data.uId,
    name: data.name,
    email: data.email,
  };
  console.log(data);

  // Update UI or perform actions based on the received data
};

eventSource.value!.onopen = function (event) {
  console.log("SSE connection opened");
};

onBeforeUnmount(() => {
  eventSource.value!.close();
  console.log("SSE connection closed");
});
</script>

<style scoped></style>
