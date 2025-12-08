<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const toast = useToast()
const open = ref(false)

const appLinks = [{
  label: 'Home',
  icon: 'i-lucide-house',
  to: '/',
  onSelect: () => {
    open.value = false
  }
}] satisfies NavigationMenuItem[]

const resourceLinks = [
  {
    label: 'Feedback',
    icon: 'i-lucide-message-circle',
    to: 'https://github.com/nuxt-ui-templates/dashboard',
    target: '_blank'
  }, {
    label: 'Help & Support',
    icon: 'i-lucide-info',
    to: 'https://github.com/nuxt-ui-templates/dashboard',
    target: '_blank'
  }
] satisfies NavigationMenuItem[]


</script>

<template>

<UDashboardGroup unit="rem">
 <UDashboardSidebar>
   <template #header="{ collapsed }">
     <logo class="h-6 w-auto" />
   </template>


   <template #default="{ collapsed}">
     <UNavigationMenu
         :collapsed="collapsed"
         :items="appLinks"
         orientation="vertical"
         tooltip
         popover
     />

     <UNavigationMenu
         :collapsed="collapsed"
         :items="resourceLinks"
         orientation="vertical"
         tooltip
         class="mt-auto"
     />
   </template>

   <template #footer>

   </template>


 </UDashboardSidebar>

      <slot/>


</UDashboardGroup>
</template>

<style scoped></style>
