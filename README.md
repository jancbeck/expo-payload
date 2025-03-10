# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   nvm install
   bun install
   ```

2. Add environment variables to `.env` (duplicate `.env.example`). `DATABASE_URI` and `PAYLOAD_SECRET` are required. To enable email verification and uploads, add your API keys for [resend](https://resend.com/emails) and [uploadthing](https://uploadthing.com/). You can use any other [email](https://payloadcms.com/docs/beta/email/overview) or [storage adapters](https://payloadcms.com/docs/beta/upload/storage-adapters) but these two offer free tiers and work well serverless.
3. Start and seed database

   ```bash
   docker compose up
   bunx --bun payload run scripts/seed.ts --email=mail@test.com --password=pass -- --disable-transpile
   ```

4. Start the app

   ```bash
   bun start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

iOS Simulator does not support taking camera images.

## Developing

### Payload

[Generate types](https://payloadcms.com/docs/beta/typescript/generating-types) (when server is not running)

```bash
   bunx --bun payload generate:types --disable-transpile
```

### Expo

Payload will automatically generate types for you when making changes to your collections when your dev server is running.

### Testing on iOS Device

Follow expo instructions to [set up an iOS device with a development build](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=physical&mode=development-build&buildEnv=local#set-up-an-ios-device-with-a-development-build).

If you have installed Xcode but get the error

> ✔ Xcode must be fully installed before you can continue. Continue to the App Store?

run `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`.

If you get the error

> CommandError: No code signing certificates are available to use.

follow [this guide](https://github.com/expo/fyi/blob/main/setup-xcode-signing.md).
