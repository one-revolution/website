import type { NDKKind, NDKSubscriptionOptions, NDKFilter } from '@nostr-dev-kit/ndk'
import { subscriptionOptions as defaultOptions } from '~/types'
import { useNDKStore } from '~/stores/ndk'

export const useNdkSubscription = () => {
  const ndkStore = useNDKStore()

  const subscribe = (kinds: NDKKind[], follows?: string[], options?: NDKSubscriptionOptions) => {
    const ndk = ndkStore.getNDK()

    const filter: NDKFilter = { kinds }

    if (follows && follows.length > 0) {
      filter.authors = follows
    }

    const mergedOptions = {
      ...defaultOptions,
      ...options
    }

    return ndk.subscribe(filter, mergedOptions)
  }

  return {
    subscribe
  }
}
