# RopeBridge

A production-ready prompt builder and management platform for AI-generated content.

## Project Overview

**Domain:** ropebridge.space (Namecheap)
**Purpose:** SaaS platform for creating, managing, and deploying AI prompts with category systems, pricing, and user management

## Stack

- **Frontend:** Next.js 14.2 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (to be implemented)
- **Deployment:** Vercel
- **AI Assistant:** Claude Code Desktop (native, no container)

## Architecture

### Database (Supabase)
- **Project:** RopeBridge (existing, configured in Vercel)
- **Tables:** users, prompts, categories, tags, prompt_categories, prompt_tags, usage_logs
- **Status:** Environment variables configured in Vercel, SQL migrations ready to run
- **Location:** `supabase/` directory contains all migration files

### Frontend (Next.js)
- **App Router:** Modern Next.js 14 structure
- **Components:** Prompt builder, category editor, drag-and-drop interfaces
- **Features:** 6-section prompt builder, category system, pricing, marketing integration

### Deployment
- **Platform:** Vercel
- **Project Name:** RopeBridge
- **Domain:** ropebridge.space
- **Environment:** Production + Preview branches
- **CI/CD:** Auto-deploy on git push

## Current State

✅ **Complete:**
- Next.js app structure
- Vercel deployment pipeline
- Supabase project created with env vars
- SQL migration files (not yet executed)
- Basic UI components

🚧 **In Progress:**
- Transitioning from container to native Claude Desktop
- Database setup (migrations ready, not applied)
- MCP integration for Supabase

⏳ **Planned:**
- User authentication
- Backend API integration (currently using localStorage)
- Real-time features
- Payment integration

## Development Environment

### Required Environment Variables

```bash
# Supabase (configured in Vercel, needed locally for dev)
NEXT_PUBLIC_SUPABASE_URL=https://[project-id].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # For admin operations

# Vercel (for deployments)
VERCEL_TOKEN=[token]
VERCEL_PROJECT_ID=[project-id]
```

### Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

### Database Operations

```bash
# Migrations are in supabase/ directory
# Execute via Supabase dashboard SQL Editor
# Or use Supabase CLI (when configured)
```

## Key Files

- `app/page.tsx` - Landing page
- `components/PromptBuilder.tsx` - Main prompt creation UI
- `components/sections/*` - Modular prompt builder sections
- `lib/supabase.ts` - Supabase client configuration
- `supabase/FRESH_PROJECT_SETUP.sql` - Complete DB setup script
- `vercel.json` - Deployment configuration

## Important Constraints

### Security
- ⚠️ NEVER expose `SUPABASE_SERVICE_ROLE_KEY` in frontend code
- ✅ Use `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side operations
- ✅ Row Level Security (RLS) policies must be in place before going live
- ✅ Validate all user input server-side

### Data
- Currently using localStorage (client-side only)
- Migration to Supabase backend is next major milestone
- All prompts, categories, and tags will move to database

### Deployment
- All pushes to main branch auto-deploy to production
- Preview deployments created for all branches
- Environment variables managed in Vercel dashboard

## MCP Integration (Native Desktop)

### Supabase MCP
- **Purpose:** Query database, manage schema, run migrations
- **Configuration:** Set up in `.mcp.json` (project scope)
- **Authentication:** OAuth via `/mcp` command in Claude Desktop
- **Scope:** Development project only (never production)

## Common Tasks

### Starting New Feature
1. Create feature branch from main
2. Ensure environment variables are configured in Desktop
3. Use `/mcp` to authenticate with Supabase if needed
4. Develop and test locally
5. Push branch → Creates preview deployment
6. Review → Merge to main → Auto-deploy production

### Database Changes
1. Write migration SQL in `supabase/` directory
2. Test in Supabase dashboard SQL Editor
3. Use Supabase MCP to verify schema changes
4. Document in migration file
5. Commit to git

### Deploying
- Git push to main = auto-deploy
- Manual deploy via Vercel dashboard if needed
- Monitor deployments in Vercel

## Project Goals

1. **Build robust SaaS platform** for AI prompt management
2. **Leverage Claude Desktop MCP** for seamless Supabase integration
3. **Native development** - no containers, direct filesystem access
4. **Production-ready** - proper security, validation, error handling
5. **Scalable architecture** - ready for multi-user, multi-tenant expansion

## Notes

- Project was originally called "MonsterMaker Dashboard" - some old references may remain
- README.md needs updating to reflect RopeBridge branding
- Database migrations are ready but not yet executed on Supabase project
- Currently in transition from localStorage to full Supabase backend
