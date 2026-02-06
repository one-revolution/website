<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()
</script>

<template>
  <div class="p-2 mt-3">
    <div
      v-if="!collapsed"
      class="flex items-center"
    >
      <nuxt-link to="/">
        <SmartImage
          src="/one-revolution/logo_rdwi0t"
          alt="One Revolution"
          width="150"
          height="75"
        />
      </nuxt-link>
    </div>

    <div
      v-else
      class="flex items-center"
    >
      <nuxt-link to="/">
        <SmartImage
          src="/one-revolution/favicon_zjginw"
          alt="One Revolution"
          width="50"
          height="50"
        />
      </nuxt-link>
    </div>
  </div>
</template>

<style scoped></style>
