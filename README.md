# PAWBERRY — Innovative, Affordable Pet Products

A Next.js 16 e-commerce platform for pet products with cart, wishlist, checkout, admin dashboard, and support chatbot.

## Features

- **Product Catalog**: Interactive toys, pet houses, cat washrooms with category filtering, search, and sorting
- **Shopping Cart**: Persistent localStorage cart with quantity controls, stock limits, and fly-to-cart animation
- **Wishlist**: Heart-toggle on product cards, dedicated wishlist page, move to cart
- **Checkout**: Address form with saved addresses, COD/demo/online payment (Razorpay), order confirmation
- **User Profile**: Avatar upload/preview/remove (emoji or photo), saved addresses, order history
- **Orders**: My orders list with cancel (auto-restock), order detail with status tracker, guest order lookup
- **Admin Dashboard**: Products CRUD, orders management with status updates, support ticket system
- **Support Chatbot**: Quick replies, order lookup, cancel/return/refund flows with confirm step, ticket creation, status polling
- **PawPlay Match**: 4-step pet questionnaire → scored product recommendations → add to cart
- **Gallery**: User photo uploads with compression, public display
- **Reviews**: Star ratings, customer reviews with submission form
- **Newsletter**: Email capture with duplicate detection

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS 4, custom animations
- **Storage**: Vercel Blob (products, orders, users, gallery, reviews, newsletter, support tickets)
- **Auth**: HttpOnly cookies (`pb_user`, `pb_admin`), middleware protection
- **Payments**: Razorpay integration (demo mode when keys not configured)
- **Deployment**: Vercel (zero-config)

## Quick Start

```bash
# Clone and install
git clone https://github.com/roshanvernekar3/01fe19bcs117-hwa-hackathon.git
cd 01fe19bcs117-hwa-hackathon
npm install

# Configure environment
cp .env.example .env.local
# Add your keys:
# BLOB_READ_WRITE_TOKEN=vercel_blob_token
# BLOB_STORE_ID=vercel_blob_store_id
# ADMIN_PASSWORD=pawberry-admin  (default)
# RESEND_API_KEY=optional_for_emails
# RAZORPAY_KEY_ID=optional
# RAZORPAY_KEY_SECRET=optional

# Run development server
npm run dev
# Open http://localhost:3000
```

## Project Structure

```
src/
├── app/
│   ├── (pages)/           # Public pages (home, products, cart, checkout, etc.)
│   ├── admin/             # Admin dashboard (protected)
│   ├── api/               # API routes
│   │   ├── admin/         # Admin-only APIs
│   │   ├── auth/          # Auth endpoints
│   │   ├── payment/       # Razorpay config + verification
│   │   └── ...            # Products, orders, cart, wishlist, gallery, reviews, newsletter, support
│   └── layout.tsx         # Root layout with Providers
├── components/
│   ├── AddToCart.tsx      # Qty stepper, wishlist, fly animation
│   ├── ChatWidget.tsx     # Support chatbot
│   ├── FlyLayer.tsx       # Emoji flight animation
│   ├── ProductCard.tsx    # Product grid card (aligned, equal height)
│   ├── ProfileMenu.tsx    # Avatar dropdown menu
│   ├── AvatarViewer.tsx   # Fullscreen image zoom
│   ├── Reveal.tsx         # IntersectionObserver fade-in
│   └── ...                # Footer, Header, GallerySection, etc.
├── lib/
│   ├── cart-context.tsx   # Cart state (localStorage)
│   ├── wishlist-context.tsx # Wishlist state (localStorage)
│   ├── orders.ts          # Order persistence (Vercel Blob)
│   ├── products-store.ts  # Product catalog (Vercel Blob)
│   ├── products.ts        # Product types + static catalog fallback
│   ├── users.ts           # User accounts (Vercel Blob)
│   ├── addresses.ts       # Saved addresses (Vercel Blob)
│   ├── support.ts         # Support ticket types + CRUD
│   ├── restock.ts         # Restock notifications
│   ├── sound.ts           # Web Audio API tones
│   └── blob.ts            # Blob helpers (fetch with cache-busting)
└── middleware.ts          # Admin route protection
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BLOB_READ_WRITE_TOKEN` | Yes | Vercel Blob RW token |
| `BLOB_STORE_ID` | Yes | Vercel Blob store ID |
| `ADMIN_PASSWORD` | No | Admin cookie secret (default: `pawberry-admin`) |
| `RESEND_API_KEY` | No | For restock emails |
| `RAZORPAY_KEY_ID` | No | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | No | Razorpay key secret |

## Admin Access

1. Go to `/admin/login`
2. Enter password from `ADMIN_PASSWORD` (default: `pawberry-admin`)
3. Access Products, Orders, Support tabs

## Development Commands

```bash
npm run dev      # Start dev server (Turbopack)
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint check
npx tsc --noEmit # TypeScript check
```

## Deployment

Connected to Vercel project `01fe19bcs117-hwa-hackathon`. Push to `main` auto-deploys:

```bash
git push origin main
# Or manual: vercel --prod
```

Live at: **https://01fe19bcs117-hwa-hackathon.vercel.app**

## Security Notes

- `.env.local` is gitignored — never commit secrets
- Admin routes protected by middleware (cookie check)
- HttpOnly cookies for auth tokens
- Razorpay keys only used server-side
- Vercel Blob tokens never exposed to client

## License

MIT
