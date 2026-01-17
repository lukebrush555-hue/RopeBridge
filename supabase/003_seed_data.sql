-- RopeBridge Seed Data - Categories and Tags
-- Execute this AFTER running 001_create_tables.sql and 002_create_rls_policies.sql

-- ============================================================================
-- CATEGORIES
-- Top-level organization for prompts
-- ============================================================================

INSERT INTO public.categories (name, slug, description, icon_emoji) VALUES
  ('Image Generation', 'image-generation', 'Create and manipulate images with AI', '🎨'),
  ('Text Analysis', 'text-analysis', 'Analyze and process text content', '📝'),
  ('Content Creation', 'content-creation', 'Generate creative content and writing', '✍️'),
  ('Data Processing', 'data-processing', 'Process and analyze data', '📊'),
  ('Research', 'research', 'Research and information gathering', '🔍'),
  ('Development', 'development', 'Code generation and software architecture', '💻'),
  ('Productivity', 'productivity', 'Tools for efficiency and organization', '⚡')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- TAGS
-- Fine-grained filtering and discovery
-- Organized by theme/use case
-- ============================================================================

-- Creative/Genre Tags
INSERT INTO public.tags (name, slug) VALUES
  ('Horror', 'horror'),
  ('Fantasy', 'fantasy'),
  ('Sci-Fi', 'sci-fi'),
  ('Mythology', 'mythology'),
  ('Cosmic', 'cosmic'),
  ('Cute', 'cute'),
  ('Dark', 'dark'),
  ('Whimsical', 'whimsical')
ON CONFLICT (slug) DO NOTHING;

-- Professional/Business Tags
INSERT INTO public.tags (name, slug) VALUES
  ('Professional', 'professional'),
  ('Business', 'business'),
  ('Marketing', 'marketing'),
  ('Analytics', 'analytics'),
  ('Strategy', 'strategy')
ON CONFLICT (slug) DO NOTHING;

-- Technical Tags
INSERT INTO public.tags (name, slug) VALUES
  ('Code Generation', 'code-generation'),
  ('Architecture', 'architecture'),
  ('Full-Stack', 'full-stack'),
  ('Documentation', 'documentation'),
  ('API', 'api')
ON CONFLICT (slug) DO NOTHING;

-- Creative Tools Tags
INSERT INTO public.tags (name, slug) VALUES
  ('Photography', 'photography'),
  ('Writing', 'writing'),
  ('Art', 'art'),
  ('Gaming', 'gaming'),
  ('Worldbuilding', 'worldbuilding'),
  ('Character Design', 'character-design')
ON CONFLICT (slug) DO NOTHING;

-- Purpose Tags
INSERT INTO public.tags (name, slug) VALUES
  ('Education', 'education'),
  ('Entertainment', 'entertainment'),
  ('Problem-Solving', 'problem-solving'),
  ('Meta-Cognition', 'meta-cognition'),
  ('Research Tool', 'research-tool')
ON CONFLICT (slug) DO NOTHING;

-- Output Type Tags
INSERT INTO public.tags (name, slug) VALUES
  ('Text Output', 'text-output'),
  ('Image Output', 'image-output'),
  ('Structured Data', 'structured-data'),
  ('CSV Export', 'csv-export')
ON CONFLICT (slug) DO NOTHING;

-- Complexity/Sophistication Tags
INSERT INTO public.tags (name, slug) VALUES
  ('Quick', 'quick'),
  ('Comprehensive', 'comprehensive'),
  ('Advanced', 'advanced'),
  ('Beginner-Friendly', 'beginner-friendly')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Count categories
-- SELECT COUNT(*) as category_count FROM public.categories;

-- Count tags
-- SELECT COUNT(*) as tag_count FROM public.tags;

-- View all categories
-- SELECT * FROM public.categories ORDER BY name;

-- View all tags
-- SELECT * FROM public.tags ORDER BY name;
