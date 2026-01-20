import {defineStore} from 'pinia'
import type {Event, Filter} from 'nostr-tools'
import {SimplePool, validateEvent} from 'nostr-tools'

const DEFAULT_RELAY_URLS = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relay.threenine.services'
]

export const useNostrStore = defineStore('nostr', () => {
  const pool = new SimplePool()
  const initialized = ref(false)
  const relayUrls = ref([...DEFAULT_RELAY_URLS])

  async function initialize() {
    if (initialized.value) return
    console.log('Initializing Nostr pool...')
    initialized.value = true
  }

  function subscribe(filter: Filter, onEvent: (event: Event) => void, onEose?: () => void) {
    // @ts-expect-error - subscribeMany might have slightly different signature in some versions of nostr-tools
    return pool.subscribeMany(relayUrls.value, filter, {
      onevent(event: Event) {
        if (validateEvent(event)) {
          onEvent(event)
        }
      },
      oneose() {
        if (onEose) onEose()
      }
    })
  }

  async function close() {
    pool.close(relayUrls.value)
    initialized.value = false
  }

  return {
    initialized,
    relayUrls,
    pool,
    initialize,
    subscribe,
    close
  }
})
