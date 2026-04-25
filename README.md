# Peeman Cleaning Services — Frontend

**Tech Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Axios · React Hook Form · Zod · Framer Motion

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set environment variables
```bash
cp .env.local.example .env.local
```
Edit `.env.local` with your values:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=441902000000
NEXT_PUBLIC_PHONE=+441902000000
NEXT_PUBLIC_EMAIL=
NEXT_PUBLIC_ADDRESS=Victoria Street, Wolverhampton, WV1 3NP
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 4. Build for production
```bash
npm run build
npm start
```

---

## Project Structure

```
peeman-web/
├── app/
│   ├── layout.tsx          # Root layout (fonts, Navbar, Footer, Toaster)
│   ├── page.tsx            # Home page (all sections composed here)
│   ├── globals.css         # Tailwind directives + custom CSS vars
│   ├── services/
│   │   └── page.tsx        # Services listing page
│   ├── contact/
│   │   └── page.tsx        # Standalone contact page
│   ├── admin/
│   │   └── page.tsx        # Admin dashboard (enquiries + bookings table)
│   └── api/
│       └── enquiries/
│           └── route.ts    # Next.js API proxy route → Express backend
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx          # Sticky nav with mobile drawer
│   │   ├── Footer.tsx          # Multi-column footer
│   │   └── FloatingWhatsApp.tsx # Fixed WhatsApp button
│   ├── sections/
│   │   ├── HeroSection.tsx     # Hero with badges + stats
│   │   ├── StripBanner.tsx     # Service quick-links strip
│   │   ├── ServicesSection.tsx # 6-card service grid
│   │   ├── WhyUsSection.tsx    # 6-point numbered features
│   │   ├── ProcessSection.tsx  # 4-step process with dashed line
│   │   ├── ReviewsSection.tsx  # Customer review cards
│   │   └── ContactSection.tsx  # Channel cards + enquiry form
│   ├── forms/
│   │   └── EnquiryForm.tsx     # RHF + Zod validated enquiry form
│   └── ui/
│       ├── button.tsx          # shadcn Button (CVA variants)
│       ├── input.tsx           # shadcn Input
│       ├── textarea.tsx        # shadcn Textarea
│       ├── label.tsx           # shadcn Label
│       ├── select.tsx          # shadcn Select (Radix)
│       └── toast.tsx           # shadcn Toast (Radix)
│
├── hooks/
│   ├── useEnquiry.ts       # Enquiry submit state hook
│   └── useBooking.ts       # Booking submit state hook
│
├── lib/
│   ├── api.ts              # Axios client + API functions
│   ├── constants.ts        # All site data (SITE, SERVICES, STATS, etc.)
│   └── utils.ts            # cn() tailwind merge utility
│
├── types/
│   └── index.ts            # Shared TypeScript interfaces
│
├── tailwind.config.ts      # Custom colours: pine, sage, cream, gold, bark
├── next.config.ts          # Image domains + API rewrites
└── tsconfig.json
```

---

## Key Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — all sections |
| `/services` | Full services listing |
| `/contact` | Standalone contact page |
| `/admin` | Admin dashboard (no auth guard — add `protect` middleware for production) |

---

## Contact Channels

All contact details are centralised in `lib/constants.ts` under `SITE`:

```ts
export const SITE = {
  phone:    "+44 1902 000 000",
  whatsapp: "441902000000",   // used in wa.me/ links
  email:    "peacee4real@gmail.com",
  address:  "23 Victoria Street",
  city:     "Wolverhampton",
  postcode: "WV1 3NP",
};
```

Update those values and every page, nav, footer and form updates automatically.

---

## Colour Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `pine` | `#1B4332` | Primary dark green — hero bg, nav |
| `pine-mid` | `#2D6A4F` | Strip banner, hover states |
| `pine-light` | `#40916C` | Accent bars, section labels |
| `sage` | `#74C69D` | Borders on dark bg, highlights |
| `sage-pale` | `#D8F3DC` | Service icon backgrounds |
| `cream` | `#F8F5EF` | Page background |
| `cream-mid` | `#EDE8DE` | Card borders, process section bg |
| `gold` | `#C9A84C` | CTA buttons, stat numbers |
| `gold-light` | `#F0D080` | Hero heading accent, hover CTAs |

---

## Deployment — Vercel

1. Push to GitHub
2. Import repo in [vercel.com](https://vercel.com)
3. Set **Root Directory** → leave empty (or `peeman-web` if in a monorepo)
4. Add all `NEXT_PUBLIC_*` environment variables
5. Deploy — CI/CD triggers on every push to `main`
