# MonsterMaker Dashboard - Luke's Deployment Playbook

**Last Updated:** January 11, 2026  
**Status:** ✅ Ready to Deploy  
**Method:** Verified Working (same as hello-world-vercel)

---

## 🎯 Your Verified Deployment Workflow

This follows the **exact same process** that successfully deployed hello-world-vercel.

### Why This Method Works

**The Problem:**
- Claude's computer has network restrictions that block:
  - Direct Vercel API calls
  - Vercel CLI with token authentication
  - Some npm package installations

**The Solution:**
Build on Claude's computer → Download to Luke's computer → Deploy from Luke's computer

**This workflow:**
1. ✅ Leverages Claude's unlimited development capabilities
2. ✅ Uses Luke's unrestricted network for deployment
3. ✅ Maintains full version control
4. ✅ Allows Claude to verify deployment via Vercel MCP tools

---

## 📋 Technical Context

### Your Vercel Account Information

- **Team Name:** Luke's projects
- **Team Slug:** `lukes-projects-6653fc00`
- **Team ID:** `team_xzRqNdkxHAaEPYaR6JA9KdZf`
- **Vercel Token:** `nETtsXJd2vwPZEYruRBnxQmG`

### Existing Projects

1. `agent-forge` (ID: `prj_3XZw8igWraX79SgdtvMqVXsFtGck`)
2. `my-agent-forge` (ID: `prj_LXEDqAYOYmOooY98gGCfVjbVLnCr`)
3. `shattr-backend` (ID: `prj_INZANgbKtVWOB3KylyJcIeevkxgW`)
4. `hello-world-vercel` (ID: `prj_sxYnG1fwC9jhkHAoOMnjR8KTpmkN`) ✅ Successfully deployed

### Local Directories

- **Claude's staging directory:** `/home/claude/` (on Claude's computer)
- **Luke's deployment directory:** `C:\CLAUDE\` (on Luke's Windows computer)

---

## 🚀 The Deployment Process

### Phase 1: Build (Claude's Computer) ✅ COMPLETE

**Step 1.1: Create Project Directory**
```bash
mkdir -p /home/claude/monstermaker-dashboard
cd /home/claude/monstermaker-dashboard
```

**Step 1.2: Build All Required Files**

Essential Files:
- `index.html` or framework entry point ✅
- `package.json` - Project metadata and scripts ✅
- `vercel.json` - Vercel configuration ✅
- `README.md` - Documentation ✅

Framework-specific (Next.js):
- `app/` directory structure ✅
- `components/` ✅
- `types/` ✅
- All configuration files ✅

**Step 1.3: Initialize Git Repository**
```bash
cd /home/claude/monstermaker-dashboard
git config --global user.email "luke@savagearmada.com"
git config --global user.name "Luke"
git init
git add .
git commit -m "Initial commit: MonsterMaker Dashboard"
```

**Step 1.4: Verify Project Structure**
```bash
ls -la
```

**Step 1.5: Present Files to Luke**
Files made available via `present_files` tool ✅

---

### Phase 2: Download (Luke's Computer)

**Step 2.1: Download Files**
Luke downloads the `monstermaker-dashboard.tar.gz` file from Claude chat interface.

**Step 2.2: Extract to Deployment Directory**
```powershell
# Extract to C:\CLAUDE\monstermaker-dashboard
```

**Step 2.3: Verify All Files Present**
Luke confirms all necessary files are in the directory before proceeding.

---

### Phase 3: Deploy (Luke's Computer)

**Step 3.1: Open Terminal**
Luke opens PowerShell or Command Prompt on Windows.

**Step 3.2: Navigate to Project**
```powershell
cd C:\CLAUDE\monstermaker-dashboard
```

**Step 3.3: Run Deployment Command**
```powershell
npx vercel --prod --token nETtsXJd2vwPZEYruRBnxQmG
```

**Step 3.4: Follow CLI Prompts**

The Vercel CLI will ask:

1. **"Set up and deploy...?"** → Type `yes`
2. **"Which scope?"** → Select `Luke's projects`
3. **"Link to existing project?"** → Type `no` (for new projects)
4. **"Project's name?"** → Type `monstermaker-dashboard`
5. **"In which directory?"** → Type `.` (just press Enter)
6. **"Change settings?"** → Type `no`

**Step 3.5: Deployment Completes**

CLI will output:
```
✅ Production: https://monstermaker-dashboard-[hash].vercel.app
```

---

### Phase 4: Verify (Via Claude)

**Step 4.1: Get Project Details**

Claude can verify using Vercel MCP:
```
Vercel:get_project
projectId: monstermaker-dashboard
teamId: team_xzRqNdkxHAaEPYaR6JA9KdZf
```

**Step 4.2: Check Deployment Status**

Verify the response shows:
- `readyState: "READY"`
- `target: "production"`
- List of domain URLs

**Step 4.3: Fetch Live URL**

Use `web_fetch` (if accessible) or instruct Luke to open URLs in browser.

**Step 4.4: Confirm Success**

Report to Luke:
- ✅ Deployment ID
- ✅ Primary URL
- ✅ All available domain URLs
- ✅ Deployment status

---

## ✅ Reusable Deployment Checklist

### Pre-Deployment:
- [ ] Project name decided
- [ ] All content finalized
- [ ] Design approved
- [ ] Assets optimized
- [ ] Mobile responsiveness verified

