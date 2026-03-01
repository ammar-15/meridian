# Meridian Waitlist

Static waitlist landing page built with Next.js App Router.

## Features

- Light/Dark theme toggle
- Supabase waitlist submission (`waitlist.waitlist`)
- Required Name + Email with inline validation
- Optional Suggestions field
- Success/Error toasts and loading state
- Snapshots section (`/public/snapshots/1.png` to `4.png`)

## Environment

Uses existing variables in `.env`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
