import { betterAuth } from 'better-auth';
import { expo } from '@better-auth/expo';
import { admin } from 'better-auth/plugins';
import { createAuthMiddleware } from 'better-auth/api';
import pkg from 'pg';
import { PostgresDialect } from 'kysely';
import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { env } from '@/lib/env';

const { Pool } = pkg;

export const auth = betterAuth({
  baseURL: env.EXPO_PUBLIC_BETTER_AUTH_URL,
  database: {
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: env.BETTER_AUTH_DATABASE_URI,
      }),
    }),
    type: 'postgres',
  },
  plugins: [expo(), admin()],
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  trustedOrigins: ['expo-payload://', env.EXPO_TRUSTED_ORIGIN].filter(
    (v): v is string => typeof v === 'string' && v.length > 0,
  ),
  session: {
    freshAge: 0, // disable freshness check for account deletion. TODO: add proper re-auth flow for delete action
  },
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.context.newSession) {
        const {
          newSession: { user: authUser },
        } = ctx.context;

        console.log('User logged in', authUser);

        await createUserIfNotExists({
          name: authUser.name === authUser.email ? null : authUser.name,
          id: authUser.id,
          role: authUser.role,
        });
      }
    }),
  },
});

export const createUserIfNotExists = async (input: {
  id: string;
  name: string | null;
  role: 'admin' | 'user';
}) => {
  const payload = await getPayload({ config: configPromise });

  // Look up the user by authId in PayloadCMS
  const {
    docs: [existingUser],
  } = await payload.find({
    collection: 'users',
    where: { authId: { equals: input.id } },
  });

  if (existingUser) {
    return existingUser;
  }

  const createdUser = await payload.create({
    collection: 'users',
    data: {
      authId: input.id,
      name: input.name ?? undefined,
      role: input.role,
    },
  });
  if (!createdUser) {
    console.error('Failed to create payload user');
  }
  return createdUser;
};
