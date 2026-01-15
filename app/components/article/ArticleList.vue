<script setup lang="ts">
import { format, isToday } from 'date-fns'
import type { Article } from '~/types'

defineProps<{
  articles: Article[]
}>()

const articlesRefs = ref<Record<string, Element>>({})

const selectedArticle = defineModel<Article | null>()

watch(selectedArticle, () => {
  if (!selectedArticle.value) {
    return
  }
  const ref = articlesRefs.value[selectedArticle.value.id]
  if (ref) {
    ref.scrollIntoView({ block: 'nearest' })
  }
})
</script>

<template>
  <div class="overflow-y-auto divide-y divide-default flex-1 h-full">
    <div
      v-if="articles.length === 0"
      class="p-4 text-center text-dimmed"
    >
      No articles found.
    </div>
    <div
      v-for="article in articles"
      :key="article.id"
      :ref="(el) => { if (el) articlesRefs[article.id] = el as Element }"
    >
      <div
        class="p-4 sm:px-6 text-sm cursor-pointer border-l-2 transition-colors"
        :class="[
          selectedArticle && selectedArticle.id === article.id
            ? 'border-primary bg-primary/10'
            : 'border-transparent hover:border-primary hover:bg-primary/5'
        ]"
        @click="selectedArticle = article"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <UAvatar
              v-if="article.author?.avatar"
              :src="article.author.avatar"
              :alt="article.author.name || article.author.displayName"
              size="xs"
            />
            <span class="font-medium">
              {{ article.author?.name || article.author?.displayName || 'Anonymous' }}
            </span>
          </div>

          <span>{{ isToday(new Date(article.date)) ? format(new Date(article.date), 'HH:mm') : format(new Date(article.date), 'dd MMM') }}</span>
        </div>
        <p class="truncate font-semibold">
          {{ article.title }}
        </p>
        <p class="text-dimmed line-clamp-1">
          {{ article.summary }}
        </p>
      </div>
    </div>
  </div>
</template>
