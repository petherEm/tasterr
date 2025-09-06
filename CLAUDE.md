# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tasterr is a Next.js 15 application using React 19 that serves as a platform for FMCG (Fast-Moving Consumer Goods) product discovery and feedback. The app focuses on helping users share experiences about food and beverage products while providing valuable insights to brands and manufacturers.

## Key Commands

- **Development**: `npm run dev` (uses Turbopack)
- **Build**: `npm run build` (uses Turbopack)  
- **Start**: `npm start`
- **Lint**: `eslint` (use `npm run lint` though no script defined)
- **Type Check**: No dedicated script - TypeScript checking happens during build

## Technology Stack

### Core Framework
- **Next.js 15** with App Router
- **React 19** with React DOM 19
- **TypeScript** with strict configuration
- **Tailwind CSS 4** for styling

### Authentication & Database
- **Clerk** (`@clerk/nextjs`) for authentication
- **Supabase** for database with custom Clerk integration in `src/lib/supabase.ts`

### UI Components
- **Radix UI** primitives (Label, Radio Group, Select, Slot)
- **shadcn/ui** component system with `components.json` configuration
- **Lucide React** for icons
- **Framer Motion** for animations

### Form Handling
- **React Hook Form** with **Zod** validation
- **@hookform/resolvers/zod** for integration

### Utilities
- **class-variance-authority** for component variants
- **clsx** and **tailwind-merge** for conditional classes

## Architecture

### Directory Structure
- `src/app/` - App Router pages and layouts
- `src/components/ui/` - Reusable UI components (shadcn/ui)
- `src/components/shared/` - Shared layout components (Navbar, Footer)
- `src/components/main/` - Feature-specific components
- `src/lib/` - Utilities and configurations

### Key Components
- **Multi-step Survey Form** (`src/components/main/initial-info-form.tsx`) - Complex wizard-style form with animated transitions collecting user demographics and preferences
- **Supabase Integration** (`src/lib/supabase.ts`) - Custom client creation with Clerk token integration

### Authentication Flow
The app uses Clerk for authentication with Supabase integration. The Supabase client is configured to automatically pass Clerk tokens for RLS (Row Level Security).

### Form Validation Pattern
Forms use React Hook Form with Zod schemas for type-safe validation. The survey form demonstrates a multi-step pattern with progress tracking and conditional validation.

## Development Notes

### Path Aliases
Uses `@/*` alias mapping to `./src/*` for clean imports.

### Styling Approach
- Tailwind CSS 4 with PostCSS configuration
- Component variants using class-variance-authority
- Conditional styling with clsx and tailwind-merge utilities

### Animation Pattern
Framer Motion is used for page transitions and interactive elements, particularly in the survey form with enter/exit animations.

### Environment Configuration
The app expects Supabase environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`