import { defineStore } from 'pinia'
import NDK from '@nostr-dev-kit/ndk'

const CLIENT_NAME = 'one-revolution'
const DEFAULT_EXPLICIT_RELAY_URLS = [
  'wss://relay.damus.io',
  'wss://relay.primal.net',
  'wss://relay.threenine.services',
  'wss://nos.lol',
  'wss://relay.nostr.band'
]
const DEFAULT_OUTBOX_RELAY_URLS = [
  'wss://purplepag.es',
  'wss://relay.primal.net'
]

function createNdkInstance(explicitRelayUrls: string[], outboxRelayUrls: string[]) {
  return new NDK({
    explicitRelayUrls,
    outboxRelayUrls,
    clientName: CLIENT_NAME
  })
}

export const useNDKStore = defineStore('ndk', () => {
  // State
  const initialized = ref(false)
  const explicitRelayUrls = ref([...DEFAULT_EXPLICIT_RELAY_URLS])
  const instance = ref<NDK | null>(null)

  // Getters (computed)
  const ndk = computed(() => {
    if (!instance.value) {
      throw new Error('NDK instance not initialized')
    }
    return instance.value
  })

  // Actions
  async function initialize() {
    if (instance.value) return

    console.log('Initializing NDK...')
    const ndkInstance = createNdkInstance(explicitRelayUrls.value, DEFAULT_OUTBOX_RELAY_URLS)

    try {
      await ndkInstance.connect()
      console.log('NDK connected successfully')
    } catch (error) {
      console.error('Failed to connect to NDK relays:', error)
    }

    instance.value = ndkInstance
    initialized.value = true
  }

  async function close() {
    instance.value = null
    initialized.value = false
  }

  return {
    initialized,
    explicitRelayUrls,
    instance,
    ndk,
    initialize,
    close
  }
})
