<script setup lang="ts">
const props = defineProps<{
  src?: string
  alt?: string
  size?: number // px
  class?: string
}>()

const CLOUDINARY_BASE = 'https://res.cloudinary.com/threenine-co-uk/image/upload/'

function isHttpUrl(v: string) {
  return /^https?:\/\//i.test(v)
}

function isCloudinary(v: string) {
  // full URL to your cloudinary base, OR a "public id/path" (no scheme)
  return v.startsWith(CLOUDINARY_BASE) || !isHttpUrl(v)
}

const normalizedCloudinaryPublicId = computed(() => {
  if (!props.src) return undefined
  if (props.src.startsWith(CLOUDINARY_BASE)) return props.src.slice(CLOUDINARY_BASE.length)
  return props.src
})

const shouldUseCloudinary = computed(() => !!props.src && isCloudinary(props.src))
</script>

<template>
  <div
    :class="['inline-flex items-center justify-center overflow-hidden rounded-full', props.class]"
    :style="props.size ? { width: `${props.size}px`, height: `${props.size}px` } : undefined"
  >
    <NuxtImg
      v-if="props.src && shouldUseCloudinary"
      provider="cloudinary"
      :src="normalizedCloudinaryPublicId"
      :alt="props.alt"
      :width="props.size"
      :height="props.size"
      fit="cover"
      class="h-full w-full object-cover"
    />
    <img
      v-else-if="props.src"
      :src="props.src"
      :alt="props.alt"
      referrerpolicy="no-referrer"
      class="h-full w-full object-cover"
    >
  </div>
</template>
