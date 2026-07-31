# 🏥 SmartHealth

**SmartHealth** is an AI-powered online pharmacy platform where users can browse and buy medicines, chat with an AI health assistant, and get their prescriptions automatically analyzed by AI. It ships as two separate apps — a Next.js frontend and an Express/TypeScript backend API — backed by MongoDB.

🔗 **Live Demo:** [smart-health-cyan.vercel.app](https://smart-health-cyan.vercel.app/)
🎨 **Frontend Repo:** [github.com/md-moynul/smart-health](https://github.com/md-moynul/smart-health)
⚙️ **Backend Repo:** [github.com/md-moynul/smart-health-backend](https://github.com/md-moynul/smart-health-backend)

---

## ✨ Features

- 🛒 **Medicine Store** — browse, search, filter, sort, and paginate a full product catalog
- 💊 **Product Details** — dedicated page per medicine with dosage, manufacturer, and prescription requirements
- 🧺 **Cart System** — add, update, and remove items, synced per user
- 🤖 **AI Pharmacy Assistant** — floating chat widget powered by Google Gemini that answers product and health-related questions using live inventory as context
- 📄 **AI Prescription Analyzer** — upload a prescription image and let AI extract medicine names, dosages, and doctor's notes into structured data
- 🔐 **Authentication** — email/password and Google sign-in via Better Auth, with role-based access (user/admin)
- 📊 **Admin Dashboard** — sales/usage charts, store stats (users, medicines, out-of-stock, prescriptions processed), and CRUD management for medicines and users
- 👤 **User Profile** — editable profile details
- 🧭 **Marketing Homepage** — hero, categories, featured products, testimonials, newsletter signup

## 🛠️ Tech Stack

**Frontend**
- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- [Better Auth](https://www.better-auth.com/) (email/password + Google OAuth, MongoDB adapter, JWT sessions)
- [Vercel AI SDK](https://sdk.vercel.ai/) + `@ai-sdk/google` for the AI chat widget
- Recharts (dashboard analytics), React Toastify (notifications), Lucide + Gravity UI icons
- MongoDB Node.js driver

**Backend**
- Node.js + Express 5 + TypeScript
- MongoDB / Mongoose
- Vercel AI SDK + `@ai-sdk/google` (Gemini) for chat and prescription analysis (`generateObject` + Zod schema)
- Multer for prescription image uploads
- Zod for schema validation, CORS enabled
- Deployed as a serverless function on Vercel

**Infrastructure**
- MongoDB Atlas (shared `smart-health-db` database)
- Google Generative AI (Gemini) API
- Vercel (hosting for both frontend and backend)

## 🏗️ Architecture

```
┌────────────────────┐        REST API        ┌──────────────────────┐
│   smart-health      │  ───────────────────▶  │  smart-health-backend │
│  (Next.js frontend) │  ◀───────────────────  │  (Express API)        │
└──────────┬──────────┘                        └───────────┬──────────┘
           │  Better Auth (direct DB access)                │
           ▼                                                ▼
                        ┌───────────────────────┐
                        │   MongoDB Atlas        │
                        │   (smart-health-db)    │
                        └───────────────────────┘
                                   │
                                   ▼
                        ┌───────────────────────┐
                        │  Google Gemini API     │
                        │  (chat + prescription  │
                        │   analysis)            │
                        └───────────────────────┘
```

> Note: authentication is handled directly in the frontend via Better Auth against MongoDB, while product, cart, dashboard, and AI features are served through the standalone Express backend.

## 📁 Project Structure

**Frontend (`smart-health`)**
```
src/
├── app/
│   ├── (marketing)            # Home, About
│   ├── login/, signup/        # Auth pages
│   ├── products/[id]/         # Product listing & details
│   ├── cart/                  # Cart page
│   ├── profile/               # User profile
│   ├── prescription-analyzer/ # AI prescription upload & results
│   ├── dashboard/             # Admin dashboard (medicines, users, add-product)
│   └── api/                   # Auth, admin, cart, and product route handlers
├── components/                # AIChat, Prescription, Navbar, Hero, ProductCard, etc.
└── lib/                       # auth.ts, db.ts, auth-client.ts, products.ts
```

**Backend (`smart-health-backend`)**
```
src/
└── index.ts   # Express app: products, users, stats, cart, chat, prescription-analysis routes
```

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 20
- A MongoDB Atlas connection string
- A Google Generative AI (Gemini) API key
- (Optional) Google OAuth client ID/secret for social login

### 1. Backend setup

```bash
git clone https://github.com/md-moynul/smart-health-backend.git
cd smart-health-backend
npm install
```

Create a `.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key
```

Run it:
```bash
npm run dev      # starts on http://localhost:5000
```

### 2. Frontend setup

```bash
git clone https://github.com/md-moynul/smart-health.git
cd smart-health
npm install
```

Create a `.env.local` file:
```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Run it:
```bash
npm run dev       # starts on http://localhost:3000
```

## 📡 Key API Endpoints (Backend)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (search, category, sort, pagination) |
| GET | `/api/products/featured` | Get featured products |
| GET | `/api/products/:id` | Get a single product |
| POST/PUT/DELETE | `/api/products/:id` | Create, update, or delete a product (admin) |
| GET | `/api/users` | List all users (admin) |
| GET | `/api/stats` | Dashboard stats + chart data |
| GET/POST/PUT/DELETE | `/api/cart` | Manage a user's cart |
| POST | `/api/chat` | Streamed AI chat with pharmacy assistant |
| POST | `/api/analyze-prescription` | Upload a prescription image for AI analysis |

## 🚢 Deployment

Both apps are deployed on **Vercel**:
- Frontend: [smart-health-cyan.vercel.app](https://smart-health-cyan.vercel.app/)
- Backend: deployed as a serverless Express function (see `vercel.json` in the backend repo)

## 👤 Author

**Moynul (Md Moynul Islam)**
Junior MERN Stack Developer
- GitHub: [@md-moynul](https://github.com/md-moynul)

## 📄 License

This project is currently unlicensed. Add a license (e.g., MIT) if you plan to open it up for contributions.