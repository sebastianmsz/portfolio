# Portfolio (Next.js + Secure Contact API)

Modern, responsive portfolio built with Next.js 15 and TypeScript. Includes a production-ready API for a secure contact form (CSRF, rate limiting, validation, logging).

## Demo

Live: https://sebastianmsz.vercel.app/

## Features

- UI: Tailwind CSS, dark/light mode, EN/ES i18n, mobile-first, smooth animations
- API: Contact form email, CSRF token endpoint, health check
- Security: Helmet security headers, CORS, CSRF validation (prod), rate limiting
- Robustness: Joi validation, Winston logging, retrying SMTP with pooling

## Tech Stack

- Frontend: Next.js 15, React 18, TypeScript, Tailwind CSS, Radix UI, Framer Motion
- Backend: Next.js API Routes, Node.js, Nodemailer
- Validation & Security: Joi, Helmet, rate-limiter-flexible
- Logging: Winston (files locally, console on read-only hosts like Vercel)

## Quick start

1. Install

```bash
npm install
```

2. Configure environment (.env.local)

Create .env.local in the project root:

```env
# Required
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_RECEIVER=your-email@gmail.com

# Optional
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
RATE_LIMIT_MAX=5               # requests per window per IP
RATE_LIMIT_WINDOW=900          # seconds (15m)
NODE_ENV=development
ALLOWED_ORIGINS=*              # comma-separated origins or *
CSRF_ROTATE_ON_USE=false       # rotate CSRF token after use in prod only
TRUSTED_IPS=                   # comma-separated, used in prod checks
```

3. Run

```bash
npm run dev
```

App: http://localhost:3000

## API

Endpoints

- GET /api/health — basic health and env checks
- GET /api/csrf-token — issue a CSRF token + session id
- POST /api/send-email — send a contact email (rate-limited)

Request/response wrapper

- Success: { success: true, data, requestId }
- Error: { success: false, error, code?, details?, requestId }

CSRF flow (recommended in dev; enforced in production)

1. Get token and session id

```bash
curl -s http://localhost:3000/api/csrf-token
```

2. Send email using headers X-CSRF-Token and X-Session-Id

```bash
curl -s -X POST http://localhost:3000/api/send-email \
   -H "Content-Type: application/json" \
   -H "X-CSRF-Token: <token>" \
   -H "X-Session-Id: <sessionId>" \
   -d '{"name":"Jane Doe","email":"jane@example.com","message":"Hello!"}'
```

Rate limits

- Default: 5 requests / 15 minutes / IP (configurable via env)
- 429 responses include Retry-After and X-RateLimit-\* headers

## Gmail setup (SMTP)

Use an App Password:

1. Enable 2FA in your Google account
2. Generate an App Password for “Mail” and use it as EMAIL_PASS

## Scripts

```bash
npm run dev     # Start dev server
npm run build   # Build for production
npm run start   # Start production server
npm run lint    # ESLint
```

## Project structure

```
app/                 # App Router, pages and layout
   components/        # App-specific UI (sections, toggles, etc.)
   contexts/          # React contexts (language, theme)
components/ui/       # Reusable UI primitives (Radix/shadcn-inspired)
hooks/               # React hooks
lib/                 # Server-side utilities (config, email, logger, security)
pages/api/           # API routes: csrf-token, health, send-email
public/              # Static assets
logs/                # Local logs (ignored on Vercel)
```

## Security notes

- Development: CSRF check is relaxed; still test the CSRF flow locally
- Production: configure ALLOWED_ORIGINS, HTTPS, and keep rate limits sensible
- Vercel: file logging is disabled (read-only); logs go to console

## Deployment (Vercel)

1. Connect repo → Vercel
2. Set env vars in Project Settings → Environment Variables
3. Deploy

## License

MIT — see LICENSE.
