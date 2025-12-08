<script setup lang="ts">

import {useDashboard} from "#ui/utils/dashboard";

const { isNotificationsSlideoverOpen } = useDashboard()
const items = [[{
  label: 'New mail',
  icon: 'i-lucide-send',
  to: '/inbox'
}, {
  label: 'New customer',
  icon: 'i-lucide-user-plus',
  to: '/customers'
}]] satisfies DropdownMenuItem[][]
</script>

<template>
  <u-dashboard-panel id="home">
    <u-dashboard-navbar title="Home"  :ui="{ right: 'gap-3' }">
      <template #leading>
        <UDashboardSidebarCollapse />
      </template>
      <template #right>
        <UTooltip text="Notifications" :shortcuts="['N']">
          <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
          >
            <UChip color="error" inset>
              <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
            </UChip>
          </UButton>
        </UTooltip>

        <UDropdownMenu :items="items">
          <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
        </UDropdownMenu>
      </template>
    </u-dashboard-navbar>
  </u-dashboard-panel>
</template>

<style scoped></style>
