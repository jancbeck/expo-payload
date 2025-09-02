# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is an Expo React Native app with Payload CMS backend integration. The application combines:
- **Frontend**: React Native app using Expo Router for navigation and file-based routing
- **Backend**: Payload CMS with PostgreSQL database, email via Resend, and file storage via UploadThing
- **Authentication**: JWT-based auth with email verification through Payload's built-in auth system

## Key Technologies

- **Runtime**: Bun (preferred over npm/yarn)
- **Framework**: Expo SDK 54 (preview) with React 19.1.0 and React Native 0.81.1
- **Router**: Expo Router v6 (beta) with server functions and typed routes enabled
- **CMS**: Payload CMS v3 beta with PostgreSQL adapter
- **Database**: PostgreSQL (via Docker)
- **Email**: Resend adapter for Payload
- **Storage**: UploadThing adapter for Payload file uploads
- **Camera**: Expo Camera with permissions for photo capture

## Development Commands

### Database Setup
```bash
# Start PostgreSQL database
docker compose up

# Seed database with initial data
bunx --bun payload run scripts/seed.ts --email=mail@test.com --password=pass -- --disable-transpile

# Alternative seed command (package.json script)
bun run seed:reset
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
```

## Project Structure

### App Routes (Expo Router)
- `/app/_layout.tsx` - Root layout with SessionProvider
- `/app/index.tsx` - Main home screen
- `/app/app/` - Nested app routes
  - `/app/app/index.tsx` - Main app screen (protected)
  - `/app/app/create/index.tsx` - Create post screen
- `/app/signup/index.tsx` - User registration
- `/app/verify-email/index.tsx` - Email verification

### Payload Collections
- `collections/Admins.ts` - Admin users with full auth
- `collections/Authors.ts` - App users with email verification
- `collections/Posts.ts` - Posts with image upload and author relationship

### Server Actions
`app/actions.ts` contains server-side functions:
- `createPost()` - Creates posts with optional photo upload
- `loginUser()` - Authenticates authors
- `createUser()` - Registers new authors
- `verifyEmail()` - Verifies email tokens
- `getUser()` - Gets user from JWT token

### Key Components
- `components/Providers.tsx` - Session and context providers
- `components/Camera.tsx` - Camera functionality for photo capture
- `components/CreatePostForm.tsx` - Post creation form
- `components/LoginForm.tsx`, `components/SignupForm.tsx` - Auth forms
- `components/LoggedIn.tsx` - Protected content wrapper

## Configuration Files

- `payload.config.ts` - Payload CMS configuration with collections, adapters, and plugins
- `app.json` - Expo configuration with camera permissions and experiments enabled
- `tsconfig.json` - TypeScript config with strict mode and path aliases (`@/*`)
- `.env.example` - Environment variables template (copy to `.env`)

## Environment Variables Required

```bash
DATABASE_URI="postgres://postgres:postgres@127.0.0.1:5433/postgres"
PAYLOAD_SECRET="your-secret-key"
UPLOADTHING_SECRET="sk_live_your-secret"  # Optional for file uploads
RESEND_API_KEY="re_your-secret"          # Optional for email verification
```

## Development Notes

- Use `bunx --bun` prefix for Payload commands to ensure Bun runtime
- iOS Simulator doesn't support camera - use physical device for camera testing
- App uses JWT tokens stored in secure storage for authentication
- Server functions are enabled via Expo Router experiments
- Payload auto-generates types during development when server is running
- Posts collection supports image uploads with UploadThing storage
- Email verification uses token-based system (TODO: implement iOS universal links)

## Special Considerations

- New Architecture enabled in Expo config
- Camera permissions required for Android/iOS
- File uploads use base64 encoding in server actions
- Authentication uses separate collections for admins vs authors
- Database uses UUID as ID type for better scalability