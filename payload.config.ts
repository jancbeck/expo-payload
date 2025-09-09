import { postgresAdapter } from '@payloadcms/db-postgres';
import { resendAdapter } from '@payloadcms/email-resend';
import { uploadthingStorage } from '@payloadcms/storage-uploadthing';
import { buildConfig } from 'payload';
import { Users } from './collections/Users';
import { Posts } from './collections/Posts';
import { env } from '@/lib/env';

export default buildConfig({
  collections: [Users, Posts],
  secret: env.PAYLOAD_SECRET,
  db: postgresAdapter({
    idType: 'uuid',
    pool: {
      connectionString: env.DATABASE_URI,
    },
  }),
  typescript: {
    autoGenerate: process.env.NODE_ENV === 'development',
  },
  admin: {
    user: Users.slug,
  },
  email: resendAdapter({
    defaultFromAddress: 'delivered@resend.dev',
    defaultFromName: 'Payload CMS',
    apiKey: env.RESEND_API_KEY || '',
  }),
  plugins: [
    ...(env.UPLOADTHING_TOKEN
      ? [
          uploadthingStorage({
            collections: {
              posts: true,
            },
            options: {
              token: env.UPLOADTHING_TOKEN,
              acl: 'public-read',
            },
          }),
        ]
      : []),
  ],
});