### Build Phase:
- [ ] Create project directory on Claude's computer
- [ ] Build all HTML/CSS/JS/framework files
- [ ] Create package.json
- [ ] Create vercel.json (optional)
- [ ] Create README.md
- [ ] Initialize git repository
- [ ] Commit all files
- [ ] Verify all files exist
- [ ] Present files to Luke via present_files tool

### Download Phase:
- [ ] Luke downloads all files from chat
- [ ] Luke saves files to `C:\CLAUDE\monstermaker-dashboard\`
- [ ] Luke verifies all files are present

### Deploy Phase:
- [ ] Luke opens terminal
- [ ] Navigate to project directory
- [ ] Run `npx vercel --prod --token nETtsXJd2vwPZEYruRBnxQmG`
- [ ] Answer CLI prompts correctly
- [ ] Note deployment URL

### Verification Phase:
- [ ] Use Vercel MCP to fetch project details
- [ ] Confirm READY status
- [ ] Test live URL
- [ ] Verify all pages load
- [ ] Test mobile responsiveness
- [ ] Check performance

---

## 🚫 What NOT to Do

### ❌ Don't Try These (They Won't Work):

1. **Direct API Deployment from Claude's Computer**
   - Reason: Network restrictions block Vercel API

2. **Installing Vercel CLI Globally on Claude's Computer**
   - Reason: Network restrictions during npm install

3. **Using Token in Environment Variable on Claude's Computer**
   - Reason: Token works, but network blocks the API calls

4. **Deploying via GitHub Integration Before Testing**
   - Reason: Adds unnecessary complexity for first deployment

### ⚠️ Common Mistakes to Avoid:

1. **Forgetting to initialize git** - Deployment works but version control lost
2. **Not verifying file download** - Missing files cause deployment failures
3. **Answering "yes" to "Link to existing project?"** when deploying new sites
4. **Using wrong project name** - Creates confusion in Vercel dashboard
5. **Skipping verification phase** - Miss deployment errors

---

## 📊 Success Metrics

### A Successful Deployment Shows:

- ✅ CLI outputs "Production: [URL]"
- ✅ Vercel:get_project returns `readyState: "READY"`
- ✅ Live URL loads correctly
- ✅ All pages accessible
- ✅ No console errors
- ✅ Mobile responsive

---

## 🔧 Troubleshooting

### If Deployment Fails:

1. **Check build logs via Vercel MCP:**
   ```
   Vercel:get_deployment_build_logs
   idOrUrl: [deployment-id]
   teamId: team_xzRqNdkxHAaEPYaR6JA9KdZf
   ```

2. **Common Issues:**
   - Missing index.html → Add entry point
   - Invalid vercel.json → Fix JSON syntax
   - Port conflicts → Vercel handles this automatically
   - Build errors → Check logs for specifics

3. **Recovery Steps:**
   - Fix issues on Claude's computer
   - Re-present files to Luke
   - Luke re-downloads and saves
   - Re-run deployment command
   - Vercel will create new deployment automatically

---

## 🎉 Success Story

### hello-world-vercel - November 24, 2024

- **Project:** hello-world-vercel
- **Deployment Time:** ~10 seconds
- **Status:** ✅ Successfully deployed
- **URLs:**
  - Primary: https://hello-world-vercel-seven-iota.vercel.app
  - Alt: https://hello-world-vercel-lukes-projects-6653fc00.vercel.app
- **Deployment ID:** `dpl_DbVkkXJNDrGEA8FW7ctgXZ1AxLHd`
- **Method:** Exactly as documented in this playbook

**Key Insight:** This method works flawlessly because it separates Claude's build capabilities from Luke's network access. Future deployments should follow this exact pattern.

---

## 📞 Quick Reference Commands

### For Claude:

**Create Project Directory:**
```bash
bash_tool: mkdir -p /home/claude/monstermaker-dashboard && cd /home/claude/monstermaker-dashboard
```

**Initialize Git:**
```bash
bash_tool:
git config --global user.email "luke@savagearmada.com"
git config --global user.name "Luke"
git init
git add .
git commit -m "Initial commit"
```

**Present Files to Luke:**
```
present_files: [array of all project file paths]
```

**Verify Deployment:**
```
Vercel:get_project
projectId: monstermaker-dashboard
teamId: team_xzRqNdkxHAaEPYaR6JA9KdZf
```

### For Luke:

**Deploy Command:**
```powershell
cd C:\CLAUDE\monstermaker-dashboard
npx vercel --prod --token nETtsXJd2vwPZEYruRBnxQmG
```

**CLI Responses:**
- Set up and deploy? → `yes`
- Which scope? → `Luke's projects`
- Link to existing? → `no`
- Project name? → `monstermaker-dashboard`
- Directory? → `.`
- Change settings? → `no`

---

## 🎯 MonsterMaker Specific Notes

### Project Details

- **Name:** monstermaker-dashboard
- **Type:** Next.js 14 (App Router)
- **Purpose:** Dashboard for creating/managing secret prompts
- **Target URL:** `https://monstermaker-dashboard-[hash].vercel.app`

### Post-Deployment

Once deployed, the dashboard will be fully functional with:
- LocalStorage persistence (no backend needed)
- All 6 sections of prompt builder
- Drag-and-drop functionality
- Mobile-responsive UI
- Form validation

### Future Enhancements

When ready to add backend:
1. Keep this deployed version as frontend
2. Add Vercel Postgres or Supabase
3. Create API routes in `/app/api/`
4. Replace localStorage calls with API calls

---

**This playbook ensures consistent, reliable deployments every time!**
