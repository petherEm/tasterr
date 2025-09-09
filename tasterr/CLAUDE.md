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
- `SUPABASE_SERVICE_ROLE_KEY` (required for admin panel)

## Admin Panel

The admin panel provides comprehensive survey management and user insights. Access is restricted to users with admin roles configured in Clerk.

### Admin Features
- **Dashboard**: Real-time statistics and recent survey completions
- **User Management**: Detailed user profiles with complete survey history
- **Survey Analytics**: Comprehensive view of demographic and research survey data
- **Role-based Access**: Secure admin-only access with Clerk integration

### Admin Setup
1. **Configure Admin Role in Clerk**:
   - Set `publicMetadata.role = 'admin'` or `privateMetadata.role = 'admin'` for admin users
   - Can be done via Clerk Dashboard or programmatically

2. **Add Service Role Key**:
   - Add `SUPABASE_SERVICE_ROLE_KEY` to your environment variables
   - This bypasses RLS for admin operations while maintaining security

3. **Access Admin Panel**:
   - Navigate to `/admin` when logged in as an admin user
   - Protected by middleware and server-side role checks

### Admin Routes
- `/admin` - Main dashboard with statistics and recent surveys
- `/admin/users/[userId]` - Detailed user survey information
- Protected by middleware with role-based access control

### Admin Architecture
- **Authentication**: Clerk roles with server-side verification
- **Data Access**: Service role Supabase client for comprehensive data access
- **Security**: RLS bypass only for verified admin operations
- **UI Components**: Consistent design system with existing project components

## Custom Surveys System

The application features a comprehensive custom surveys system that allows admins to create dynamic surveys and collect user responses.

### Survey Features
- **Dynamic Survey Builder**: Admins can create surveys with multiple question types
- **Question Types**: Text input, long text, numbers, dropdowns, multiple choice
- **Survey Management**: Draft/publish/archive workflow with visibility controls
- **Response Analytics**: Individual and summary views with visual statistics
- **User Experience**: Step-by-step survey taking with progress indicators

### Survey Database Schema
- `custom_surveys` - Survey metadata and settings
- `survey_questions` - Individual questions with options and validation
- `survey_responses` - User responses with JSON storage for flexibility

### Survey Routes
- `/surveys` - User-facing survey listing page
- `/surveys/[id]` - Survey taking interface
- `/admin/surveys` - Admin survey management
- `/admin/surveys/create` - Survey builder interface
- `/admin/surveys/[id]/responses` - Response analytics

### Survey Security
- **User Access**: RLS policies ensure users only see published surveys
- **Admin Access**: Service role bypasses RLS for comprehensive survey management
- **Response Protection**: Users can only submit one response per survey
- **Data Integrity**: Foreign key constraints and proper validation

### Survey Types Supported
1. **Text Input** - Short text responses
2. **Long Text** - Multi-line text areas
3. **Number** - Numeric input with validation  
4. **Dropdown** - Single selection from options
5. **Multiple Choice** - Radio button selections with custom options

### Integration Points
- Uses existing Clerk authentication for user management
- Leverages Supabase RLS for secure data access
- Integrates with admin panel for comprehensive management
- Follows existing UI/UX patterns for consistency