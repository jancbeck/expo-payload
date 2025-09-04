import type { CollectionConfig } from 'payload';

export const Authors: CollectionConfig = {
  slug: 'authors',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    verify: {
      generateEmailHTML: ({ token }) =>
        // TODO: use ios universal links to deep link into app https://docs.expo.dev/linking/ios-universal-links/
        `To verify your account, enter the following token in the app: ${token}`,
    },
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
};
