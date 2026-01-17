# Supabase MCP Setup Instructions

## Current Status
✅ Supabase MCP Server: **Connected** (`https://mcp.supabase.com/mcp`)

## What You Need to Do

### Step 1: Initialize Your Supabase Database

Your database is currently empty. You need to create the tables first.

1. **Open your Supabase Dashboard**
   - Go to: https://wsxdiskmxiglwukwctsp.supabase.co
   - Navigate to: **SQL Editor** (in the left sidebar)

2. **Run the Setup Script**
   - Open the file: `/home/user/RopeBridge/supabase/FRESH_PROJECT_SETUP.sql`
   - Copy the ENTIRE contents
   - Paste into the Supabase SQL Editor
   - Click **"Run"** button

This will create:
- 7 database tables (users, prompts, categories, tags, etc.)
- Row Level Security policies
- 7 seed categories
- 37 seed tags

### Step 2: Verify MCP Can Read & Write

After the database is initialized, verify the MCP connection works:

**Option A: Run Verification Script (Recommended)**
```bash
node verify-mcp.js
```

This script will:
- ✅ READ existing categories
- ✅ WRITE a test category
- ✅ DELETE the test category (cleanup)

**Option B: Manual SQL Test**
Run this in Supabase SQL Editor:
```sql
-- Check if tables exist
SELECT * FROM categories LIMIT 5;

-- Insert a test
INSERT INTO categories (name, slug, description, icon_emoji)
VALUES ('Test', 'test', 'Test category', '🧪')
RETURNING *;

-- Cleanup
DELETE FROM categories WHERE slug = 'test';
```

## Your Credentials

- **Project URL**: `https://wsxdiskmxiglwukwctsp.supabase.co`
- **Project ID**: `wsxdiskmxiglwukwctsp`
- **Anon Key**: Stored in `.env.test` file

## Expected Result

After Step 1 is complete, you should see:
- ✅ Claude Code can query categories
- ✅ Claude Code can insert records
- ✅ Claude Code can delete records

## Troubleshooting

### "relation does not exist" error
- You haven't run the `FRESH_PROJECT_SETUP.sql` yet
- Go back to Step 1

### "permission denied" error
- Check your RLS policies in Supabase Dashboard
- Categories table should allow public SELECT (already configured in setup script)

### Network/fetch errors
- Verify your Supabase project is active
- Check the project URL is correct
- Ensure you're not on a restricted network

## Next Steps

Once verification passes, you can:
1. Configure your Next.js app with the credentials
2. Start building prompt management features
3. Use Claude Code to interact with your database
