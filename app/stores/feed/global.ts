import { defineStore } from 'pinia'
import { NDKKind } from '@nostr-dev-kit/ndk'
import type { NDKEvent } from '@nostr-dev-kit/ndk'
import type { Article, Author } from '~/types'
import { useNdkSubscription } from '~/composables/useNdkSubscription'

export const useGlobalFeedStore = defineStore('global-feed', () => {
  const articlesMap = ref(new Map<string, Article>())
  const { subscribe } = useNdkSubscription()

  const Articles = computed(() => new Set(articlesMap.value.values()))

  function mapEventToArticle(event: NDKEvent): Article {
    const title = event.getMatchingTags('title')[0]?.[1] || ''
    const summary = event.getMatchingTags('summary')[0]?.[1] || ''
    const image = event.getMatchingTags('image')[0]?.[1] || ''
    const publishedAt = event.getMatchingTags('published_at')[0]?.[1]
    const published = publishedAt ? new Date(Number.parseInt(publishedAt) * 1000) : new Date(event.created_at! * 1000)
    const dTag = event.getMatchingTags('d')[0]?.[1] || event.id

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
      date: new Date(event.created_at! * 1000).toISOString(),
      image,
      tags: event.getMatchingTags('t').map(t => t[1] as string),
      published,
      author
    }
  }

  function getFeed(follows?: string[]) {
    const sub = subscribe([NDKKind.Article], follows)

    sub.on('event', (event: NDKEvent) => {
      const article = mapEventToArticle(event)
      articlesMap.value.set(article.id, article)
    })

    return sub
  }

  return {
    Articles,
    getFeed
  }
})
