<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'
import { useNostrStore } from '~/stores/nostr'

const nostrStore = useNostrStore()
onMounted(() => {
  nostrStore.initialize()
})

const open = ref(false)

const links = [[{
  label: 'Home',
  icon: 'material-symbols:article-outline',
  to: '/',
  badge: '4',
  onSelect: () => {
    open.value = false
  }

}], []] satisfies NavigationMenuItem[][]
</script>

<template>
  <UDashboardGroup unit="rem">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      class="bg-elevated/25"
      :ui="{ footer: 'lg:border-t lg:border-default' }"
    >
      <template #header="{ collapsed }">
        <or-logo :collapsed="collapsed" />
      </template>

      <template #default="{ collapsed }">
        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          tooltip
          popover
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          class="mt-auto"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
      </template>
    </UDashboardSidebar>

    <slot />

    <NotificationsSlideover />
  </UDashboardGroup>
</template>
