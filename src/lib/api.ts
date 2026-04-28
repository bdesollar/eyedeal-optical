import { supabase } from './supabase'
import type { Product, Appointment, ContactForm } from '../types'

export async function getProducts(category?: Product['category']) {
  let query = supabase.from('products').select('*').eq('in_stock', true)
  if (category) query = query.eq('category', category)
  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw error
  return data as Product[]
}

export async function getProduct(id: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as Product
}

export async function submitAppointment(appointment: Omit<Appointment, 'id' | 'status' | 'created_at'>) {
  const { error } = await supabase.from('appointments').insert({ ...appointment, status: 'pending' })
  if (error) throw error
}

export async function submitContactForm(form: ContactForm, source: 'homepage' | 'contact_page' = 'contact_page') {
  const { error } = await supabase.from('contact_submissions').insert({
    name: form.name,
    email: form.email,
    phone: form.phone?.trim() || null,
    message: form.message,
    source,
  })
  if (error) throw error
}

export async function logPageVisit(payload: {
  path: string
  referrer: string | null
  userAgent: string | null
  visitorKey: string | null
}) {
  const { error } = await supabase.from('page_visits').insert({
    path: payload.path,
    referrer: payload.referrer,
    user_agent: payload.userAgent,
    visitor_key: payload.visitorKey,
  })
  if (error) console.warn('logPageVisit', error.message)
}

export type SiteChatCategory =
  | 'greeting'
  | 'thanks'
  | 'goodbye'
  | 'insurance'
  | 'appointment'
  | 'hours'
  | 'contact'
  | 'about'
  | 'services'
  | 'help'
  | 'fallback'

export async function saveSiteChatLog(row: {
  userMessage: string
  assistantReply: string
  category: SiteChatCategory
  path: string
  visitorKey: string | null
}) {
  const { error } = await supabase.from('site_chat_log').insert({
    user_message: row.userMessage,
    assistant_reply: row.assistantReply,
    category: row.category,
    path: row.path,
    visitor_key: row.visitorKey,
  })
  if (error) console.warn('saveSiteChatLog', error.message)
}
