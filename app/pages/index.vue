<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { breakpointsTailwind } from '@vueuse/core'
import type { Article } from '~/types'
import { useFeedStore } from '~/stores/feed/feedStore'
import { useNDKStore } from '~/stores/ndk'

const feedStore = useFeedStore()
const ndkStore = useNDKStore()

onMounted(async () => {
  await ndkStore.initialize()
  feedStore.getFeed()
})

const articles = computed(() => feedStore.Articles)

const selectedArticle = ref<Article | null>(null)

const isArticlePanelOpen = computed({
  get() {
    return !!selectedArticle.value
  },
  set(value: boolean) {
    if (!value) {
      selectedArticle.value = null
    }
  }
})

const breakpoints = useBreakpoints(breakpointsTailwind)
const isMobile = breakpoints.smaller('lg')
</script>

<template>
  <UDashboardPanel
    id="inbox-1"
    :default-size="25"
    :min-size="20"
    :max-size="30"
    resizable
  >
    <UDashboardNavbar title="General">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      <template #trailing>
        <UBadge :label="articles.length" variant="subtle" />
      </template>
    </UDashboardNavbar>
    <ArticleList v-model="selectedArticle" :articles="articles" />
  </UDashboardPanel>

  <ArticleView v-if="selectedArticle" :article="selectedArticle" @close="selectedArticle = null" />
  <div v-else class="hidden lg:flex flex-1 items-center justify-center">
    <UIcon name="material-symbols:article-outline" class="size-32 text-dimmed" />
  </div>

  <ClientOnly>
    <USlideover v-if="isMobile" v-model:open="isArticlePanelOpen">
      <template #content>
        <ArticleView v-if="selectedArticle" :article="selectedArticle" @close="selectedArticle = null" />
      </template>
    </USlideover>
  </ClientOnly>
</template>
