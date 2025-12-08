<template>
  <div>
    <NuxtRouteAnnouncer/>
    <UApp>
      <UMain>
        <NuxtLayout>
          <NuxtPage/>
        </NuxtLayout>
      </UMain>
    </UApp>

  </div>
</template>
<script setup lang="ts">
const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')
</script>
