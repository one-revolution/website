import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { NDKKind, NDKArticle } from '@nostr-dev-kit/ndk'
import type { NDKEvent, NDKUserProfile } from '@nostr-dev-kit/ndk'
import type { Article } from '~/types'
import { useNdkSubscription } from '~/composables/useNdkSubscription'
import { mapArticle } from '~/utils/nostr'

export const useGlobalFeedStore = defineStore('global-feed', () => {
  const articles = ref<Article[]>([])
  const { subscribe } = useNdkSubscription()

  const Articles = computed(() => {
    return articles.value
  })

  function getFeed(follows?: string[]) {
    const sub = subscribe([NDKKind.Article], follows)

    sub.on('event', (event: NDKEvent) => {
      // Map article with placeholder author first to show it immediately
      const placeholderProfile: Partial<NDKUserProfile> = {
        name: event.author.npub.substring(0, 10),
        image: ''
      }
      const initialArticle = mapArticle(NDKArticle.from(event), placeholderProfile as NDKUserProfile)

      const updateArticles = (article: Article) => {
        const index = articles.value.findIndex(a => a.id === article.id)
        if (index !== -1) {
          const newArticles = [...articles.value]
          newArticles[index] = article
          articles.value = newArticles
        } else {
          articles.value = [...articles.value, article]
        }
      }

      updateArticles(initialArticle)

      // Fetch profile asynchronously and update article once loaded
      event.author.fetchProfile().then((profile) => {
        if (!profile) return

        const updatedArticle = mapArticle(NDKArticle.from(event), profile as NDKUserProfile)
        updateArticles(updatedArticle)
      }).catch((err) => {
        console.error('Error fetching profile:', err)
      })
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
