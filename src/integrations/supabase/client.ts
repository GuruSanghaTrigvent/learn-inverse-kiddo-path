
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://akanbrlhgiqbtvfznivv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrYW5icmxoZ2lxYnR2ZnpuaXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4MjQwMjcsImV4cCI6MjA1NTQwMDAyN30.SdUXUwBlQBOAH7tL_m_H30sqXv2-giwbhf5gYGGP4hw'

interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          created_at: string
          subscription_tier: 'one_child' | 'family' | null
          subscription_interval: 'monthly' | 'annual' | null
          subscription_status: 'trial' | 'active' | 'cancelled' | 'expired'
          trial_ends_at: string
          subscription_ends_at: string | null
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          email: string
          created_at?: string
          subscription_tier?: 'one_child' | 'family' | null
          subscription_interval?: 'monthly' | 'annual' | null
          subscription_status?: 'trial' | 'active' | 'cancelled' | 'expired'
          trial_ends_at?: string
          subscription_ends_at?: string | null
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          created_at?: string
          subscription_tier?: 'one_child' | 'family' | null
          subscription_interval?: 'monthly' | 'annual' | null
          subscription_status?: 'trial' | 'active' | 'cancelled' | 'expired'
          trial_ends_at?: string
          subscription_ends_at?: string | null
        }
      }
      students: {
        Row: {
          id: string
          parent_id: string
          first_name: string
          last_name: string
          birthday: string
          created_at: string
        }
        Insert: {
          id?: string
          parent_id: string
          first_name: string
          last_name: string
          birthday: string
          created_at?: string
        }
        Update: {
          id?: string
          parent_id?: string
          first_name?: string
          last_name?: string
          birthday?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_tier: 'one_child' | 'family'
      subscription_interval: 'monthly' | 'annual'
      subscription_status: 'trial' | 'active' | 'cancelled' | 'expired'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
