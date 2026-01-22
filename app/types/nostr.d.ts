import type { Event } from 'nostr-tools'

interface NostrExtension {
  getPublicKey(): Promise<string>
  signEvent(event: Event): Promise<Event>
  getRelays?(): Promise<{ [url: string]: { read: boolean, write: boolean } }>
  nip04?: {
    encrypt(pubkey: string, plaintext: string): Promise<string>
    decrypt(pubkey: string, ciphertext: string): Promise<string>
  }
}

declare global {
  interface Window {
    nostr?: NostrExtension
  }
}

export {}
