export interface Product {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: 'frames' | 'sunglasses' | 'contacts' | 'accessories'
  brand: string
  in_stock: boolean
  created_at: string
}

export interface Appointment {
  id: string
  patient_name: string
  email: string
  phone: string | null
  appointment_type: 'eye_exam' | 'contact_fitting' | 'frame_consultation'
  preferred_date: string
  preferred_time: string
  notes?: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
  /** Actual slot for calendar (UTC / ISO). Optional for legacy rows. */
  scheduled_start: string | null
  duration_minutes?: number
  source?: 'public_form' | 'admin_manual'
  admin_notes?: string | null
}

export interface ContactForm {
  name: string
  email: string
  phone?: string
  message: string
}

export interface InsuranceProvider {
  id: string
  name: string
  logo_url?: string
}
