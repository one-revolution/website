<script setup lang="ts">
import { format, isToday } from 'date-fns'
import type { Article } from '~/types'

defineProps<{
  articles: Article[]
}>()

const articlesRefs = ref<Record<string, Element>>({})

const selectedArticle = defineModel<Article | undefined>()

const selectArticle = (article: Article) => {
  selectedArticle.value = article
}

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
  <div class="overflow-y-auto divide-y divide-default flex-1 h-full min-h-0">
    <div
      v-if="articles.length === 0"
      class="p-4 text-center text-dimmed"
    >
      <u-card
        v-for="n in 10"
        :key="n"
        variant="subtle"
        class="shrink-0 mt-2"
      >
        <div class="flex items-center justify-center h-12">
          <u-skeleton class=" h-4 w-5 rounded-full mr-3" /> <u-skeleton class="h-3 w-96 rounded" />
        </div>
        <div class="mt-1">
          <u-skeleton class="h-2 w-96 rounded" />
        </div>
        <div class="mt-1">
          <u-skeleton class="h-1 w-96 rounded" />
          <u-skeleton class="h-1 w-96 rounded" />
        </div>
      </u-card>
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
        @click="selectArticle(article)"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <img
              v-if="article.author?.image"
              :src="article.author.image"
              :alt="article.author.name || article.author.display_name || 'Anonymous'"
              class="w-6 h-6 rounded-full"
            >
            <span class="font-medium text-foreground">
              {{ article.author?.display_name || article.author?.name || 'Anonymous' }}
            </span>
          </div>

          <span class="text-dimmed">{{ isToday(new Date(article.date)) ? format(new Date(article.date), 'HH:mm') : format(new Date(article.date), 'dd MMM') }}</span>
        </div>
        <p class="truncate font-semibold text-foreground">
          {{ article.title || '(No Title)' }}
        </p>
        <p class="text-dimmed line-clamp-1">
          {{ article.summary || '(No Summary)' }}
        </p>
      </div>
    </div>
  </div>
</template>
