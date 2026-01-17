-- RopeBridge Row Level Security Policies
-- Execute this AFTER running 001_create_tables.sql
-- These policies control who can read/write data

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- Users can view and update their own data
-- ============================================================================

-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile (on first login)
DROP POLICY IF EXISTS "Users can create own profile" ON public.users;
CREATE POLICY "Users can create own profile" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================================
-- PROMPTS TABLE POLICIES
-- Public can view published prompts, creators manage their own
-- ============================================================================

-- Anyone can view published public prompts
DROP POLICY IF EXISTS "Anyone can view published prompts" ON public.prompts;
CREATE POLICY "Anyone can view published prompts" ON public.prompts
  FOR SELECT
  USING (status = 'published' AND visibility = 'public');

-- Creators can view all their own prompts (any status)
DROP POLICY IF EXISTS "Creators can view own prompts" ON public.prompts;
CREATE POLICY "Creators can view own prompts" ON public.prompts
  FOR SELECT
  USING (auth.uid() = creator_id);

-- Creators can insert new prompts
DROP POLICY IF EXISTS "Creators can insert prompts" ON public.prompts;
CREATE POLICY "Creators can insert prompts" ON public.prompts
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Creators can update their own prompts
DROP POLICY IF EXISTS "Creators can update own prompts" ON public.prompts;
CREATE POLICY "Creators can update own prompts" ON public.prompts
  FOR UPDATE
  USING (auth.uid() = creator_id);

-- Creators can delete their own prompts
DROP POLICY IF EXISTS "Creators can delete own prompts" ON public.prompts;
CREATE POLICY "Creators can delete own prompts" ON public.prompts
  FOR DELETE
  USING (auth.uid() = creator_id);

-- ============================================================================
-- CATEGORIES TABLE POLICIES
-- Categories are public read-only for everyone
-- (Only admins can create/edit, but we'll handle that via app logic)
-- ============================================================================

-- Anyone can view categories
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT
  USING (true);

-- ============================================================================
-- TAGS TABLE POLICIES
-- Tags are public read-only for everyone
-- ============================================================================

-- Anyone can view tags
DROP POLICY IF EXISTS "Anyone can view tags" ON public.tags;
CREATE POLICY "Anyone can view tags" ON public.tags
  FOR SELECT
  USING (true);

-- ============================================================================
-- PROMPT_CATEGORIES JUNCTION TABLE POLICIES
-- Creators can manage categories for their own prompts
-- ============================================================================

-- Anyone can view prompt-category associations for published prompts
DROP POLICY IF EXISTS "Anyone can view prompt categories" ON public.prompt_categories;
CREATE POLICY "Anyone can view prompt categories" ON public.prompt_categories
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_categories.prompt_id
      AND (prompts.status = 'published' AND prompts.visibility = 'public')
    )
  );

-- Creators can view categories for their own prompts
DROP POLICY IF EXISTS "Creators can view own prompt categories" ON public.prompt_categories;
CREATE POLICY "Creators can view own prompt categories" ON public.prompt_categories
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_categories.prompt_id
      AND prompts.creator_id = auth.uid()
    )
  );

-- Creators can insert categories for their own prompts
DROP POLICY IF EXISTS "Creators can insert prompt categories" ON public.prompt_categories;
CREATE POLICY "Creators can insert prompt categories" ON public.prompt_categories
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_categories.prompt_id
      AND prompts.creator_id = auth.uid()
    )
  );

-- Creators can delete categories from their own prompts
DROP POLICY IF EXISTS "Creators can delete prompt categories" ON public.prompt_categories;
CREATE POLICY "Creators can delete prompt categories" ON public.prompt_categories
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_categories.prompt_id
      AND prompts.creator_id = auth.uid()
    )
  );

-- ============================================================================
-- PROMPT_TAGS JUNCTION TABLE POLICIES
-- Similar to categories
-- ============================================================================

-- Anyone can view prompt-tag associations for published prompts
DROP POLICY IF EXISTS "Anyone can view prompt tags" ON public.prompt_tags;
CREATE POLICY "Anyone can view prompt tags" ON public.prompt_tags
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_tags.prompt_id
      AND (prompts.status = 'published' AND prompts.visibility = 'public')
    )
  );

-- Creators can view tags for their own prompts
DROP POLICY IF EXISTS "Creators can view own prompt tags" ON public.prompt_tags;
CREATE POLICY "Creators can view own prompt tags" ON public.prompt_tags
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_tags.prompt_id
      AND prompts.creator_id = auth.uid()
    )
  );

-- Creators can insert tags for their own prompts
DROP POLICY IF EXISTS "Creators can insert prompt tags" ON public.prompt_tags;
CREATE POLICY "Creators can insert prompt tags" ON public.prompt_tags
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_tags.prompt_id
      AND prompts.creator_id = auth.uid()
    )
  );

-- Creators can delete tags from their own prompts
DROP POLICY IF EXISTS "Creators can delete prompt tags" ON public.prompt_tags;
CREATE POLICY "Creators can delete prompt tags" ON public.prompt_tags
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_tags.prompt_id
      AND prompts.creator_id = auth.uid()
    )
  );

-- ============================================================================
-- USAGE_LOGS TABLE POLICIES
-- Users can view their own usage history
-- ============================================================================

-- Users can view their own usage logs
DROP POLICY IF EXISTS "Users can view own usage logs" ON public.usage_logs;
CREATE POLICY "Users can view own usage logs" ON public.usage_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- System can insert usage logs (via service role key in API)
-- This policy allows authenticated users to create usage logs
DROP POLICY IF EXISTS "Authenticated users can create usage logs" ON public.usage_logs;
CREATE POLICY "Authenticated users can create usage logs" ON public.usage_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check that RLS is enabled on all tables
-- SELECT tablename, rowsecurity
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY tablename;

-- List all policies
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public'
-- ORDER BY tablename, policyname;
