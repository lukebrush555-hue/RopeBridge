# Setting Up RopeBridge on a Fresh Supabase Project

## Step 1: Create New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New project"**
3. Choose your organization
4. Project name: **RopeBridge** (or whatever you want)
5. Database password: **Generate a secure password** (save it somewhere!)
6. Region: Choose closest to you (probably **East US**)
7. Click **"Create new project"**
8. Wait 1-2 minutes for project to initialize

## Step 2: Copy Environment Variables

Once your project is created:

1. In Supabase dashboard, click **"Settings"** → **"API"**
2. Copy these two values:

   **Project URL:**
   ```
   https://YOUR_PROJECT_ID.supabase.co
   ```

   **anon/public key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. Update these in **Vercel**:
   - Go to Vercel → RopeBridge project → Settings → Environment Variables
   - Update `NEXT_PUBLIC_SUPABASE_URL` with new Project URL
   - Update `NEXT_PUBLIC_SUPABASE_ANON_KEY` with new anon key
   - Make sure to select **Production, Preview, Development**

## Step 3: Execute Database Setup

1. In Supabase dashboard, click **"SQL Editor"** in left sidebar
2. Click **"New query"**
3. Open the file: `supabase/FRESH_PROJECT_SETUP.sql`
4. Copy the ENTIRE file contents
5. Paste into Supabase SQL Editor
6. Click **"Run"** (or press Ctrl/Cmd + Enter)
7. You should see "Success. No rows returned"

## Step 4: Verify Setup

Run this verification query in SQL Editor:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected tables:**
- categories
- prompts
- prompt_categories
- prompt_tags
- tags
- usage_logs
- users

Check seed data:

```sql
SELECT COUNT(*) as categories FROM categories;
SELECT COUNT(*) as tags FROM tags;
```

**Expected counts:**
- Categories: 7
- Tags: 37

## Step 5: Redeploy Your App

Since you updated environment variables in Vercel:

1. Go to Vercel → RopeBridge → Deployments
2. Click the three dots on latest deployment
3. Click **"Redeploy"**

OR just push a new commit to trigger deployment.

## Done! ✅

Your RopeBridge database is now set up with:
- ✅ All tables created
- ✅ Row Level Security enabled
- ✅ Categories and tags seeded
- ✅ Ready for Dashboard and PromptBuilder

## Troubleshooting

**Error: "permission denied"**
- Make sure you're logged in as project owner

**Error: "relation already exists"**
- You may have run the script twice - safe to ignore

**Tables don't show up**
- Refresh Supabase dashboard
- Click "Table Editor" to see tables visually

**App still shows old data**
- Clear browser cache
- Redeploy from Vercel
- Check environment variables are updated
