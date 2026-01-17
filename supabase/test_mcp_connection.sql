-- ============================================================================
-- Supabase MCP Connection Test
-- ============================================================================
-- This script tests your Supabase connection by:
-- 1. Inserting a test category
-- 2. Querying it back
-- 3. Cleaning it up
--
-- You can run this in the Supabase SQL Editor or via the MCP
-- ============================================================================

-- Insert a test category
INSERT INTO categories (name, slug, description, icon_emoji)
VALUES (
  'MCP Test Category',
  'mcp-test-category',
  'Test category to verify Supabase MCP connection',
  '🧪'
)
RETURNING *;

-- Verify it was inserted
SELECT * FROM categories WHERE slug = 'mcp-test-category';

-- Clean up: Uncomment the line below to delete the test category
-- DELETE FROM categories WHERE slug = 'mcp-test-category';
