-- ============================================================================
-- RopeBridge Database - Complete Setup Script (Fresh Project)
-- ============================================================================
-- Execute this entire file in your NEW Supabase project's SQL Editor
-- This will create all tables, policies, and seed data in one go
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- TABLES
-- ============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'creator', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_emoji TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags table
CREATE TABLE IF NOT EXISTS public.tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Prompts table
CREATE TABLE IF NOT EXISTS public.prompts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  secret_prompt TEXT NOT NULL,
  price_per_use DECIMAL(10,2) DEFAULT 0.00,
  input_config JSONB NOT NULL DEFAULT '{"fields": []}',
  output_type TEXT DEFAULT 'text' CHECK (output_type IN ('text', 'image', 'json', 'mixed')),
  workflow_type TEXT DEFAULT 'claude_api' CHECK (workflow_type IN ('claude_api', 'google_opal', 'custom')),
  workflow_config JSONB,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  visibility TEXT DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
  usage_count INTEGER DEFAULT 0,
  rating_average DECIMAL(3,2) DEFAULT 0.00,
  rating_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ
);

-- Prompt Categories junction
CREATE TABLE IF NOT EXISTS public.prompt_categories (
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, category_id)
);

-- Prompt Tags junction
CREATE TABLE IF NOT EXISTS public.prompt_tags (
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
  PRIMARY KEY (prompt_id, tag_id)
);

-- Usage Logs table
CREATE TABLE IF NOT EXISTS public.usage_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  prompt_id UUID REFERENCES public.prompts(id) ON DELETE SET NULL,
  user_input_tokens INTEGER,
  output_tokens INTEGER,
  execution_time_ms INTEGER,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_prompts_creator ON public.prompts(creator_id);
CREATE INDEX IF NOT EXISTS idx_prompts_status ON public.prompts(status);
CREATE INDEX IF NOT EXISTS idx_prompts_slug ON public.prompts(slug);
CREATE INDEX IF NOT EXISTS idx_usage_logs_prompt ON public.usage_logs(prompt_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user ON public.usage_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_usage_logs_created ON public.usage_logs(created_at);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_prompts_updated_at ON public.prompts;
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON public.prompts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can create own profile" ON public.users;
CREATE POLICY "Users can create own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Prompts policies
DROP POLICY IF EXISTS "Anyone can view published prompts" ON public.prompts;
CREATE POLICY "Anyone can view published prompts" ON public.prompts
  FOR SELECT USING (status = 'published' AND visibility = 'public');

DROP POLICY IF EXISTS "Creators can view own prompts" ON public.prompts;
CREATE POLICY "Creators can view own prompts" ON public.prompts
  FOR SELECT USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can insert prompts" ON public.prompts;
CREATE POLICY "Creators can insert prompts" ON public.prompts
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can update own prompts" ON public.prompts;
CREATE POLICY "Creators can update own prompts" ON public.prompts
  FOR UPDATE USING (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Creators can delete own prompts" ON public.prompts;
CREATE POLICY "Creators can delete own prompts" ON public.prompts
  FOR DELETE USING (auth.uid() = creator_id);

-- Categories policies (public read-only)
DROP POLICY IF EXISTS "Anyone can view categories" ON public.categories;
CREATE POLICY "Anyone can view categories" ON public.categories
  FOR SELECT USING (true);

-- Tags policies (public read-only)
DROP POLICY IF EXISTS "Anyone can view tags" ON public.tags;
CREATE POLICY "Anyone can view tags" ON public.tags
  FOR SELECT USING (true);

-- Prompt Categories junction policies
DROP POLICY IF EXISTS "Anyone can view prompt categories" ON public.prompt_categories;
CREATE POLICY "Anyone can view prompt categories" ON public.prompt_categories
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_categories.prompt_id
      AND (prompts.status = 'published' AND prompts.visibility = 'public')
    )
  );

