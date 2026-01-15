import { defineStore } from 'pinia'
import { reactive, computed } from 'vue'
import { NDKKind } from '@nostr-dev-kit/ndk'
import type { NDKEvent } from '@nostr-dev-kit/ndk'
import type { Article, Author } from '~/types'
import { useNdkSubscription } from '~/composables/useNdkSubscription'

export const useGlobalFeedStore = defineStore('global-feed', () => {
  const articlesMap = reactive(new Map<string, Article>())
  const { subscribe } = useNdkSubscription()

  const Articles = computed(() => {
    return Array.from(articlesMap.values())
  })

  function mapEventToArticle(event: NDKEvent): Article {
    const title = event.tagValue('title') || ''
    const summary = event.tagValue('summary') || ''
    const image = event.tagValue('image') || ''
    const publishedAt = event.tagValue('published_at')
    const published = publishedAt ? new Date(Number.parseInt(publishedAt) * 1000) : (event.created_at ? new Date(event.created_at * 1000) : new Date())
    const dTag = event.tagValue('d') || event.id

    const author: Author = {
      name: event.author.profile?.name || '',
      avatar: event.author.profile?.image || '',
      npub: event.author.npub,
      displayName: event.author.profile?.displayName || '',
      lightning: event.author.profile?.lud16 || '',
      lnUrl: event.author.profile?.lud06 || '',
      website: event.author.profile?.website || '',
      about: event.author.profile?.about || ''
    }

    return {
      id: dTag,
      pubkey: event.pubkey,
      title,
      summary,
      content: event.content,
      date: event.created_at ? new Date(event.created_at * 1000).toISOString() : new Date().toISOString(),
      image,
      tags: event.getMatchingTags('t').map(t => t[1] as string),
      published,
      author
    }
  }

  function getFeed(follows?: string[]) {
    console.log('Initiating feed subscription', { follows })
    const sub = subscribe([NDKKind.Article], follows)

    sub.on('event', (event: NDKEvent) => {
      console.log('Received article event', event.id)
      const article = mapEventToArticle(event)
      articlesMap.set(article.id, article)

      // Fetch profile asynchronously without blocking
      event.author.fetchProfile().then(() => {
        console.log('Fetched profile for', event.pubkey)
        const updatedArticle = mapEventToArticle(event)
        articlesMap.set(updatedArticle.id, updatedArticle)
      }).catch((err) => {
        console.error('Error fetching profile:', err)
      })
    })

    sub.on('eose', () => {
      console.log('Subscription EOSE reached')
    })

    return sub
  }

  return {
    Articles,
    getFeed
  }
})
