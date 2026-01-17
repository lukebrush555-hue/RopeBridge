-- RopeBridge Database Schema - Core Tables
-- Execute this in Supabase SQL Editor
-- NOTE: Does NOT include payment/transaction tables (waiting for approval)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- Extends Supabase auth.users with RopeBridge-specific data
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'creator', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CATEGORIES TABLE
-- Top-level organization for prompts (e.g., "Image Generation", "Text Analysis")
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_emoji TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- TAGS TABLE
-- Fine-grained filtering and discovery (e.g., "horror", "fantasy", "business")
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROMPTS TABLE
-- Core table storing secret prompts and configuration
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Basic Info
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  secret_prompt TEXT NOT NULL, -- The actual prompt users don't see

  -- Configuration (prices stored but not enforced until payment system approved)
  price_per_use DECIMAL(10,2) DEFAULT 0.00, -- Placeholder for future
  input_config JSONB NOT NULL DEFAULT '{"fields": []}', -- UI configuration for user inputs
  output_type TEXT DEFAULT 'text' CHECK (output_type IN ('text', 'image', 'json', 'mixed')),
  workflow_type TEXT DEFAULT 'claude_api' CHECK (workflow_type IN ('claude_api', 'google_opal', 'custom')),
  workflow_config JSONB, -- API configuration, model settings, etc.

  -- Status & visibility
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),

  -- Stats (usage tracking only, no payment enforcement yet)
  usage_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- ============================================================================
-- JUNCTION TABLES
-- Many-to-many relationships between prompts and categories/tags
-- ============================================================================

-- Prompt Categories (many-to-many)
CREATE TABLE IF NOT EXISTS public.prompt_categories (
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, category_id)
);

-- Prompt Tags (many-to-many)
CREATE TABLE IF NOT EXISTS public.prompt_tags (
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, tag_id)
);

-- ============================================================================
-- USAGE LOGS TABLE
-- Track prompt executions for analytics (no payment enforcement)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE SET NULL,

  -- Execution metadata
  user_input_tokens INTEGER,
  output_tokens INTEGER,
  execution_time_ms INTEGER,

  -- Result tracking
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_prompts_creator ON public.prompts(creator_id);
CREATE INDEX IF NOT EXISTS idx_prompts_status ON public.prompts(status);
CREATE INDEX IF NOT EXISTS idx_prompts_slug ON public.prompts(slug);
CREATE INDEX IF NOT EXISTS idx_usage_logs_prompt ON public.usage_logs(prompt_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created ON public.usage_logs(created_at);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- Automatically update updated_at timestamp on row changes
-- ============================================================================

-- Create trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to users table
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply to prompts table
DROP TRIGGER IF EXISTS update_prompts_updated_at ON public.prompts;
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION QUERIES
-- Run these after executing the above to verify everything was created
-- ============================================================================

-- List all tables
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Count rows in each table (should all be 0 initially)
-- SELECT 'users' as table_name, COUNT(*) FROM public.users
-- UNION ALL SELECT 'categories', COUNT(*) FROM public.categories
-- UNION ALL SELECT 'tags', COUNT(*) FROM public.tags
-- UNION ALL SELECT 'prompts', COUNT(*) FROM public.prompts
-- UNION ALL SELECT 'prompt_categories', COUNT(*) FROM public.prompt_categories
-- UNION ALL SELECT 'prompt_tags', COUNT(*) FROM public.prompt_tags
-- UNION ALL SELECT 'usage_logs', COUNT(*) FROM public.usage_logs;
