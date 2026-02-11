# 🚀 Connecting Supabase to Localhost

Use this guide to connect your local React app to your Supabase cloud database.

## 1. Understanding the Connection

Even though your app is running on `http://localhost:5173`, your database lives in the cloud at Supabase.com. You connect them using an API URL and Key.

## 2. Find Your Credentials

1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard/projects).
2.  Click on your project (or create one: "New Project").
3.  In the left sidebar, click the **Settings** icon (cog wheel ⚙️) at the bottom.
4.  Click **API** in the settings menu.
5.  Look for the **Project URL** and **anon public** key.

## 3. Configure Your App

1.  Open the file `.env.local` in your project root (create it if missing).
2.  Paste your credentials like this:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 4. Restart Development Server

Stop (`Ctrl+C`) and restart your server to load the new credentials:

```bash
npm run dev
```

## 5. Verify Connection

If configured correctly, the app will now be able to Sign Up and Login users!
