import type { Event } from 'nostr-tools'
import type { Article, Author } from '~/types'

export function mapArticle(event: Event, profile: Record<string, string | number | boolean | null> | undefined): Article {
  return {
    id: event.id,
    pubkey: event.pubkey,
    title: getTitleFromTags(event.tags) || '',
    summary: getSummaryFromTags(event.tags) || '',
    content: event.content || '',
    date: event.created_at ? new Date(event.created_at * 1000).toISOString() : '',
    image: getImageFromTags(event.tags) || '',
    tags: getTopicTagsFromTags(event.tags) || [],
    published: event.created_at ? new Date(event.created_at * 1000) : new Date(),
    author: mapAuthor(profile)
  }
}

export function mapAuthor(profile: Record<string, string | number | boolean | null> | undefined): Author {
  return {
    name: String(profile?.name || ''),
    avatar: String(profile?.image || profile?.picture || ''),
    npub: '', // We can compute this if needed, but it was String(profile.npub) before
    displayName: String(profile?.displayName || profile?.display_name || ''),
    lightning: String(profile?.lud16 || ''),
    lnUrl: String(profile?.lnurl || ''),
    website: getWebsiteLink(String(profile?.website || '')),
    about: String(profile?.about || '')
  }
}

function getTitleFromTags(tags: string[][]): string {
  const titleTag = tags.find(tag => tag[0] === 'title')
  return titleTag?.[1] || ''
}

function getImageFromTags(tags: string[][]): string {
  const imageTag = tags.find(tag => tag[0] === 'image')
  return imageTag?.[1] || ''
}

function getSummaryFromTags(tags: string[][]): string {
  const summaryTag = tags.find(tag => tag[0] === 'summary')
  return summaryTag?.[1] || ''
}

function getTopicTagsFromTags(tags: string[][]): string[] {
  return tags
    .filter(tag => tag[0] === 't')
    .map(tag => tag[1]?.toLowerCase() as string)
    .filter(Boolean)
}

function getWebsiteLink(website: string | undefined): string {
  if (website === undefined || website === '') return ''
  if (website.startsWith('https://') || website.startsWith('http://')) return website
  return 'https://' + website
}
