<script setup lang="ts">
defineProps<{
  collapsed?: boolean
}>()
</script>

<template>
  <div class="p-5">
    <or-logo :collapsed="collapsed" />
  </div>

</template>
