import { defineStore } from 'pinia'
import { useNostrStore } from './nostr'
import type { Event } from 'nostr-tools'

export interface UserProfile {
  pubkey: string
  name?: string
  display_name?: string
  picture?: string
  about?: string
  nip05?: string
}

export const useUserStore = defineStore('user', () => {
  const nostrStore = useNostrStore()
  const pubkey = ref<string | null>(null)
  const profile = ref<UserProfile | null>(null)
  const isLoggingIn = ref(false)

  const isAuthenticated = computed(() => !!pubkey.value)

  async function login() {
    if (typeof window === 'undefined' || !window.nostr) {
      throw new Error('No NIP-07 extension found')
    }

    isLoggingIn.value = true
    try {
      const pk = await window.nostr.getPublicKey()
      pubkey.value = pk
      localStorage.setItem('nostr_pubkey', pk)
      await fetchProfile(pk)
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    } finally {
      isLoggingIn.value = false
    }
  }

  function logout() {
    pubkey.value = null
    profile.value = null
    localStorage.removeItem('nostr_pubkey')

    const route = useRoute()
    if (route.path.startsWith('/settings')) {
      navigateTo('/')
    }

    const toast = useToast()
    toast.add({
      title: 'Signed out',
      description: 'You have been successfully signed out.',
      color: 'success'
    })
  }

  async function fetchProfile(pk: string) {
    nostrStore.subscribe(
      { kinds: [0], authors: [pk], limit: 1 },
      (event: Event) => {
        try {
          const content = JSON.parse(event.content)
          profile.value = {
            pubkey: pk,
            name: content.name,
            display_name: content.display_name,
            picture: content.picture,
            about: content.about,
            nip05: content.nip05
          }
        } catch (e) {
          console.error('Failed to parse profile content', e)
        }
      }
    )
  }

  // Initialize pubkey and profile if in browser
  onMounted(() => {
    const storedPubkey = localStorage.getItem('nostr_pubkey')
    if (storedPubkey) {
      pubkey.value = storedPubkey
      fetchProfile(storedPubkey)
    }
  })

  return {
    pubkey,
    profile,
    isLoggingIn,
    isAuthenticated,
    login,
    logout
  }
})
