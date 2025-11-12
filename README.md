# AI Skills Landing (Minimal Next.js)

This is a minimal Next.js project (pages directory) containing:
- A single landing page at `/` with signup form configuration, UTM capture, and WhatsApp CTAs.
- A serverless API at `/api/check-form` for server-side HEAD checks (Vercel).
- A Netlify function example at `netlify/functions/check-form.js`.

## Quick deploy (Vercel)

1. Install Vercel CLI (optional):

2. From this repo root:

3. Alternatively, push to GitHub and import the repo in Vercel dashboard.

### Environment
Set `FORM_CHECK_KEY` in Vercel Dashboard (optional) for API protection.

## Quick deploy (Netlify Functions)

1. Push repo to GitHub.
2. In Netlify dashboard, create a new site from Git, set build command:
and publish directory:
and publish directory:
3. Ensure `netlify/functions` folder is picked up (Netlify will build functions from there).
4. Set `FORM_CHECK_KEY` in Site settings -> Build & deploy -> Environment.

## Local dev

