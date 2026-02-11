<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# OpenMemory - Your Digital Love Story 💕

A beautiful, AI-powered memory journal for couples to capture and cherish their special moments together.

## ✨ Features

- 📸 **Memory Timeline** - Chronicle your journey together
- 🤖 **AI-Powered Captions** - Get romantic caption suggestions
- 🎨 **Beautiful UI** - Modern, playful design with smooth animations
- 🔐 **Secure Storage** - Powered by Supabase
- 📱 **Responsive** - Works perfectly on all devices
- 🚀 **Fast & Optimized** - Code-split for optimal performance

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- A Supabase account
- A Google Gemini API key

### Local Development

1. **Clone and Install**

   ```bash
   git clone <your-repo-url>
   cd openmemory
   npm install
   ```

2. **Setup Environment Variables**

   Create a `.env.local` file in the root directory:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   VITE_GEMINI_API_KEY=your-gemini-api-key
   ```

3. **Setup Supabase Database**

   See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for detailed instructions.

4. **Run the App**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`

## 📦 Deployment

### Deploy to Vercel (Recommended)

This app is **production-ready** and optimized for Vercel deployment!

**Quick Deploy:**

1. Push your code to GitHub
2. Import project in [Vercel Dashboard](https://vercel.com/dashboard)
3. Add environment variables (see `.env.local`)
4. Deploy! 🎉

**Detailed Instructions:** See [DEPLOYMENT_SUMMARY.md](./DEPLOYMENT_SUMMARY.md)

### Build for Production

```bash
npm run build
npm run preview  # Test production build locally
```

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Routing**: React Router v7
- **Styling**: Vanilla CSS with custom design system
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Icons**: Lucide React
- **Deployment**: Vercel

## 📚 Documentation

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Deployment Guide](./DEPLOYMENT_SUMMARY.md)
- [Vercel Deployment](./VERCEL_DEPLOY.md)

## 🎨 Performance

- ✅ Code-split routes for faster initial load
- ✅ Lazy-loaded components
- ✅ Optimized bundle size (~125 KB gzipped)
- ✅ Responsive images
- ✅ Smooth animations

## 🔒 Security

- Row-Level Security (RLS) enabled on Supabase
- Secure authentication flow
- Environment variables for sensitive data
- HTTPS enforced on production

## 📄 License

MIT License - feel free to use this for your own projects!

---

Made with ❤️ for couples everywhere
