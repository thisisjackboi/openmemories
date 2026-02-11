# 🚀 Vercel Deployment Checklist

Use this checklist to ensure a smooth deployment to Vercel.

## ✅ Pre-Deployment Checklist

### 1. Code & Build

- [x] Code-splitting implemented (React.lazy)
- [x] Suspense boundaries added
- [x] Build completes without errors
- [x] Bundle size optimized (~125 KB gzipped)
- [x] Production build tested locally (`npm run build && npm run preview`)

### 2. Configuration Files

- [x] `vercel.json` created (SPA routing)
- [x] `.gitignore` includes `.env.local`
- [x] `package.json` has correct build scripts
- [x] Environment variables documented

### 3. Environment Variables Ready

Prepare these values before deployment:

- [ ] `VITE_SUPABASE_URL` - Get from Supabase Dashboard → Settings → API
- [ ] `VITE_SUPABASE_ANON_KEY` - Get from Supabase Dashboard → Settings → API
- [ ] `VITE_GEMINI_API_KEY` - Get from Google AI Studio

### 4. Supabase Setup

- [ ] Database schema created (run `supabase_schema.sql`)
- [ ] Storage bucket created (run `create_memories_bucket.sql`)
- [ ] Row-Level Security policies enabled (run `fix_memories_rls.sql`)
- [ ] Test authentication works locally

### 5. Git Repository

- [ ] Code committed to Git
- [ ] Pushed to GitHub/GitLab/Bitbucket
- [ ] Repository is accessible

## 📋 Deployment Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### Step 2: Import to Vercel

1. Go to https://vercel.com/dashboard
2. Click **"Add New"** → **"Project"**
3. Select your Git provider (GitHub/GitLab/Bitbucket)
4. Import your repository

### Step 3: Configure Project

Vercel will auto-detect:

- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Install Command: `npm install`

**No changes needed** - just click **Continue**

### Step 4: Add Environment Variables

In the deployment configuration:

1. Click **"Environment Variables"**
2. Add each variable:

| Name                     | Value                     | Environment                      |
| ------------------------ | ------------------------- | -------------------------------- |
| `VITE_SUPABASE_URL`      | `https://xxx.supabase.co` | Production, Preview, Development |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGc...`              | Production, Preview, Development |
| `VITE_GEMINI_API_KEY`    | `AIza...`                 | Production, Preview, Development |

3. Click **"Add"** for each variable

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (~1-2 minutes)
3. Get your deployment URL: `https://your-app.vercel.app`

## ✅ Post-Deployment Checklist

### Test Your Deployment

- [ ] Visit your Vercel URL
- [ ] Test signup/login flow
- [ ] Create a test memory
- [ ] Upload an image
- [ ] Test AI caption generation
- [ ] Navigate between pages
- [ ] Refresh page (test SPA routing)
- [ ] Test on mobile device

### Optional: Custom Domain

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Monitor Performance

- [ ] Check Vercel Analytics
- [ ] Monitor build times
- [ ] Check for any errors in logs

## 🔧 Troubleshooting

### Build Fails

**Check:**

- All dependencies in `package.json`
- Node version compatibility
- Build logs for specific errors

**Fix:**

```bash
# Test locally first
npm run build
```

### Environment Variables Not Working

**Check:**

- Variable names have `VITE_` prefix
- No typos in variable names
- Variables added to correct environment

**Fix:**

- Redeploy after adding variables
- Check Vercel deployment logs

### 404 on Page Refresh

**Check:**

- `vercel.json` exists and is correct
- Rewrites configuration is present

**Fix:**

- Already handled by `vercel.json` ✅

### Images Not Loading

**Check:**

- Supabase storage bucket is public
- RLS policies allow read access
- Image URLs are correct

**Fix:**

- Run `create_memories_bucket.sql`
- Check Supabase Storage settings

## 📊 Expected Results

### Build Output

```
✓ 1775 modules transformed
dist/index.html                   2.50 kB │ gzip:   1.01 kB
dist/assets/index-CxYiSG56.css    2.14 kB │ gzip:   0.71 kB
dist/assets/index-Bsoy6COQ.js   419.91 kB │ gzip: 124.70 kB
+ 13 lazy-loaded page chunks
✓ built in ~4-5s
```

### Performance Metrics

- **Initial Load**: ~125 KB (gzipped)
- **Time to Interactive**: < 2s
- **Lighthouse Score**: 90+ (Performance)

## 🎉 Success!

Once deployed, you'll have:

- ✅ Live production URL
- ✅ Automatic HTTPS
- ✅ Global CDN distribution
- ✅ Automatic deployments on git push
- ✅ Preview deployments for PRs
- ✅ Built-in analytics

---

**Need Help?** Check:

- [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md) - Detailed guide
- [Vercel Docs](https://vercel.com/docs) - Official documentation
- [Supabase Docs](https://supabase.com/docs) - Database help
