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
  const { data, error } = await supabase
    .from('appointments')
    .insert({ ...appointment, status: 'pending' })
    .select()
    .single()
  if (error) throw error
  return data as Appointment
}

export async function submitContactForm(form: ContactForm) {
  const { error } = await supabase.from('contact_submissions').insert(form)
  if (error) throw error
}
