import type { AvatarProps } from '@nuxt/ui'

export type UserStatus = 'subscribed' | 'unsubscribed' | 'bounced'

export const subscriptionOptions = {
  closeOnEose: false,
  groupable: false,
  includeSelf: true
}

export interface Author {
  name: string
  avatar: string
  npub: string
  displayName: string
  lightning: string
  lnUrl: string
  website: string
  about: string
}
export interface Article {
  id: string
  pubkey: string
  title: string
  summary: string
  content: string
  date: string
  image: string
  tags: string[]
  published: Date
  author: Author
}

export interface User {
  id: number
  name: string
  email: string
  avatar?: AvatarProps
  status: UserStatus
  location: string
}

export interface Mail {
  id: number
  unread?: boolean
  from: User
  subject: string
  body: string
  date: string
}

export interface Member {
  name: string
  username: string
  role: 'member' | 'owner'
  avatar: AvatarProps
}

export interface Notification {
  id: number
  unread?: boolean
  sender: User
  body: string
  date: string
}
