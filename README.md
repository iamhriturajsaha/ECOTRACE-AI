# 🌍 EcoTrace AI

> **"Small actions. Massive impact."**  
> EcoTrace AI is a premium, enterprise-grade carbon tracking SaaS that empowers individuals and teams to measure, analyze, and offset their carbon footprint. Powered by AI-driven recommendations, gamified challenges, and sleek analytics, EcoTrace is built for high performance, accessibility, and clean architecture.

---

## 🚀 Key Features

*   **⚡ AI-Powered Carbon Calculator**: Instantly evaluate carbon footprints across transport, diet, home energy, and shopping using modern heuristics.
*   **📊 Premium Analytics Dashboard**: Clean, responsive visualizations built with **Recharts** and polished with micro-animations via **Framer Motion**.
*   **🤖 Smart AI Recommendations**: Direct integration with OpenAI/Nvidia NIM to generate personalized, context-aware mitigation actions.
*   **🏆 Gamified Challenge System**: Dynamic XP milestones, repeating challenge loops, and a global leaderboard to drive community engagement.
*   **🔒 Security & Account Merging**: Clean credentials-based and Google OAuth 2.0 integration backed by a custom identity-linking database adapter.
*   **♿ 100% WCAG Accessibility**: Full screen-reader and keyboard navigation compliance using Radix/Shadcn primitives and ARIA standard controls.

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | Next.js 15 (Turbopack) | React Server Components (RSC) and Standalone output optimization |
| **UI Library** | React 19 / TailwindCSS 4 | Modern typography, curated glassmorphism styling, and premium animations |
| **ORM** | Prisma ORM 7.8 | Type-safe database queries with custom driver adapters |
| **Database** | PostgreSQL | Enterprise relational storage (SQLite supported locally) |
| **Auth** | NextAuth.js v4 | Multi-provider identity merging (Credentials + OAuth) |
| **Testing** | Vitest / Playwright | Suite of unit and E2E browser tests |

---

## 🔧 Local Development Setup

Follow these steps to run the application locally on your machine:

### 1. Prerequisites
Ensure you have the following installed:
*   [Node.js (v20+)](https://nodejs.org/)
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for local PostgreSQL instance)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/iamhriturajsaha/ECOTRACE-AI.git
cd ECOTRACE-AI
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and copy the variables from `.env.example`:
```bash
cp .env.example .env
```
Ensure you fill in your real credentials:
*   `DATABASE_URL`: local PostgreSQL string
*   `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: Google OAuth app credentials
*   `OPENAI_API_KEY`: API Key for AI recommendation generator
*   `NEXTAUTH_SECRET`: Random secure string

### 4. Database Spin-up
Run the local database container:
```bash
docker-compose up -d
```

Apply database migrations and generate the client:
```bash
npx prisma db push
npx prisma generate
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:4001](http://localhost:4001) in your browser.

---

## ☁️ Google Cloud Run Deployment (From Scratch)

This project is fully configured for deployment on Google Cloud Run and Google Cloud SQL (PostgreSQL).

### 1. Provision PostgreSQL on Cloud SQL
1. Create a **PostgreSQL** instance in the GCP Console.
2. In the instance dashboard, go to **Databases** and create a database called `ecotrace`.
3. In **Connections -> Networking**, whitelist your local IP under "Authorized Networks".
4. Copy the instance connection name (e.g., `project:region:instance`).

### 2. Push Schema from Local Terminal
Set your connection string and run Prisma:
```bash
# Windows (PowerShell)
$env:DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_PUBLIC_IP:5432/ecotrace?schema=public"
npx prisma db push

# macOS/Linux (Bash)
export DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@YOUR_PUBLIC_IP:5432/ecotrace?schema=public"
npx prisma db push
```

### 3. Deploy App via Cloud Shell
Open the GCP Cloud Shell, clone your repository, and execute the deployment:
```bash
git clone https://github.com/iamhriturajsaha/ECOTRACE-AI.git
cd ECOTRACE-AI

gcloud run deploy ecotrace-app \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --add-cloudsql-instances="YOUR_CONNECTION_NAME" \
  --set-env-vars="NODE_ENV=production,NEXTAUTH_URL=https://YOUR_CLOUD_RUN_URL,NEXTAUTH_SECRET=random-secret,GOOGLE_CLIENT_ID=client-id,GOOGLE_CLIENT_SECRET=client-secret,OPENAI_API_KEY=api-key,DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost/ecotrace?host=/cloudsql/YOUR_CONNECTION_NAME"
```

---

## 🧪 Testing

We practice strict test-driven methodologies to ensure zero runtime errors.

### Unit & Component Testing
Uses **Vitest** for blistering fast type-safe checks:
```bash
npm run test
```

### End-to-End Testing
Uses **Playwright** for complete user-journey smoke tests:
```bash
npx playwright test
```

---

## ♿ Accessibility Standards
We conform to **WCAG 2.1 Level AA** standards:
*   Explicit keyboard focus indicators (`focus-visible`).
*   Dynamic screen-reader feedback using `aria-live="polite"` on client-side state transitions.
*   Strict color contrast ratios for high visibility in both light and dark themes.
*   Semantic HTML5 elements to aid screen readers.

---

## 📄 License
This project is licensed under the MIT License.
