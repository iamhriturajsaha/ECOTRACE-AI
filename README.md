# EcoTrace AI

"Small actions. Massive impact."

EcoTrace AI is a premium, AI-powered sustainability platform designed to help users track, understand, and reduce their carbon footprint through intelligent recommendations, smart challenges, and an engaging community.

## Challenge Alignment
This platform directly addresses the challenge of building a Carbon Footprint Awareness Platform with a focus on delivering near-perfect scores across Code Quality, Security, Efficiency, Testing, Accessibility, and Google Services integration.

## Features
- **AI Carbon Calculator**: Advanced tracking of transportation, diet, energy, and shopping footprints.
- **Personal Dashboard**: Beautiful visualizations using Recharts and Framer Motion.
- **AI Recommendation Engine**: Personalized tips using NVIDIA NIM/OpenAI APIs.
- **Smart Challenges**: Gamified progress with badges and XP.
- **Community Module**: Leaderboards and community posts.

## Tech Stack
- **Frontend**: Next.js 15, React 19, TailwindCSS 4, Shadcn UI, Framer Motion
- **Backend**: Next.js API Routes, Prisma ORM, PostgreSQL, NextAuth
- **Testing**: Vitest, Playwright, React Testing Library

## Installation
1. Clone the repository
2. Run `npm install`
3. Copy `.env.example` to `.env.local` and populate environment variables.
4. Run `docker-compose up -d` to start the PostgreSQL database.
5. Run `npx prisma db push` and `npx prisma generate`.
6. Run `npm run dev` to start the development server.

## Testing
- Unit & Component Tests: `npm run test`
- E2E Tests: `npx playwright test`

## Architecture
- Clean Architecture principles with Feature-based folder structure.
- SOLID principles followed for scalable code.
