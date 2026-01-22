import type { Event } from 'nostr-tools'
import { useNostrStore } from '~/stores/nostr'

export interface ProfileData {
  name?: string
  display_name?: string
  about?: string
  picture?: string
  nip05?: string
  lud16?: string
  website?: string
  banner?: string
}

export const profileService = {
  async updateProfile(pubkey: string, profile: ProfileData): Promise<void> {
    if (typeof window === 'undefined' || !window.nostr) {
      throw new Error('NIP-07 extension not found')
    }

    const nostrStore = useNostrStore()

    const event = {
      kind: 0,
      pubkey: pubkey,
      created_at: Math.floor(Date.now() / 1000),
      tags: [],
      content: JSON.stringify(profile)
    }

    const signedEvent: Event = await window.nostr.signEvent(event as unknown as Event)

    await Promise.all(
      nostrStore.relayUrls.map(async (url) => {
        try {
          await nostrStore.pool.publish([url], signedEvent)
        } catch (err) {
          console.error(`Failed to publish to ${url}`, err)
        }
      })
    )
  }
}