DROP POLICY IF EXISTS "Creators can manage own prompt categories" ON public.prompt_categories;
CREATE POLICY "Creators can manage own prompt categories" ON public.prompt_categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_categories.prompt_id
      AND prompts.creator_id = auth.uid()
    )
  );

-- Prompt Tags junction policies
DROP POLICY IF EXISTS "Anyone can view prompt tags" ON public.prompt_tags;
CREATE POLICY "Anyone can view prompt tags" ON public.prompt_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_tags.prompt_id
      AND (prompts.status = 'published' AND prompts.visibility = 'public')
    )
  );

DROP POLICY IF EXISTS "Creators can manage own prompt tags" ON public.prompt_tags;
CREATE POLICY "Creators can manage own prompt tags" ON public.prompt_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.prompts
      WHERE prompts.id = prompt_tags.prompt_id
      AND prompts.creator_id = auth.uid()
    )
  );

-- Usage Logs policies
DROP POLICY IF EXISTS "Users can view own usage logs" ON public.usage_logs;
CREATE POLICY "Users can view own usage logs" ON public.usage_logs
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can create usage logs" ON public.usage_logs;
CREATE POLICY "Authenticated users can create usage logs" ON public.usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Insert categories
INSERT INTO public.categories (name, slug, description, icon_emoji) VALUES
  ('Image Generation', 'image-generation', 'Create and manipulate images with AI', '🎨'),
  ('Text Analysis', 'text-analysis', 'Analyze and process text content', '📝'),
  ('Content Creation', 'content-creation', 'Generate creative content and writing', '✍️'),
  ('Data Processing', 'data-processing', 'Process and analyze data', '📊'),
  ('Research', 'research', 'Research and information gathering', '🔍'),
  ('Development', 'development', 'Code generation and software architecture', '💻'),
  ('Productivity', 'productivity', 'Tools for efficiency and organization', '⚡')
ON CONFLICT (slug) DO NOTHING;

-- Insert tags
INSERT INTO public.tags (name, slug) VALUES
  ('Horror', 'horror'),
  ('Fantasy', 'fantasy'),
  ('Sci-Fi', 'sci-fi'),
  ('Mythology', 'mythology'),
  ('Cosmic', 'cosmic'),
  ('Cute', 'cute'),
  ('Dark', 'dark'),
  ('Whimsical', 'whimsical'),
  ('Professional', 'professional'),
  ('Business', 'business'),
  ('Marketing', 'marketing'),
  ('Analytics', 'analytics'),
  ('Strategy', 'strategy'),
  ('Code Generation', 'code-generation'),
  ('Architecture', 'architecture'),
  ('Full-Stack', 'full-stack'),
  ('Documentation', 'documentation'),
  ('API', 'api'),
  ('Photography', 'photography'),
  ('Writing', 'writing'),
  ('Art', 'art'),
  ('Gaming', 'gaming'),
  ('Worldbuilding', 'worldbuilding'),
  ('Character Design', 'character-design'),
  ('Education', 'education'),
  ('Entertainment', 'entertainment'),
  ('Problem-Solving', 'problem-solving'),
  ('Meta-Cognition', 'meta-cognition'),
  ('Research Tool', 'research-tool'),
  ('Text Output', 'text-output'),
  ('Image Output', 'image-output'),
  ('Structured Data', 'structured-data'),
  ('CSV Export', 'csv-export'),
  ('Quick', 'quick'),
  ('Comprehensive', 'comprehensive'),
  ('Advanced', 'advanced'),
  ('Beginner-Friendly', 'beginner-friendly')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES (Run these after to verify)
-- ============================================================================

-- List all tables
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Count seed data
-- SELECT
--   (SELECT COUNT(*) FROM categories) AS categories_count,
--   (SELECT COUNT(*) FROM tags) AS tags_count;

-- View categories
-- SELECT * FROM categories ORDER BY name;

-- View tags
-- SELECT * FROM tags ORDER BY name;
