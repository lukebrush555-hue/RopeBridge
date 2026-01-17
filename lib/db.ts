import { supabase } from './supabase'
import type { Prompt, User, Category, Tag, UsageLog } from './supabase'

// ============================================================================
// PROMPT OPERATIONS
// ============================================================================

/**
 * Get prompts with optional filtering
 */
export async function getPrompts(filters?: {
  status?: 'draft' | 'published' | 'archived'
  creator_id?: string
  category?: string
  tag?: string
}) {
  let query = supabase
    .from('prompts')
    .select(`
      *,
      prompt_categories(category_id),
      prompt_tags(tag_id)
    `)

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.creator_id) {
    query = query.eq('creator_id', filters.creator_id)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  return { data, error }
}

/**
 * Get a single prompt by slug (for public-facing pages)
 */
export async function getPromptBySlug(slug: string) {
  const { data, error } = await supabase
    .from('prompts')
    .select(`
      *,
      prompt_categories(
        category_id,
        categories(*)
      ),
      prompt_tags(
        tag_id,
        tags(*)
      )
    `)
    .eq('slug', slug)
    .single()

  return { data, error }
}

/**
 * Get a single prompt by ID
 */
export async function getPromptById(id: string) {
  const { data, error } = await supabase
    .from('prompts')
    .select(`
      *,
      prompt_categories(
        category_id,
        categories(*)
      ),
      prompt_tags(
        tag_id,
        tags(*)
      )
    `)
    .eq('id', id)
    .single()

  return { data, error }
}

/**
 * Create a new prompt
 */
export async function createPrompt(prompt: Partial<Prompt>) {
  const { data, error } = await supabase
    .from('prompts')
    .insert([prompt])
    .select()
    .single()

  return { data, error }
}

/**
 * Update an existing prompt
 */
export async function updatePrompt(id: string, updates: Partial<Prompt>) {
  const { data, error } = await supabase
    .from('prompts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}

/**
 * Delete a prompt
 */
export async function deletePrompt(id: string) {
  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id)

  return { error }
}

/**
 * Increment usage count for a prompt
 */
export async function incrementPromptUsage(promptId: string) {
  const { data, error } = await supabase.rpc('increment_prompt_usage', {
    prompt_id: promptId
  })

  // If RPC doesn't exist, fall back to manual increment
  if (error && error.code === '42883') {
    const { data: prompt } = await getPromptById(promptId)
    if (prompt) {
      return updatePrompt(promptId, {
        usage_count: prompt.usage_count + 1
      })
    }
  }

  return { data, error }
}

// ============================================================================
// CATEGORY OPERATIONS
// ============================================================================

/**
 * Get all categories
 */
export async function getCategories() {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  return { data, error }
}

/**
 * Get category by slug
 */
export async function getCategoryBySlug(slug: string) {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single()

  return { data, error }
}

/**
 * Add category to prompt
 */
export async function addCategoryToPrompt(promptId: string, categoryId: string) {
  const { data, error } = await supabase
    .from('prompt_categories')
    .insert([{ prompt_id: promptId, category_id: categoryId }])
    .select()

  return { data, error }
}

/**
 * Remove category from prompt
 */
export async function removeCategoryFromPrompt(promptId: string, categoryId: string) {
  const { error } = await supabase
    .from('prompt_categories')
    .delete()
    .eq('prompt_id', promptId)
    .eq('category_id', categoryId)

  return { error }
}

// ============================================================================
// TAG OPERATIONS
// ============================================================================

/**
 * Get all tags
 */
export async function getTags() {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('name')

  return { data, error }
}

/**
 * Get tag by slug
 */
export async function getTagBySlug(slug: string) {
  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .eq('slug', slug)
    .single()

  return { data, error }
}

/**
 * Add tag to prompt
 */
export async function addTagToPrompt(promptId: string, tagId: string) {
  const { data, error } = await supabase
    .from('prompt_tags')
    .insert([{ prompt_id: promptId, tag_id: tagId }])
    .select()

  return { data, error }
}

/**
 * Remove tag from prompt
 */
export async function removeTagFromPrompt(promptId: string, tagId: string) {
  const { error } = await supabase
    .from('prompt_tags')
    .delete()
    .eq('prompt_id', promptId)
    .eq('tag_id', tagId)

  return { error }
}

// ============================================================================
// USER OPERATIONS
// ============================================================================

/**
 * Get user profile by ID
 */
export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  return { data, error }
}

/**
 * Create or update user profile
 */
export async function upsertUserProfile(user: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .upsert([user])
    .select()
    .single()

  return { data, error }
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  return { data, error }
}

// ============================================================================
// USAGE LOG OPERATIONS
// ============================================================================

/**
 * Create a usage log entry
 */
export async function createUsageLog(log: {
  user_id: string
  prompt_id: string
  user_input_tokens?: number
  output_tokens?: number
  execution_time_ms?: number
  success: boolean
  error_message?: string
}) {
  const { data, error } = await supabase
    .from('usage_logs')
    .insert([log])
    .select()
    .single()

  return { data, error }
}

/**
 * Get usage logs for a user
 */
export async function getUserUsageLogs(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('usage_logs')
    .select(`
      *,
      prompts(title, slug)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return { data, error }
}

/**
 * Get usage logs for a prompt
 */
export async function getPromptUsageLogs(promptId: string, limit = 100) {
  const { data, error } = await supabase
    .from('usage_logs')
    .select('*')
    .eq('prompt_id', promptId)
    .order('created_at', { ascending: false })
    .limit(limit)

  return { data, error }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Generate a URL-safe slug from a title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Check if a slug is available
 */
export async function isSlugAvailable(slug: string, excludeId?: string) {
  let query = supabase
    .from('prompts')
    .select('id')
    .eq('slug', slug)

  if (excludeId) {
    query = query.neq('id', excludeId)
  }

  const { data, error } = await query.single()

  // If no data found, slug is available
  return !data && error?.code === 'PGRST116'
}
