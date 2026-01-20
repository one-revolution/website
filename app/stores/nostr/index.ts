import { defineStore } from 'pinia'
import type { Event, Filter } from 'nostr-tools'
import { SimplePool, validateEvent } from 'nostr-tools'

export const useNostrStore = defineStore('nostr', () => {
  const config = useRuntimeConfig()
  const pool = new SimplePool()
  const initialized = ref(false)
  const relayUrls = ref([...(config.public.DEFAULT_RELAY_URLS as string[])])

  async function initialize() {
    if (initialized.value) return
    console.log('Initializing Nostr pool...')
    initialized.value = true
  }

  function subscribe(filter: Filter, onEvent: (event: Event) => void, onEose?: () => void) {
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
