# Supabase Setup Guide

## 1. Project Create
- https://supabase.com → New Project
- Name: `tradedu`
- Database password: strong password set karein (save kar lein)
- Region: Southeast Asia (Singapore) — Pakistan ke liye closest

## 2. Schema Run
- Dashboard → **SQL Editor** → New Query
- `supabase-schema.sql` ka content paste karein → **Run**
- Tables: `profiles`, `subscription_requests` ban jayenge

## 3. API Keys
- Dashboard → **Settings** → **API**
- Copy:
  - `Project URL` → `VITE_SUPABASE_URL`
  - `anon public` key → `VITE_SUPABASE_ANON_KEY`

## 4. Environment Variables
Project root me `.env.local` file banayein:
```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```
**Important:** `.env.local` ko `.gitignore` me rakhein (secrets git me nahi jaane chahiye).

## 5. Vercel Me Bhi Set Karein
- Vercel → tradedu project → Settings → Environment Variables
- Same 2 variables add karein (Production + Preview dono)

## 6. First Admin Banao
- Pehli baar site pe signup karein (apna email se)
- Supabase → Table Editor → `profiles`
- Apni row me `role` = `admin` set karein
- Ab aap admin panel me students dekh sakte hain

## Features
- ✅ Email/password auth (Supabase built-in)
- ✅ Session persistence (auto-login on refresh)
- ✅ Profiles table (name, phone, city, experience, plan)
- ✅ Subscription requests (students submit → admin approves)
- ✅ Row Level Security (sirf apna data, admin sab dekh sakta)
- ✅ Plan gating (FREE / STARTER / PREMIUM)

## Admin Flow
1. Student signup → profile auto-create (plan=FREE)
2. Student Subscribe page → subscription_request (pending)
3. Admin panel → approve → profile.plan update
4. Student ko features mil jate hain
