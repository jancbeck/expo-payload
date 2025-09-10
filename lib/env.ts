import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const env = createEnv({
  server: {
    DATABASE_URI: z
      .string()
      .url()
      .describe('PostgreSQL database URL for Payload CMS'),
    PAYLOAD_SECRET: z.string().min(8).describe('Secret key for Payload CMS'),
    BETTER_AUTH_DATABASE_URI: z
      .string()
      .url()
      .describe('PostgreSQL database URL for Better Auth'),
    BETTER_AUTH_SECRET: z
      .string()
      .min(8)
      .describe('Secret key for Better Auth'),
    // @ts-expect-error
    EXPO_PUBLIC_BETTER_AUTH_URL: z
      .string()
      .url()
      .describe('Better Auth base URL'),
    EXPO_TRUSTED_ORIGIN: z
      .string()
      .optional()
      .describe('Trusted origin for Expo dev client'),
    UPLOADTHING_TOKEN: z
      .string()
      .optional()
      .describe('UploadThing API token for file uploads'),
    GITHUB_CLIENT_ID: z.string().describe('GitHub OAuth client ID'),
    GITHUB_CLIENT_SECRET: z.string().describe('GitHub OAuth client secret'),
  },
  clientPrefix: 'EXPO_PUBLIC_',
  client: {
    EXPO_PUBLIC_BETTER_AUTH_URL: z.string().url(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
