# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is an Expo React Native app with Payload CMS backend integration. The application combines:

- **Frontend**: React Native app using Expo Router for navigation and file-based routing
- **Backend**: Payload CMS with PostgreSQL database, email via Resend, and file storage via UploadThing
- **Authentication**: Better Auth integration with Expo, using separate databases with user synchronization

## Key Technologies

- **Runtime**: Bun (preferred over npm/yarn)
- **Framework**: Expo SDK 54 (preview) with React 19.1.0 and React Native 0.81.1
- **Router**: Expo Router v6 (beta) with server functions and typed routes enabled
- **Authentication**: Better Auth v1.3.8 with Expo plugin and admin support
- **CMS**: Payload CMS v3 beta with PostgreSQL adapter
- **Database**: Two PostgreSQL instances via Docker - separate databases for Better Auth (port 5434) and Payload CMS (port 5433)
- **Email**: Resend adapter for Payload
- **Storage**: UploadThing adapter for Payload file uploads
- **Camera**: Expo Camera with permissions for photo capture

## Development Commands

### Database Setup

```bash
# Start both PostgreSQL databases (Payload on :5433, Better Auth on :5434)
docker compose up

# Run Better Auth migrations to set up auth tables
bun run migrate:auth

# Reset Payload database and seed with initial data
bun run database:reset
```

### Development Server

```bash
# Start Expo development server
bun start

# Run on specific platforms
bun run android
bun run ios
bun run web
```

### Type Generation

```bash
# Generate Payload types (when server not running)
bunx --bun payload generate:types --disable-transpile

# Alternative using package.json script
bun run generate:types
```

### Testing & Quality

```bash
# Run tests with Jest
bun run test

# Lint code
bun run lint

# Fix lint issues automatically
bun run lint:fix

# Format code with Prettier
bun run prettier:write
```

## Project Structure

### App Routes (Expo Router)

- `/app/_layout.tsx` - Root layout with SessionProvider
- `/app/index.tsx` - Main home screen
- `/app/(app)/` - Nested app routes (protected)
  - `/app/(app)/_layout.tsx` - Protected layout with authentication checks
  - `/app/(app)/index.tsx` - Main app screen (protected)
  - `/app/(app)/create.tsx` - Create post screen
- `/app/signup.tsx` - User registration
- `/app/+middleware.ts` - Request logging middleware
- `/app/api/auth/[...auth]+api.ts` - Better Auth API endpoints

### Payload Collections

- `collections/Users.ts` - User profiles linked to Better Auth via authId field with role-based access
- `collections/Posts.ts` - Posts with image upload and user relationship

### Access Control

- `access/anyone.ts` - Public access for all users
- `access/isAdmin.ts` - Admin-only access control
- `access/isAuthenticated.ts` - Authenticated user access
- `access/isOwner.ts` - Resource owner access control
- `access/isUser.ts` - Regular user access control

### Server Actions & Authentication

`lib/actions.ts` contains server-side functions:

- `createPost()` - Creates posts with optional photo upload
- `getUser()` - Gets Payload user from Better Auth session cookie

`lib/auth.ts` contains Better Auth configuration:

- Better Auth setup with Expo plugin and admin support
- Database configuration using separate PostgreSQL instance for Better Auth
- User creation hook that syncs Better Auth users to Payload CMS
- Email/password authentication with configurable password length

### Key Components

- `components/Providers.tsx` - Session and context providers
- `components/Camera.tsx` - Camera functionality for photo capture
- `components/CreatePostForm.tsx` - Post creation form
- `components/LoginForm.tsx`, `components/SignupForm.tsx` - Better Auth forms
- `components/LoggedIn.tsx` - Protected content wrapper
- `components/LogoutForm.tsx` - User logout functionality
- `components/Posts.tsx` - Post listing component
- `components/renderPosts.tsx` - Post rendering utilities

## Configuration Files

- `payload.config.ts` - Payload CMS configuration with collections, adapters, and plugins
- `app.json` - Expo configuration with camera permissions and experiments enabled
- `tsconfig.json` - TypeScript config with strict mode and path aliases (`@/*`)
- `.env.example` - Environment variables template (copy to `.env`)

## Environment Variables Required

```bash
# Database configuration (separate databases)
DATABASE_URI="postgres://postgres:postgres@127.0.0.1:5433/postgres"          # Payload CMS
BETTER_AUTH_DATABASE_URI="postgres://postgres:postgres@127.0.0.1:5434/postgres"  # Better Auth

# Better Auth configuration
EXPO_PUBLIC_BETTER_AUTH_URL="http://localhost:8081"  # or your Expo dev server URL

# Payload configuration
PAYLOAD_SECRET="your-secret-key"

# Optional services
UPLOADTHING_SECRET="sk_live_your-secret"  # Optional for file uploads
RESEND_API_KEY="re_your-secret"          # Optional for email verification
```

## Development Notes

- Use `bunx --bun` prefix for Payload commands to ensure Bun runtime
- iOS Simulator doesn't support camera - use physical device for camera testing
- Authentication uses Better Auth with separate database approach (Better Auth on :5434, Payload on :5433)
- Better Auth handles session management while Payload manages user profiles and content access
- Server functions are enabled via Expo Router experiments
- Payload auto-generates types during development when server is running
- Posts collection supports image uploads with UploadThing storage
- Run `bun run migrate:auth` after database changes to update Better Auth schema
- User roles are managed by Better Auth but synced to Payload for access control

## Special Considerations

- New Architecture enabled in Expo config
- Camera permissions required for Android/iOS
- File uploads use base64 encoding in server actions
- Better Auth and Payload use completely separate PostgreSQL databases (different ports and volumes)
- User authentication flow: Better Auth → session → Payload user sync → access control
- Database uses UUID as ID type for better scalability
- Better Auth sessions are validated via API calls to avoid circular dependencies
- Access control functions check both Better Auth roles and Payload user ownership
