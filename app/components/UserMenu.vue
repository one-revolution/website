<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'
import { useUserStore } from '~/stores/user'

defineProps<{
  collapsed?: boolean
}>()

const userStore = useUserStore()
const colorMode = useColorMode()

const user = computed(() => ({
  name: userStore.profile?.display_name || userStore.profile?.name || 'Anonymous',
  avatar: {
    src: userStore.profile?.picture || undefined,
    alt: userStore.profile?.display_name || userStore.profile?.name || 'Anonymous'
  }
}))

const items = computed<DropdownMenuItem[][]>(() => {
  if (!userStore.isAuthenticated) {
    return [[{
      label: 'Sign In',
      icon: 'i-lucide-log-in',
      onSelect() {
        userStore.login()
      }
    }]]
  }

  return [[{
    type: 'label',
    label: user.value.name,
    avatar: user.value.avatar
  }], [{
    label: 'Profile',
    icon: 'i-lucide-user',
    to: '/settings'
  }], [{
    label: 'Appearance',
    icon: 'i-lucide-sun-moon',
    children: [{
      label: 'Light',
      icon: 'i-lucide-sun',
      type: 'checkbox',
      checked: colorMode.value === 'light',
      onSelect(e: Event) {
        e.preventDefault()
        colorMode.preference = 'light'
      }
    }, {
      label: 'Dark',
      icon: 'i-lucide-moon',
      type: 'checkbox',
      checked: colorMode.value === 'dark',
      onUpdateChecked(checked: boolean) {
        if (checked) {
          colorMode.preference = 'dark'
        }
      },
      onSelect(e: Event) {
        e.preventDefault()
      }
    }]
  }], [{
    label: 'Sign Out',
    icon: 'i-lucide-log-out',
    onSelect() {
      userStore.logout()
    }
  }]]
})
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <template #item="{ item }">
      <div v-if="item.type === 'label'" class="flex items-center gap-2 px-2 py-1.5">
        <SmartAvatar :src="item.avatar?.src" :alt="item.avatar?.alt" :size="20" />
        <span class="text-sm font-medium truncate">{{ item.label }}</span>
      </div>

      <div v-else>
        <!-- fall back to default rendering or your own -->
        <icon :name="item.icon" /> {{ item.label }}
      </div>
    </template>
    <UButton
      v-bind="{
        ...user,
        label: collapsed ? undefined : (userStore.isAuthenticated ? user?.name : 'Sign In'),
        trailingIcon: collapsed ? undefined : (userStore.isAuthenticated ? 'i-lucide-chevrons-up-down' : undefined),
        icon: !userStore.isAuthenticated && collapsed ? 'i-lucide-log-in' : undefined
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      :loading="userStore.isLoggingIn"
      class="data-[state=open]:bg-elevated"
      :ui="{
        trailingIcon: 'text-dimmed'
      }"
      @click="!userStore.isAuthenticated && userStore.login()"
    >
      <template #leading>
        <SmartAvatar
          v-if="userStore.isAuthenticated"
          :src="user.avatar.src"
          :alt="user.avatar.alt"
          :size="24"
          class="shrink-0"
        />
      </template>
    </UButton>

    <template #chip-leading="{ item }: { item: DropdownMenuItem & { chip?: string } }">
      <div class="inline-flex items-center justify-center shrink-0 size-5">
        <span
          class="rounded-full ring ring-bg bg-(--chip-light) dark:bg-(--chip-dark) size-2"
          :style="{
            '--chip-light': item.chip ? `var(--color-${item.chip}-500)` : undefined,
            '--chip-dark': item.chip ? `var(--color-${item.chip}-400)` : undefined
          }"
        />
      </div>
    </template>
  </UDropdownMenu>
</template>
