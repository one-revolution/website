<script setup lang="ts">
import { format } from 'date-fns'
import type { Article } from '~/types'

const props = defineProps<{
  article: Article
}>()

const emits = defineEmits(['close'])

const dropdownItems = [[{
  label: 'Mark as unread',
  icon: 'i-lucide-check-circle'
}, {
  label: 'Mark as important',
  icon: 'i-lucide-triangle-alert'
}], [{
  label: 'Star thread',
  icon: 'i-lucide-star'
}, {
  label: 'Mute thread',
  icon: 'i-lucide-circle-pause'
}]]

const toast = useToast()

const reply = ref('')
const loading = ref(false)

function onSubmit() {
  loading.value = true

  setTimeout(() => {
    reply.value = ''

    toast.add({
      title: 'Reply sent',
      description: 'Your reply has been sent successfully',
      icon: 'i-lucide-check-circle',
      color: 'success'
    })

    loading.value = false
  }, 1000)
}
</script>

<template>
  <UDashboardPanel id="inbox-2">
    <UDashboardNavbar :title="article.title" :toggle="false">
      <template #leading>
        <UButton
          icon="i-lucide-x"
          color="neutral"
          variant="ghost"
          class="-ms-1.5"
          @click="emits('close')"
        />
      </template>

      <template #right>
        <UTooltip text="Bookmark">
          <UButton
            icon="material-symbols:bookmark-add"
            color="neutral"
            variant="ghost"
          />
        </UTooltip>

        <UTooltip text="Comments">
          <UButton icon="mdi:comment-text-multiple-outline" color="neutral" variant="ghost" />
        </UTooltip>

        <UDropdownMenu :items="dropdownItems">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
          />
        </UDropdownMenu>
      </template>
    </UDashboardNavbar>

    <div class="flex flex-col sm:flex-row justify-between gap-1 p-4 sm:px-6 border-b border-default">
      <div class="flex items-start gap-4 sm:my-1.5">
        <img
          v-if="article.author?.image"
          :src="article.author.image"
          :alt="article.author.name || article.author.display_name"
          class="w-10 h-10 rounded-full"
        >

        <div class="min-w-0">
          <p class="font-semibold text-highlighted">
            <span>{{ article.author.display_name || 'Anonymous' }}</span> <span class="text-muted text-xs italic">{{ article.author.npub }}</span>
          </p>
          <p class="text-muted text-sm line-clamp-1">
            {{ article.author.about }}
          </p>
        </div>
      </div>

      <p class="max-sm:pl-16 text-muted text-sm sm:mt-2">
        {{ format(new Date(article.date), 'dd MMM HH:mm') }}
      </p>
    </div>

    <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
      <MDC :value="props.article.content" tag="article" />
    </div>

    <div class="pb-4 px-4 sm:px-6 shrink-0">
      <UCard variant="subtle" class="mt-auto" :ui="{ header: 'flex items-center gap-1.5 text-dimmed' }">
        <template #header>
          <UIcon name="material-symbols:add-comment-outline" class="size-5" />

          <span class="text-sm truncate">
            {{ article.title }}
          </span>
        </template>

        <form @submit.prevent="onSubmit">
          <UTextarea
            v-model="reply"
            color="neutral"
            variant="none"
            required
            autoresize
            placeholder="Have your say..."
            :rows="4"
            :disabled="loading"
            class="w-full"
            :ui="{ base: 'p-0 resize-none' }"
          />

          <div class="flex items-center justify-end">
            <div class="flex items-center justify-end gap-2">
              <UButton
                type="submit"
                color="primary"
                :loading="loading"
                label="Post"
                icon="material-symbols:add-comment-outline"
              />
            </div>
          </div>
        </form>
      </UCard>
    </div>
  </UDashboardPanel>
</template>
