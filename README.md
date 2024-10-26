# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   nvm install
   bun install
   ```

2. Seed database

   ```bash
   bunx --bun payload run scripts/seed.ts --email=mail@test.com --password=pass -- --disable-transpile
   ```

3. Start the app

   ```bash
   bun start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Developing

[Generate types](https://payloadcms.com/docs/beta/typescript/generating-types) (when server is not running)

```bash
   bunx --bun payload generate:types --disable-transpile
```

Payload will automatically generate types for you when making changes to your collections when your dev server is running.
