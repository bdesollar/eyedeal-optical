import { supabase } from './supabase'
import type { Product, Appointment, ContactForm } from '../types'

const DEFAULT_APPT_DURATION = 30
export const MAX_BOOKINGS_PER_SLOT = 1

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

export type PublicAppointmentPayload = {
  patient_name: string
  email: string
  phone: string | null
  appointment_type: Appointment['appointment_type']
  preferred_date: string
  preferred_time: string
  notes?: string | null
  scheduled_start: string
  duration_minutes?: number
}

export async function submitAppointment(payload: PublicAppointmentPayload) {
  const { error } = await supabase.from('appointments').insert({
    patient_name: payload.patient_name,
    email: payload.email,
    phone: payload.phone,
    appointment_type: payload.appointment_type,
    preferred_date: payload.preferred_date,
    preferred_time: payload.preferred_time,
    notes: payload.notes,
    scheduled_start: payload.scheduled_start,
    duration_minutes: payload.duration_minutes ?? DEFAULT_APPT_DURATION,
    source: 'public_form',
    status: 'pending',
  })
  if (error) throw error
}

export type SlotCountRow = { start_minute: string; booking_count: number }

export async function fetchSlotCounts(pFrom: string, pTo: string) {
  const { data, error } = await supabase.rpc('appointment_slot_counts', { p_from: pFrom, p_to: pTo })
  if (error) throw error
  return (data ?? []) as SlotCountRow[]
}

export async function updateAppointment(
  id: string,
  patch: Partial<
    Pick<
      Appointment,
      | 'status'
      | 'notes'
      | 'admin_notes'
      | 'scheduled_start'
      | 'duration_minutes'
      | 'patient_name'
      | 'email'
      | 'phone'
      | 'appointment_type'
      | 'preferred_date'
      | 'preferred_time'
    >
  >,
) {
  const { error } = await supabase.from('appointments').update(patch).eq('id', id)
  if (error) throw error
}

export async function insertManualAppointment(row: {
  patient_name: string
  email: string
  phone: string | null
  appointment_type: Appointment['appointment_type']
  preferred_date: string
  preferred_time: string
  notes: string | null
  status: Appointment['status']
  scheduled_start: string
  duration_minutes: number
  admin_notes: string | null
}) {
  const { error } = await supabase.from('appointments').insert({
    ...row,
    source: 'admin_manual',
  })
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
