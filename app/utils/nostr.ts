import type { Event } from 'nostr-tools'
import type { Article, Profile } from '~/types'
import * as nip19 from 'nostr-tools/nip19'

export function mapArticle(event: Event, author: Profile): Article {
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
    author
  }
}

export function mapAuthor(pubkey: string, profile: Record<string, string | number | boolean | null> | undefined): Profile {
  return {
    pubkey,
    name: String(profile?.name || ''),
    image: String(profile?.picture || ''),
    display_name: String(profile?.displayName || profile?.display_name || profile?.name),
    lud16: String(profile?.lud16 || ''),
    nip05: String(profile?.nip05 || ''),
    website: getWebsiteLink(String(profile?.website || '')),
    about: String(profile?.about || ''),
    bot: Boolean(profile?.bot || false),
    npub: nip19.npubEncode(pubkey)
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
