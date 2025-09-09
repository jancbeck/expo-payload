import { betterAuth } from 'better-auth';
import { expo } from '@better-auth/expo';
import { admin, magicLink } from 'better-auth/plugins';
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
  plugins: [
    expo(),
    admin(),
    magicLink({
      sendMagicLink: async ({ email, token, url }) => {
        try {
          const payload = await getPayload({ config: configPromise });

          await payload.sendEmail({
            to: email,
            subject: 'Sign in to Expo Payload',
            text: `Click the link below to sign in:\n\n${url}\n\nThis link will expire in 5 minutes.`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #333;">Sign in to Expo Payload</h2>
                <p>Click the button below to sign in to your account:</p>
                <a href="${url}" style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
                  Sign In
                </a>
                <p style="color: #666; font-size: 14px;">This link will expire in 5 minutes.</p>
                <p style="color: #666; font-size: 12px;">If you didn't request this email, you can safely ignore it.</p>
              </div>
            `,
          });

          console.log('Magic link sent to:', email);
        } catch (error) {
          console.error('Failed to send magic link:', error);
          throw new Error('Failed to send magic link email');
        }
      },
      expiresIn: 300, // 5 minutes
      disableSignUp: false, // Allow new users to sign up
    }),
  ],
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
