<template>
    <UApp>
      <NuxtRouteAnnouncer />
      <NuxtLoadingIndicator />
      <UMain>
        <NuxtLayout>
          <NuxtPage/>
        </NuxtLayout>
      </UMain>
    </UApp>
</template>
<script setup lang="ts">
const colorMode = useColorMode()
const color = computed(() => colorMode.value === 'dark' ? 'dark' : 'light')


const title = 'One Revolution'
const description = ''
useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
  twitterImage: 'https://ui.nuxt.com/assets/templates/nuxt/dashboard-light.png',
  twitterCard: 'summary_large_image'
})
</script>
