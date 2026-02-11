# Deploying to Vercel

### 1. Push to GitHub

Make sure your project is pushed to a GitHub repository.

### 2. Import Project in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New** -> **Project**.
3. Import your GitHub repository.

### 3. Configure Environment Variables

In the "Environment Variables" section of the deployment setup, add the following keys from your `.env.local`:

| Key                      | Value Description          |
| ------------------------ | -------------------------- |
| `VITE_SUPABASE_URL`      | Your Supabase Project URL  |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Anon Key     |
| `VITE_GEMINI_API_KEY`    | Your Google Gemini API Key |

### 4. Deploy

Click **Deploy**. Vercel will automatically detect Vite and build your project.

### Troubleshooting

If you encounter 404 errors on refresh, the included `vercel.json` file handles the rewrites for the Single Page Application (SPA).
