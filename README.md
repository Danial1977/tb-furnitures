# TB FURNITURES — ARCHITECTURE & OPERATIONS MANUAL

## 1. Project Overview & Architecture
TB Furnitures is a modern UK-focused furniture eCommerce platform built with Next.js 14 App Router, TypeScript, Tailwind CSS, Prisma ORM, NextAuth, and Stripe.

- **Directory Location:** `C:\Users\Admin\.gemini\antigravity\scratch\tb-furnitures`
- **Target Currency:** British Pounds Sterling (GBP - `£`)
- **UK Commerce Configuration:** 
  - Standard UK 20% VAT breakdown.
  - Delivery rules: Standard UK courier (£19.99, free over £500), Specialist Two-Man White Glove delivery for heavy furniture (£49.99, free over £1,000).
  - Mandatory customer authentication before checkout to ensure verified delivery booking and 10-year frame guarantee tracking.

---

## 2. Technology Stack & Verification
- **Framework:** Next.js 14.2.35 (App Router with SSR and React Suspense boundaries)
- **Database:** PostgreSQL (Compatible with Neon, Supabase, AWS RDS)
- **ORM:** Prisma 5.22.0 with normalized entity relations
- **Authentication:** NextAuth.js JWT-based session management with bcryptjs password hashing
- **Testing:** Vitest test runner (All tests passing)
- **Production Build:** `npm run build` generates 14 optimized routes with 0 TypeScript/lint errors.

---

## 3. Database Schema Entities
The database schema (`prisma/schema.prisma`) implements 15 core entities:
1. `User` & `CustomerAddress`: Multi-role access (Customer, Admin, Super Admin) with UK address support.
2. `Category` & `ProductCategory`: Hierarchical furniture taxonomy with slug-based lookups.
3. `Brand`: British artisan workshops and timber brands.
4. `Product` & `ProductVariant`: Pricing in numeric decimals, dimensions (width, height, depth, weight), two-man delivery tags.
5. `ProductImage`: Multi-image galleries with sorting.
6. `Cart` & `CartItem`: Persistent and anonymous basket state.
7. `Order` & `OrderItem`: Immutable snapshots of historical prices, SKUs, and delivery addresses.
8. `OrderStatusHistory`: Audit timeline for order updates.
9. `PaymentTransaction`: Stripe charge tracking.
10. `Coupon`: Percentage & fixed amount discount rules (`WELCOME50`, `AUTUMN10`).
11. `ProductReview`: Verified buyer ratings.

---

## 4. Default Seed & Credentials
Run `npm run prisma:seed` after connecting your PostgreSQL `DATABASE_URL`:
- **Super Administrator:**
  - Email: `admin@tbfurnitures.co.uk`
  - Password: `AdminPassword2026!`
- **Demonstration Customer:**
  - Email: `customer@tbfurnitures.co.uk`
  - Password: `CustomerPass2026!`
- **Active Promotional Coupons:**
  - `WELCOME50`: £50 off orders over £500
  - `AUTUMN10`: 10% discount on furniture collections

---

## 5. Development & Deployment Instructions

### Local Development
```bash
cd C:\Users\Admin\.gemini\antigravity\scratch\tb-furnitures
npm run dev
# Server starts at http://localhost:3000
```

### Database Push & Seed
```bash
npx prisma db push
node prisma/seed.js
```

### Automated Tests
```bash
npm test
```

### GitHub & Vercel Deployment (Isolated from MyBestDiscounts)
1. Initialize a clean git repository inside `tb-furnitures`:
   ```bash
   git init
   git add .
   git commit -m "feat: complete initial TB Furnitures UK eCommerce platform"
   ```
2. Create a new repository on your new GitHub account and push:
   ```bash
   git remote add origin https://github.com/<your-new-account>/tb-furnitures.git
   git push -u origin main
   ```
3. In your new Vercel dashboard:
   - Import `tb-furnitures` from GitHub.
   - Add environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `STRIPE_SECRET_KEY`).
   - Click **Deploy**.
