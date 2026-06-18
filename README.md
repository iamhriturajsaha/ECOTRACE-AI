# 🌍EcoTrace AI

> **"Small actions. Massive impact."**  
> EcoTrace AI is a premium, enterprise-grade carbon tracking SaaS that empowers individuals and teams to measure, analyze and offset their carbon footprint. Powered by AI-driven recommendations, gamified challenges and sleek analytics. EcoTrace is built for high performance, accessibility and clean architecture.

## 🚀 Key Features
*   **⚡ AI-Powered Carbon Calculator** - Instantly evaluate carbon footprints across transport, diet, home energy and shopping using modern heuristics.
*   **📊 Premium Analytics Dashboard** - Clean, responsive visualizations built with Recharts and polished with micro-animations via Framer Motion.
*   **🤖 Smart AI Recommendations** - Direct integration with OpenAI/Nvidia NIM to generate personalized, context-aware mitigation actions.
*   **🏆 Gamified Challenge System** - Dynamic XP milestones, repeating challenge loops and a global leaderboard to drive community engagement.
*   **🔒 Security & Account Merging** - Clean credentials-based and Google OAuth 2.0 integration backed by a custom identity-linking database adapter.
*   **♿ 100% WCAG Accessibility** - Full screen-reader and keyboard navigation compliance using Radix/Shadcn primitives and ARIA standard controls.

## 🛠️ Technology Stack
| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (Turbopack) | React Server Components (RSC) and Standalone output optimization |
| **UI Library** | React 19 / TailwindCSS 4 | Modern typography, curated glassmorphism styling, and premium animations |
| **ORM** | Prisma ORM 7.8 | Type-safe database queries with custom driver adapters |
| **Database** | PostgreSQL | Enterprise relational storage (SQLite supported locally) |
| **Auth** | NextAuth.js v4 | Multi-provider identity merging (Credentials + OAuth) |
| **Testing** | Vitest / Playwright | Suite of unit and E2E browser tests |

## 🔧 Local Development Setup
Follow these steps to run the application locally on your machine - 

### 1. Prerequisites
Ensure you have the following installed -
*   [Node.js (v20+)](https://nodejs.org/)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local PostgreSQL instance)

### 2. Installation
Clone the repository and install dependencies - 
```bash
git clone https://github.com/iamhriturajsaha/ECOTRACE-AI.git
cd ECOTRACE-AI
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory -

Ensure you fill in your real credentials -
*   `DATABASE_URL`: local PostgreSQL string
*   `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth app credentials
*   `OPENAI_API_KEY`: API Key for AI recommendation generator
*   `NEXTAUTH_SECRET`: Random secure string

### 4. Database Spin-up
Run the local database container - 
```bash
docker-compose up -d
```

Apply database migrations and generate the client -
```bash
npx prisma db push
npx prisma generate
```

### 5. Start Development Server
```bash
npm run dev
```

## 🧪 Testing
We practice strict test-driven methodologies to ensure zero runtime errors.

### Unit & Component Testing
Uses Vitest for blistering fast type-safe checks - 
```bash
npm run test
```

### End-to-End Testing
Uses Playwright for complete user-journey smoke tests - 
```bash
npx playwright test
```

## ♿ Accessibility Standards
We conform to WCAG 2.1 Level AA standards -
*   Explicit keyboard focus indicators (`focus-visible`).
*   Dynamic screen-reader feedback using `aria-live="polite"` on client-side state transitions.
*   Strict color contrast ratios for high visibility in both light and dark themes.
*   Semantic HTML5 elements to aid screen readers.
