<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'
import { useUserStore } from '~/stores/user'
import { profileService } from '~/services/profileService'

const userStore = useUserStore()
const toast = useToast()
const isSaving = ref(false)

const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  display_name: z.string().optional(),
  about: z.string().optional(),
  picture: z.string().optional(),
  nip05: z.string().optional(),
  lud16: z.string().optional(),
  website: z.string().url('Invalid URL').or(z.literal('')).optional(),
  banner: z.string().optional()
})

type ProfileSchema = z.output<typeof profileSchema>

const state = reactive<ProfileSchema>({
  name: '',
  display_name: '',
  about: '',
  picture: '',
  nip05: '',
  lud16: '',
  website: '',
  banner: ''
})

// Sync state with userStore.profile
watchEffect(() => {
  if (userStore.profile) {
    state.name = userStore.profile.name || ''
    state.display_name = userStore.profile.display_name || ''
    state.about = userStore.profile.about || ''
    state.picture = userStore.profile.picture || ''
    state.nip05 = userStore.profile.nip05 || ''
    state.lud16 = userStore.profile.lud16 || ''
    state.website = userStore.profile.website || ''
    state.banner = userStore.profile.banner || ''
  }
})

async function onSubmit(event: FormSubmitEvent<ProfileSchema>) {
  if (!userStore.pubkey) {
    toast.add({
      title: 'Error',
      description: 'You must be signed in to update your profile.',
      color: 'error'
    })
    return
  }

  isSaving.value = true
  try {
    await profileService.updateProfile(userStore.pubkey, event.data)
    toast.add({
      title: 'Success',
      description: 'Your profile has been updated.',
      icon: 'i-lucide-check',
      color: 'success'
    })
  } catch (error: unknown) {
    toast.add({
      title: 'Error',
      description: error instanceof Error ? error.message : 'Failed to update profile.',
      color: 'error'
    })
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <UForm
    id="settings"
    :schema="profileSchema"
    :state="state"
    @submit="onSubmit"
  >
    <UPageCard
      title="Profile"
      description="Public information you would like to share."
      variant="naked"
      orientation="horizontal"
      class="mb-4"
    >
      <UButton
        form="settings"
        label="Save changes"
        color="neutral"
        type="submit"
        :loading="isSaving"
        class="w-fit lg:ms-auto"
      />
    </UPageCard>

    <UPageCard variant="subtle">
      <UFormField
        name="name"
        label="Username"
        description="Public username."
        required
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="state.name"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="display_name"
        label="Display Name"
        description="Full name or alias shown on your profile."
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="state.display_name"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="picture"
        label="Avatar URL"
        description="URL to your profile picture."
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="state.picture"
          class="w-full"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="banner"
        label="Banner URL"
        description="URL to your profile banner image."
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="state.banner"
          class="w-full"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="nip05"
        label="NIP-05 ID"
        description="Nostr ID for verification (e.g. user@domain.com)."
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="state.nip05"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="lud16"
        label="Lightning Address"
        description="Lightning Address for tips (e.g. user@getalby.com)."
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="state.lud16"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="website"
        label="Website"
        description="Your personal or professional website URL."
        class="flex max-sm:flex-col justify-between items-start gap-4"
      >
        <UInput
          v-model="state.website"
          autocomplete="off"
        />
      </UFormField>
      <USeparator />
      <UFormField
        name="about"
        label="Bio"
        description="Brief description for your profile."
        class="flex max-sm:flex-col justify-between items-start gap-4"
        :ui="{ container: 'w-full' }"
      >
        <UTextarea
          v-model="state.about"
          :rows="5"
          autoresize
          class="w-full"
        />
      </UFormField>
    </UPageCard>
  </UForm>
</template>
