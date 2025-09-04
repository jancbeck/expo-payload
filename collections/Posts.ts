import type { CollectionConfig, Where } from 'payload';

export const Posts: CollectionConfig = {
  slug: 'posts',
  upload: {
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      index: true,
      hasMany: false,
      required: true,
    },
  ],
  access: {
    read: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      // NOTE return object unaccepted unless type is manually defined
      const query: Where = {
        user: {
          equals: user.id,
        },
      };
      return query;
    },
    create: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return true;
    },
    update: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
    delete: ({ req: { user } }) => {
      if (!user) return false;
      if (user.role === 'admin') return true;
      return {
        user: {
          equals: user.id,
        },
      };
    },
  },
};
