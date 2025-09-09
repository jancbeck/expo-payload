import type { CollectionConfig } from 'payload';
import { isAdmin } from '@/access/isAdmin';
import { isOwner } from '@/access/isOwner';
import type { auth } from '@/lib/auth';
import { betterFetch } from '@better-fetch/fetch';

// users with multiple roles have a comma-separated list of roles
const getUserRole = (role: string | null | undefined) => {
  if (role?.includes('admin')) {
    return 'admin';
  }
  if (role?.includes('user')) {
    return 'user';
  }
};

type Session = typeof auth.$Infer.Session;

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    disableLocalStrategy: true,
    strategies: [
      {
        name: 'better-auth',
        authenticate: async ({ payload, headers }) => {
          // const session = await auth.api.getSession({
          //   headers: await headers(),
          // });
          // causes:
          // Require cycles are allowed, but can result in uninitialized values. Consider refactoring to remove the need for a cycle.
          // Require cycle: lib/auth.ts -> payload.config.ts -> collections/Users.ts -> lib/auth.ts

          const { data: session } = await betterFetch<Session>(
            '/api/auth/get-session',
            {
              baseURL: String(process.env.EXPO_PUBLIC_BETTER_AUTH_URL),
              headers: headers.get('Cookie')
                ? // on native we use the manually passed cookie auth header
                  headers
                : // on web headers (including cookies) are automatically included but must be accessed via `unstable_headers()`
                  await (
                    await import('expo-router/build/rsc/server')
                  ).unstable_headers(),
            },
          );

          const authId = session?.user.id;
          if (!authId) return { user: null };
          const role = getUserRole(session.user.role);

          const {
            docs: [user],
          } = await payload.find({
            collection: 'users',
            overrideAccess: true,
            where: {
              authId: {
                equals: authId,
              },
            },
          });

          return {
            // Send the user back to authenticate,
            // or send null if no user should be authenticated
            user: user && role ? { ...user, collection: 'users', role } : null,
          };
        },
      },
    ],
  },
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: isOwner,
    update: isOwner,
    admin: isAdmin,
  },
  admin: {
    defaultColumns: ['name', 'createdAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: false,
    },
    {
      label: 'Auth Profile',
      type: 'collapsible',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'authId',
          type: 'text',
          required: true,
          unique: true, // Each external ID should map to exactly one user doc
          admin: {
            // components: {
            //   Field: "/components/admin/UserAuth",
            // },
            disableListColumn: true,
          },
        },
        {
          name: 'role',
          type: 'select',
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'User', value: 'user' },
          ],
          required: true,
          virtual: true, // actual value retrieved from betterAuth
          defaultValue: 'user',
          hidden: true,
        },
      ],
    },
  ],
  hooks: {
    beforeDelete: [
      async ({ req, id }) => {
        console.log('Deleting user', id);
        // Find all posts belonging to this user
        const posts = await req.payload.find({
          collection: 'posts',
          where: {
            user: {
              equals: id,
            },
          },
          req,
          depth: 1,
          limit: 1000,
        });

        // Delete each post and its associated image file
        for (const post of posts.docs) {
          console.log('Deleting post', post.id);
          // Delete the post
          await req.payload.delete({
            collection: 'posts',
            id: post.id,
            req,
          });
        }
      },
    ],
  },
};

export default Users;
