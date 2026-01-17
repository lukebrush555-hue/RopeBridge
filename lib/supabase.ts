import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================================================
// TypeScript Type Definitions
// ============================================================================

export type User = {
  id: string
  email: string
  display_name?: string
  role: 'user' | 'creator' | 'admin'
  created_at: string
  updated_at: string
}

export type Prompt = {
  id: string
  creator_id: string
  title: string
  slug: string
  description: string
  secret_prompt: string
  price_per_use: number
  input_config: {
    fields: Array<{
      type: string
      name: string
      label: string
      placeholder?: string
      required?: boolean
      accept?: string
      options?: string[]
    }>
  }
  output_type: 'text' | 'image' | 'json' | 'mixed'
  workflow_type: 'claude_api' | 'google_opal' | 'custom'
  workflow_config?: any
  status: 'draft' | 'published' | 'archived'
  visibility: 'public' | 'private' | 'unlisted'
  usage_count: number
  rating_average: number
  rating_count: number
  created_at: string
  updated_at: string
  published_at?: string
}

export type Category = {
  id: string
  name: string
  slug: string
  description?: string
  icon_emoji?: string
  created_at: string
}

export type Tag = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type UsageLog = {
  id: string
  user_id: string
  prompt_id: string
  user_input_tokens?: number
  output_tokens?: number
  execution_time_ms?: number
  success: boolean
  error_message?: string
  created_at: string
}