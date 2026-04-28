import type { SiteChatCategory } from './api'

export const SITE_CHAT_TOPIC: Record<SiteChatCategory, string> = {
  greeting: 'Greeting',
  thanks: 'Thanks',
  goodbye: 'Goodbye',
  insurance: 'Insurance',
  appointment: 'Appointments',
  hours: 'Hours',
  contact: 'Contact & location',
  about: 'About the studio',
  services: 'Services & products',
  help: 'How to use chat',
  fallback: 'Other / no match',
}

export function siteChatLabel(category: string): string {
  return SITE_CHAT_TOPIC[category as SiteChatCategory] ?? category
}
