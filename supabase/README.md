# RopeBridge Database Setup

This directory contains SQL scripts to set up the RopeBridge database in Supabase.

## Quick Start

Execute these scripts **in order** in your Supabase SQL Editor:

### 1. Create Tables
```sql
-- Copy and paste the contents of 001_create_tables.sql
```

This creates:
- `users` - User profiles extending Supabase auth
- `prompts` - Secret prompts and configuration
- `categories` - Top-level prompt organization
- `tags` - Fine-grained filtering
- `prompt_categories` - Junction table
- `prompt_tags` - Junction table
- `usage_logs` - Analytics and tracking

**Note:** Does NOT include payment/transaction tables (waiting for approval)

### 2. Set Up Row Level Security
```sql
-- Copy and paste the contents of 002_create_rls_policies.sql
```

This enables RLS and creates policies for:
- Users can view/edit own profile
- Anyone can view published prompts
- Creators can manage their own prompts
- Categories and tags are public
- Users can view their own usage logs

### 3. Seed Initial Data
```sql
-- Copy and paste the contents of 003_seed_data.sql
```

This adds:
- 7 categories (Image Generation, Text Analysis, Content Creation, etc.)
- 30+ tags (Horror, Fantasy, Professional, Code Generation, etc.)

## Verification

After running all scripts, verify everything worked:

```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Count seed data
SELECT
  (SELECT COUNT(*) FROM categories) AS categories,
  (SELECT COUNT(*) FROM tags) AS tags;

-- View categories
SELECT * FROM categories ORDER BY name;

-- View tags
SELECT * FROM tags ORDER BY name;
```

## How to Execute in Supabase

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the left sidebar
3. Click **New query**
4. Copy and paste the contents of `001_create_tables.sql`
5. Click **Run** (or press Ctrl/Cmd + Enter)
6. Repeat for `002_create_rls_policies.sql`
7. Repeat for `003_seed_data.sql`

## Troubleshooting

**Error: "relation already exists"**
- Tables are already created. Safe to ignore or drop tables first.

**Error: "permission denied"**
- Make sure you're logged in as the project owner
- Check that you're in the correct project

**Error: "function does not exist"**
- UUID extension might not be enabled
- Run: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

**No errors but tables don't appear**
- Refresh the Supabase dashboard
- Check you're in the correct schema (should be `public`)

## Next Steps

After database setup:
1. Verify environment variables are set in Vercel
2. Test connection with `lib/db.ts` functions
3. Dashboard should now work without errors
4. PromptBuilder can save to database

## Database Schema Overview

```
users (extends auth.users)
  └── prompts (one-to-many)
      ├── prompt_categories (many-to-many) → categories
      ├── prompt_tags (many-to-many) → tags
      └── usage_logs (one-to-many)
```

## Important Notes

- **Payment features NOT included** - Transactions table excluded until payment system is approved
- **Price fields exist** but are placeholders (not enforced)
- **Usage tracking works** but no payment deduction
- All SQL uses `IF NOT EXISTS` so it's safe to re-run
