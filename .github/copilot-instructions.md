# Copilot Instructions for expo-payload

This is a Cross-Platform Full-Stack Starter project demonstrating shared code between frontend and backend for web and native apps. It showcases the integration of React Server Components with Expo and Payload CMS, enabling code sharing between client and server across web and mobile platforms.

## Project Overview

**Repository Size**: ~150 files, medium-sized TypeScript/React Native project  
**Type**: Full-stack mobile/web application with CMS backend  
**Primary Languages**: TypeScript (95%), JavaScript (configuration files)  
**Target Platforms**: iOS, Android, Web  
**Runtime**: Bun (preferred package manager)

## Key Technologies

- **Frontend**: Expo SDK 54 (preview) with React 19.1.0, React Native 0.81.1, Expo Router v6 (beta)
- **Backend**: Payload CMS v3 beta with PostgreSQL adapter, Next.js-based headless CMS
- **Database**: Two separate PostgreSQL instances (Payload on port 5433, Better Auth on port 5434)
- **Authentication**: Better Auth v1.3.8 with Expo plugin, GitHub OAuth integration
- **Storage**: UploadThing adapter for file uploads
- **Styling**: NativeWind, TailwindCSS, Gluestack UI components
- **Testing**: Jest with jest-expo preset
- **Linting**: ESLint with expo config and Prettier

## Critical Setup Requirements

**ALWAYS follow this exact sequence for setup:**

1. **Install Bun** (required - this project uses Bun, not npm/yarn):

   ```bash
   curl -fsSL https://bun.sh/install | bash
   source ~/.bashrc  # or restart terminal
   ```

2. **Install dependencies**:

   ```bash
   bun install
   ```

3. **Environment Configuration** (REQUIRED - many commands will fail without this):

   ```bash
   # Copy and configure environment variables
   cp .env.example .env
   # Edit .env with actual values for:
   # - DATABASE_URI (postgres://postgres:postgres@127.0.0.1:5433/postgres)
   # - PAYLOAD_SECRET (min 8 chars)
   # - BETTER_AUTH_SECRET (min 8 chars)
   # - BETTER_AUTH_DATABASE_URI (postgres://postgres:postgres@127.0.0.1:5434/postgres)
   # - EXPO_PUBLIC_BETTER_AUTH_URL (http://localhost:8081)
   # - GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (for OAuth)
   # - UPLOADTHING_TOKEN (optional, for file uploads)
   ```

4. **Database Setup** (for full functionality):

   ```bash
   # Start both PostgreSQL containers
   docker compose up -d

   # Seed database with admin user
   bunx --bun payload run scripts/seed.ts --email=admin@test.com --password=password123 -- --disable-transpile

   # Setup Better Auth tables
   bun run migrate:auth
   ```

## Build, Test, and Development Commands

**Development Server** (timeout: 30s for startup):

```bash
bun start          # Start Expo dev server with multiple platform options
bun run android    # Run on Android emulator
bun run ios        # Run on iOS simulator (camera features won't work)
bun run web        # Run web version
```

**Type Generation** (timeout: 60s):

```bash
bun run generate:types    # Generate Payload types (requires env vars)
# Alternative: bunx --bun payload generate:types --disable-transpile
```

**Testing** (timeout: 120s):

```bash
bun run test:ci    # Run tests in CI mode (no watch)
bun run test       # Run tests with watch mode
```

**Linting and Formatting** (timeout: 60s):

```bash
bun run lint       # Check code quality (uses expo lint)
bun run lint:fix   # Auto-fix linting issues
bun run prettier:write  # Format code with Prettier
```

**Database Operations**:

```bash
bun run database:reset  # Reset and reseed database
bun run migrate:auth   # Update Better Auth schema
```

## Validation Pipeline (CI/CD)

The repository has GitHub Actions workflows in `.github/workflows/`:

1. **PR Validation** (`pr-validation.yml`):
   - Runs on every PR
   - Setup: Checkout → Bun setup → Install dependencies
   - Validation: `bun run lint` → `bun run test:ci`
   - **ALWAYS run these locally before pushing**

2. **Copilot Setup** (`copilot-setup-steps.yml.yml`):
   - Pre-installs dependencies for Copilot agents
   - Sets up Node.js, Bun, and runs `bun install`

## Project Architecture

### Directory Structure

```
/app/              # Expo Router file-based routing
├── (app)/         # Protected routes requiring authentication
├── api/           # API endpoints (Better Auth)
├── _layout.tsx    # Root layout with providers
└── index.tsx      # Home screen

/components/       # Reusable UI components
├── client/        # Client-side components
├── server/        # Server components
└── ui/           # UI library components (Gluestack)

/collections/      # Payload CMS collections
├── Users.ts       # User profiles with Better Auth integration
└── Posts.ts       # Posts with image upload support

/access/          # Access control functions
/lib/             # Shared utilities and configuration
/scripts/         # Database and setup scripts
```

### Key Configuration Files

- `payload.config.ts` - Payload CMS configuration with PostgreSQL and UploadThing
- `app.json` - Expo configuration with camera permissions and experiments
- `tsconfig.json` - TypeScript config with path aliases (`@/*`)
- `metro.config.js` - Custom Metro resolver for package compatibility
- `babel.config.js` - Babel config with NativeWind and module resolution
- `docker-compose.yaml` - PostgreSQL containers for databases

### Authentication Flow

Better Auth (GitHub OAuth) → session management → Payload user sync → access control

## Common Issues and Workarounds

**Environment Variable Errors**:

- Commands like `bun run generate:types` REQUIRE valid `.env` file
- Copy `.env.example` and fill in required values

**Database Connection Errors**:

- Ensure Docker containers are running: `docker compose up -d`
- Check ports 5433 (Payload) and 5434 (Better Auth) are available

**iOS Camera Issues**:

- iOS Simulator doesn't support camera - use physical device for testing
- Camera permissions are configured in `app.json`

**Metro/Babel Issues**:

- Custom resolvers handle UUID and SQLite compatibility
- Payload-specific babel plugins prevent initialization errors

**Type Generation Failures**:

- Always use `bunx --bun` prefix for Payload commands
- Ensure server is NOT running when generating types manually

## Development Workflow

1. **Start databases**: `docker compose up -d`
2. **Start dev server**: `bun start`
3. **Generate types** (if needed): `bun run generate:types`
4. **Run tests**: `bun run test:ci`
5. **Lint code**: `bun run lint`
6. **Make changes and test**
7. **Format code**: `bun run prettier:write`

## Important Notes

- **ALWAYS use Bun** instead of npm/yarn - this is critical for compatibility
- **Two separate databases** are required - do not try to use a single database
- **Server functions** are experimental - enabled via Expo Router experiments
- **File uploads** use base64 encoding in server actions
- **UUID IDs** are used throughout for better scalability
- **Camera features** only work on physical devices, not simulators

Trust these instructions - they are comprehensive and tested. Only search for additional information if these instructions are incomplete or found to be incorrect.
