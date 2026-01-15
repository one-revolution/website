import type { NDKArticle, NDKUserProfile, NDKTag } from '@nostr-dev-kit/ndk'
import type { Article, Author } from '~/types'

export function mapArticle(event: NDKArticle, profile: NDKUserProfile): Article {
  const tags = event.tags as NDKTag[]

  return {
    id: event.id,
    pubkey: event.pubkey,
    title: getTitleFromTags(tags) || '',
    summary: getSummaryFromTags(tags) || '',
    content: event.content || '',
    date: event.created_at ? new Date(event.created_at * 1000).toISOString() : '',
    image: getImageFromTags(tags) || '',
    tags: getTopicTagsFromTags(event) || [],
    published: event.created_at ? new Date(event.created_at * 1000) : new Date(),
    author: mapAuthor(profile)
  }
}

export function mapAuthor(profile: NDKUserProfile): Author {
  return {
    name: profile.name || '',
    avatar: profile.image || '',
    npub: String(profile.npub || ''),
    displayName: profile.displayName || '',
    lightning: profile.lud16 || '',
    lnUrl: String(profile.lnurl || ''),
    website: getWebsiteLink(profile.website),
    about: profile.about || ''
  }
}

function getTitleFromTags(tags: NDKTag[]): string {
  const titleTag = tags.find(tag => tag[0] === 'title')
  return titleTag?.[1] || ''
}

function getImageFromTags(tags: NDKTag[]): string {
  const imageTag = tags.find(tag => tag[0] === 'image')
  return imageTag?.[1] || ''
}

function getSummaryFromTags(tags: NDKTag[]): string {
  const summaryTag = tags.find(tag => tag[0] === 'summary')
  return summaryTag?.[1] || ''
}

function getTopicTagsFromTags(article: NDKArticle): string[] {
  const articleTags = article.getMatchingTags('t')
  return articleTags
    .map(tag => tag[1]?.toLowerCase() as string)
    .filter(Boolean)
}

function getWebsiteLink(website: string | undefined): string {
  if (website === undefined || website === '') return ''
  if (website.startsWith('https://') || website.startsWith('http://')) return website
  return 'https://' + website
}
