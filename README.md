# The Ecommerse Website

A basic ecommerce website with a robust Storefront and a clean Admin dashboard.

## Features & Qualities
- **Premium Storefront**: Fully responsive, aesthetic user interface with updated typography and smooth cart interactions.
- **Admin Panel**: Focused solely on core ecommerce management (Users, Products, Orders). No unnecessary bloat or brochure features.
- **Robust Authentication**: Frictionless login and sign up flow.
- **Optimized Database**: Clean PostgreSQL schema via Prisma.

## How to Run

1. **Environment Variables**
   Create a `.env` file in the root directory (you can copy `.env.example`) and ensure the database connection string is properly configured:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/ecommerce?schema=public"
   ```

2. **Install Dependencies**
   ```bash
   pnpm install
   ```

3. **Database Setup**
   ```bash
   pnpm run db:push
   pnpm run db:seed
   ```

4. **Run Development Servers**
   ```bash
   pnpm run dev
   ```
   - Storefront runs at `http://localhost:3000`
   - Admin panel runs at `http://localhost:3001`
