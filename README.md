# Biscript

Biscript is a gamified coding learning platform built with Next.js App Router.
Users can learn by language, solve coding challenges, track progress and badges, and interact with a guided "Goblin" learning assistant.

## Core Features

- Multi-language learning flow (JavaScript, Python, C++, Java)
- Lessons and question-based practice by language and lesson ID
- Challenge system with test-case validation and score/progress tracking
- Badge and profile pages with Supabase-backed user data
- Admin pages for adding and updating lessons, questions, challenges, scripts, and test cases
- Code editor experience based on CodeMirror/Monaco components
- Optional terminal experience using xterm + WebSocket server
- Two code execution paths:
	- Judge0 via RapidAPI (`/api/runCode`)
	- Piston execution engine (`/api/challenges/submit`)

## Tech Stack

- Framework: Next.js (App Router), React
- Styling: Tailwind CSS
- Auth + Database: Supabase
- Editor: CodeMirror + Monaco
- Animations/UI: Framer Motion, Lucide icons, react-hot-toast
- Terminal: xterm + node-pty + WebSocket server
- API integrations: Judge0 (RapidAPI), Piston

## Project Structure

```text
app/
	api/
		challenges/submit/route.js   # Piston-backed challenge validation
		runCode/route.js             # Judge0-backed code execution
	admin/                         # Admin create/update panels
	components/                    # Reusable UI (editor, goblin, navbar, terminal)
	Lessons/[language]/            # Language lesson listing
	questions/[language]/[lesson]/ # Lesson question workflow
	challenges/                    # Challenge listing and challenge question flows
	profile/                       # Profile and profile edit pages
	services/                      # Supabase data access and helper services
	utils/                         # Supabase clients and utilities
server.js                        # Local WebSocket terminal server
piston-deploy.Dockerfile         # Piston deployment container
```

## Architecture Overview

1. UI pages and components live in `app/` using App Router.
2. Data access is centralized in `app/services/*` using Supabase.
3. Auth/session handling uses Supabase client helpers and provider components.
4. Challenge submission API (`/api/challenges/submit`) fetches test schema from Supabase, executes code against Piston, compares outputs, and stores completion in `user_challenges`.
5. Generic code run API (`/api/runCode`) forwards execution requests to Judge0 (RapidAPI).
6. Optional terminal uses `server.js` and a browser WebSocket client from `app/components/Terminal.js`.

## Routes (High-Level)

### Public/User Routes

- `/`
- `/home`
- `/login`, `/signin`, `/forgot-password`, `/reset-password`
- `/languages`
- `/Lessons/[language]`
- `/questions/[language]/[lesson]`
- `/challenges`
- `/challenges/question/[id]`
- `/badges`
- `/community`
- `/docs`
- `/profile`, `/profile/edit`

### Admin Routes

- `/admin`
- `/admin/addLesson`, `/admin/lesson`
- `/admin/addQuestion`, `/admin/question`
- `/admin/addChallenges`, `/admin/challenges`
- `/admin/addScript`, `/admin/script`
- `/admin/addTestCases`

### API Routes

- `POST /api/runCode`
- `POST /api/challenges/submit`

## Database Tables (Inferred from Services)

These tables are referenced in the current service layer:

- `profiles`
- `user_progress`
- `lessons`
- `questions`
- `challenges`
- `test_case`
- `goblin_script`
- `badges`
- `user_badges`
- `user_challenges`

## Prerequisites

- Node.js 18+
- npm (or yarn/pnpm/bun)
- Supabase project with the required tables
- Optional but recommended for full functionality:
	- Piston service running at port `2000`
	- WebSocket terminal server running at port `3001`

## Environment Variables

Create `.env.local` in project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
RAPID_API_KEY=your_rapidapi_key_for_judge0
```

Notes:

- `RAPID_API_KEY` is required for `/api/runCode`.
- `SUPABASE_SERVICE_ROLE_KEY` is used server-side when available.

## Local Development

Install dependencies:

```bash
npm install
```

Start Next.js app:

```bash
npm run dev
```

Start optional terminal WebSocket backend (new terminal):

```bash
node server.js
```

Start Piston locally (new terminal, Docker):

```bash
docker run -d -p 2000:2000 ghcr.io/engineer-man/piston:latest
```

Then open:

- `http://localhost:3000` for the main app

## Scripts

- `npm run dev` - start development server
- `npm run build` - production build
- `npm run start` - run production build
- `npm run lint` - run ESLint

## Deployment Notes

- `next.config.mjs` is already tuned for image optimization and production compression behavior.
- There are a few localhost-coupled values in source that should be env-driven for production:
	- Signup redirect in `app/services/registerUser.js`
	- Piston URL in `app/api/challenges/submit/route.js`
	- WebSocket URL in `app/components/Terminal.js`
- `next` dependency is currently on a canary release. Pinning a stable release is recommended for production environments.

## Additional Documentation

- `PERFORMANCE_OPTIMIZATION_GUIDE.md`
- `PROFILE_EDIT_README.md`

## Current State Summary

Biscript already has a solid learning + challenge foundation with admin tooling and Supabase integration. The main production-hardening tasks are environment-driven runtime URLs, schema migration/versioning docs, and test coverage for service and API layers.
