import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Article, Author } from '~/types'
import { mapArticle, mapAuthor } from '~/utils/nostr'
import { useNostrStore } from '~/stores/nostr'
import type { Event, Filter } from 'nostr-tools'

export const useFeedStore = defineStore('feed-store', () => {
  const articles = ref<Article[]>([])
  const nostrStore = useNostrStore()
  const profiles = ref<Author[]>([])

  const Articles = computed(() => {
    return articles.value
  })

  function getFeed(follows?: string[]) {
    const filter: Filter = { kinds: [30023] }
    if (follows && follows.length > 0) {
      filter.authors = follows
    }

    return nostrStore.subscribe(filter, async (event: Event) => {
      if (articles.value.some(a => a.id === event.id)) {
        return
      }

      // Fetch profile if not cached
      let author = profiles.value.find(p => p.pubkey === event.pubkey)
      if (!author) {
        const profileEvents = await nostrStore.pool.querySync(nostrStore.relayUrls, {
          kinds: [0],
          authors: [event.pubkey]
        })
        let profileData: Record<string, string | number | boolean | null> | undefined
        if (profileEvents.length > 0 && profileEvents[0]) {
          try {
            console.log('Parsing profile content:', profileEvents[0].content)
            profileData = JSON.parse(profileEvents[0].content)
          } catch (e) {
            console.error('Error parsing profile content', e)
          }
        }
        author = mapAuthor(event.pubkey, profileData)
        profiles.value.push(author)
      }

      const article = mapArticle(event, author)
      articles.value = [...articles.value, article].sort((a, b) => b.published.getTime() - a.published.getTime())
    }, () => {
      console.log('--- EOSE REACHED ---')
    })
  }

  return {
    Articles,
    getFeed
  }
})
