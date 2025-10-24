# Educational Gamification Platform

## Overview

This is an educational gamification platform designed for children ages 5-8, inspired by the engagement patterns of Duolingo, Khan Academy Kids, ABCmouse, and Epic!. The platform uses game mechanics like points, levels, challenges, achievements, and rewards to motivate young learners through a joyful, encouraging, and playful interface.

The application helps children build learning habits through daily challenges, question-based quizzes, and a reward system that parents can manage. The design emphasizes clarity, safety, and age-appropriate interactions with large typography, bright colors, and celebration moments.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using Vite as the build tool and development server.

**Routing**: Client-side routing implemented with Wouter, a lightweight React router. Routes are defined in `client/src/App.tsx` and include:
- Dashboard (`/`)
- Challenges (`/challenges`)
- Rewards (`/rewards`)
- Achievements (`/achievements`)
- Profile (`/profile`)
- Questions (`/questions`)

**State Management**: TanStack Query (React Query) for server state management and data fetching. Query client configured in `client/src/lib/queryClient.ts` with custom fetch utilities.

**UI Component Library**: Shadcn/ui components built on Radix UI primitives. Components are located in `client/src/components/ui/` and follow the New York style variant with Tailwind CSS variables for theming.

**Styling**: Tailwind CSS with custom configuration for child-friendly design:
- Custom border radius scale (9px, 6px, 3px, 16px, 24px)
- Google Fonts: Fredoka for headers, Nunito for body text
- Custom color system using HSL CSS variables for light/dark mode support
- Special utility classes for elevation effects (`hover-elevate`, `active-elevate-2`)

**Design System**: Defined in `design_guidelines.md` with specific requirements for:
- Typography scale optimized for young readers (large text sizes)
- Spacing primitives (2, 4, 6, 8, 12, 16)
- Responsive grid layouts (mobile-first approach)
- Navigation patterns (top bar for desktop, bottom tabs for mobile)

### Backend Architecture

**Server Framework**: Express.js running on Node.js with TypeScript support via tsx for development.

**API Structure**: RESTful API with routes registered in `server/routes.ts`. API endpoints prefixed with `/api`. The server includes middleware for:
- JSON request parsing with raw body capture for webhooks
- Request/response logging for API routes
- CORS and security headers

**Data Access Layer**: Storage abstraction defined in `server/storage.ts`:
- `IStorage` interface defines CRUD operations
- `MemStorage` provides in-memory implementation (currently active)
- Designed to be swapped with database-backed implementation

**Development Server**: Custom Vite integration in `server/vite.ts` that:
- Runs Vite middleware in development mode
- Handles HMR (Hot Module Replacement)
- Serves static files in production
- Includes Replit-specific plugins for debugging and development tools

### Data Storage Solutions

**Current Implementation**: In-memory storage using Maps for development, with full seed data loaded on startup.

**Database Schema** (`shared/schema.ts`):
- **Users table**: Supports both username/password and Google OAuth authentication
  - Fields: id, username, password, name, email, googleId, profileImageUrl, joinedDate
- **Sessions table**: Express session management with PostgreSQL store
- **User Stats table**: Points, level, XP, streak tracking per user
- **Challenges table**: Educational tasks with XP rewards, categories, difficulty, imageUrl
- **Rewards table**: Redeemable rewards with point requirements
- **Achievements table**: Unlockable badges with rarity levels
- **Questions table**: Quiz questions with subjects (maths, english), imageUrl
- **Junction tables**: userChallenges, userRewards, userAchievements, userAnswers, activityLog

**Seed Data** (`server/seed.ts`):
- 10 Challenges across 5 categories (learning, creativity, movement, tasks, science)
- 11 Rewards in 3 tiers (small, medium, large) 
- 12 Achievements by rarity (common, rare, epic, legendary)
- 30 Questions (15 maths, 15 english) age-appropriate for 5-8 year olds
- All content in Spanish with playful emojis
- Generated images for each challenge category and question subject

**Database Configuration**: 
- PostgreSQL database available via `DATABASE_URL` environment variable
- Connection pooling via Neon's WebSocket-based pool
- Schema push command: `npm run db:push --force`
- Drizzle ORM for type-safe database operations

### Authentication and Authorization

**Implemented**: Username/password authentication system with session management:

1. **Username/Password Authentication** (`server/routes.ts`, `server/index.ts`):
   - Bcrypt password hashing for secure credential storage
   - User registration with Zod validation
   - Login with credential verification
   - Protected API endpoints with `requireAuth` middleware

**Session Management**:
- Express sessions with MemoryStore (in-memory storage)
- Session cookies with 24-hour maxAge
- Middleware for protected routes (`requireAuth`)
- User ID stored in `req.session.userId`

**Frontend Integration** (`client/src/hooks/useAuth.ts`):
- `useAuth` hook for authentication state
- Login/logout/register functions
- User data fetching with React Query
- Automatic redirect to landing page when not authenticated

**Landing Page** (`client/src/pages/Landing.tsx`):
- Playful Nintendo-style design for kids 5-8
- Login and registration forms with validation
- Spanish language interface

**Note**: Google OAuth integration is supported in the schema (googleId, email, profileImageUrl fields) but not yet implemented. This can be added as a future enhancement.

### Component Architecture

**Reusable Components** (`client/src/components/`):
- `AchievementBadge` - Displays unlockable achievements with rarity levels
- `CelebrationModal` - Animated success modal with confetti effects
- `ChallengeCard` - Shows challenge details with progress tracking
- `LevelIndicator` - Visual level badge with trophy icon
- `Navigation` - Responsive top/bottom navigation
- `PenaltyModal` - Parent feature for applying point deductions
- `PointsBadge` - Visual point display with star icon
- `ProgressBar` - Animated progress visualization
- `QuestionCard` - Interactive quiz question with feedback
- `RewardCard` - Redeemable reward with point requirements
- `StatsCard` - Metric display with icons

**Example Components**: Each component has a corresponding example file in `client/src/components/examples/` for demonstration and testing.

### External Dependencies

**UI & Styling**:
- `@radix-ui/*` - Unstyled, accessible component primitives (20+ components)
- `tailwindcss` - Utility-first CSS framework
- `class-variance-authority` - Type-safe variant utilities
- `clsx` & `tailwind-merge` - Conditional class merging

**Form Management**:
- `react-hook-form` - Form state and validation
- `@hookform/resolvers` - Validation schema resolvers
- `zod` & `drizzle-zod` - Schema validation

**Data Fetching**:
- `@tanstack/react-query` - Server state management

**Database**:
- `@neondatabase/serverless` - Serverless PostgreSQL client
- `drizzle-orm` - TypeScript ORM
- `drizzle-kit` - Migration and schema management
- `ws` - WebSocket library for Neon connection

**Routing & Navigation**:
- `wouter` - Lightweight React router

**Visual Effects**:
- `canvas-confetti` - Celebration animations
- `lucide-react` - Icon library

**Development Tools**:
- `@replit/*` plugins - Development experience enhancements (error overlay, cartographer, dev banner)
- `vite` - Build tool and dev server
- `@vitejs/plugin-react` - React support for Vite
- `tsx` - TypeScript execution for Node.js
- `esbuild` - JavaScript bundler for production builds

**Session Management**:
- `connect-pg-simple` - PostgreSQL session store for Express (not yet configured)
- `express-session` - Session middleware (dependency implied but not shown in package.json excerpt)

**Utilities**:
- `date-fns` - Date manipulation
- `nanoid` - Unique ID generation