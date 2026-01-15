import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { NDKKind, NDKArticle } from '@nostr-dev-kit/ndk'
import type { NDKEvent, NDKUserProfile } from '@nostr-dev-kit/ndk'
import type { Article } from '~/types'
import { useNdkSubscription } from '~/composables/useNdkSubscription'
import { mapArticle } from '~/utils/nostr'

export const useFeedStore = defineStore('feed-store', () => {
  const articles = ref<Article[]>([])
  const { subscribe } = useNdkSubscription()

  const Articles = computed(() => {
    return articles.value
  })

  function getFeed(follows?: string[]) {
    const sub = subscribe([NDKKind.Article], follows)

    sub.on('event',  (event: NDKEvent) => {
      // 1. Check for duplicate event
      console.log('Received event:', event)
      if (articles.value.some(a => a.id === event.id)) {
        return
      }

      // 2. Check publishStatus
      // @ts-ignore - publishStatus might not be in the NDKEvent type definition but is requested
      if (event.publishStatus !== 'success') {
        return
      }

      try {
        // 3. Get the author profile
       // const profile = await event.author.fetchProfile()
        const author = event.author

        console.log(author.npub)

       // if (!profile) return

        // 4. Map to Article type
        const article = mapArticle(NDKArticle.from(event), {} as NDKUserProfile)

        // Update articles list
        articles.value = [...articles.value, article]
      } catch (err) {
        console.error('Error processing event:', err)
      }
    })

    sub.on('eose', () => {
      console.log('--- EOSE REACHED ---')
    })

    return sub
  }

  return {
    Articles,
    getFeed
  }
})
