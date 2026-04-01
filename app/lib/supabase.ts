import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type DbStep = {
  id: string
  number: number
  title: string
  subtitle: string | null
  description: string | null
  icon: string
}

export type DbField = {
  id: string
  step_id: string
  field_key: string
  label: string
  hint: string | null
  field_type: string
  options: string[] | null
  placeholder: string | null
  sort_order: number
}
