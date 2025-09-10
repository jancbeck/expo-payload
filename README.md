# Cross-Platform Full-Stack Starter

A demonstration of shared code between frontend and backend for web and native apps in a single codebase.

This project showcases the cutting-edge integration of [React Server Components](https://react.dev/reference/rsc/server-components) with [Expo](https://expo.dev) and [Payload CMS](https://payloadcms.com), enabling code sharing between client and server across web and mobile platforms. With Expo's server-rendered views for React Native and Payload's Next.js-based headless CMS, you can now write end-to-end type-safe applications that run everywhere.

## Architecture

- **Frontend**: **[Expo](https://docs.expo.dev)** - Universal apps with server-rendered views (beta)
- **Backend**: [**Payload CMS v3**](https://payloadcms.com) - Next.js-based headless CMS with type-safe configuration
- **Database**: PostgreSQL with automatic schema generation
- **Shared Code**: React Server Components enabling client/server code sharing
- **Authentication**: Better Auth with GitHub OAuth integration

## Quick Start

1. **Install dependencies**

   ```bash
   nvm install
   bun install
   ```

1. **Environment setup**

   Add environment variables to `.env` (duplicate `.env.example`). Required variables include `DATABASE_URI`, `PAYLOAD_SECRET`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_DATABASE_URI`, and GitHub OAuth credentials (`GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`). For uploads, add your API key for [uploadthing](https://uploadthing.com/). You can use any other [storage adapters](https://payloadcms.com/docs/beta/upload/storage-adapters) but UploadThing offers a free tier and works well serverless.

1. **Database setup**

   ```bash
   # start db containers
   docker compose up

   # seed db with admin
   bunx --bun payload run scripts/seed.ts --email=mail@test.com --password=pass -- --disable-transpile

   # create better auth tables
   bun migrate:auth
   ```

1. **Start development**

   ```bash
   bun start
   ```

## Development

```bash
# Generate types (when server not running)
bun run generate:types

# Run tests
bun run test

# Lint code
bun run lint
```

`bun start` presents several options to open the app in

- [a development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator (does not support camera)](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox but easy to setup

### Testing on iOS Device

Follow expo instructions to set up an iOS device with a development build.

If you have installed Xcode but get the error

> ✔ Xcode must be fully installed before you can continue. Continue to the App Store?

run `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`.

If you get the error

> CommandError: No code signing certificates are available to use.

follow [this guide](https://github.com/expo/fyi/blob/main/setup-xcode-signing.md).
