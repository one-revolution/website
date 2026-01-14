<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()
</script>

<template>
  <div v-if="!collapsed" class="flex items-center">
    <nuxt-link to="/">
      <nuxt-img
        src="/one-revolution/logo_rdwi0t"
        alt="One Revolution"
        width="150"
        height="75"
      />
    </nuxt-link>
  </div>

  <div v-else class="flex items-center">
    <nuxt-link to="/">
      <nuxt-img
        src="/one-revolution/favicon_zjginw"
        alt="One Revolution"
        width="50"
        height="50"
      />
    </nuxt-link>
  </div>
</template>

<style scoped></style>
