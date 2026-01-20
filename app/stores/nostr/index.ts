import { defineStore } from 'pinia'
import { SimplePool, verifyEvent, type Event, type Filter } from 'nostr-tools'

export const useNostrStore = defineStore('nostr', () => {
  const config = useRuntimeConfig()
  const pool = new SimplePool()
  const initialized = ref(false)
  const relayUrls = ref([...(config.public.DEFAULT_RELAY_URLS as string[])])

  async function initialize() {
    if (initialized.value) return
    initialized.value = true
  }

  function subscribe(filter: Filter, onEvent: (event: Event) => void, onEose?: () => void) {
    return pool.subscribeMany(relayUrls.value, filter, {
      onevent(event: Event) {
        if (verifyEvent(event)) {
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
