import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import type {Article} from '~/types'
import {mapArticle} from '~/utils/nostr'
import {useNostrStore} from '~/stores/nostr'
import type {Event, Filter} from 'nostr-tools'

export const useFeedStore = defineStore('feed-store', () => {
  const articles = ref<Article[]>([])
  const nostrStore = useNostrStore()
  const profiles = ref<Record<string, Record<string, string | number | boolean | null>>>({})

  const Articles = computed(() => {
    return articles.value
  })

  function getFeed(follows?: string[]) {
    const filter: Filter = { kinds: [30023] }
    if (follows && follows.length > 0) {
      filter.authors = follows
    }

    return nostrStore.subscribe(filter, async (event: Event) => {
      console.log('Received event:', event)
      if (articles.value.some(a => a.id === event.id)) {
        return
      }

      // Fetch profile if not cached
      if (!profiles.value[event.pubkey]) {
        const profileEvents = await nostrStore.pool.querySync(nostrStore.relayUrls, {
          kinds: [0],
          authors: [event.pubkey]
        })
        if (profileEvents.length > 0 && profileEvents[0]) {
          try {
            profiles.value[event.pubkey] = JSON.parse(profileEvents[0].content)
          } catch (e) {
            console.error('Error parsing profile content', e)
          }
        }
      }

      const article = mapArticle(event, profiles.value[event.pubkey])
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
