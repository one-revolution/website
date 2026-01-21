import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { Article, Profile } from '~/types'
import { mapArticle, mapAuthor } from '~/utils/nostr'
import { useNostrStore } from '~/stores/nostr'
import type { Event, Filter } from 'nostr-tools'

export const useFeedStore = defineStore('feed-store', () => {
  const articles = ref<Article[]>([])
  const store = useNostrStore()
  const profiles = ref<Profile[]>([])

  const Articles = computed(() => {
    return articles.value
  })

  async function fetchProfile(pubkey: string): Promise<Profile> {
    // Fetch profile if not cached
    let author = profiles.value.find(p => p.pubkey === pubkey)
    if (author) {
      return author
    }

    const profileEvents = await store.pool.querySync(store.relayUrls, {
      kinds: [0],
      authors: [pubkey]
    })

    let profileData: Record<string, string | number | boolean | null> | undefined
    if (profileEvents.length > 0 && profileEvents[0]) {
      try {
        profileData = JSON.parse(profileEvents[0].content)
      } catch (e) {
        console.error('Error parsing profile content', e)
      }
    }

    author = mapAuthor(pubkey, profileData)
    profiles.value.push(author)
    return author
  }

  function getFeed(follows?: string[]) {
    const filter: Filter = { kinds: [30023] }
    if (follows && follows.length > 0) {
      filter.authors = follows
    }

    return store.subscribe(filter, async (event: Event) => {
      if (articles.value.some(a => a.id === event.id)) {
        return
      }

      const author = await fetchProfile(event.pubkey)
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
