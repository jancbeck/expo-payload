import type { AccessArgs } from 'payload';

import type { User } from '../payload-types';

type isOwner = (args: AccessArgs<User>) => boolean;

export const isOwner: isOwner = ({ req: { user }, id }) => {
  if (!user) return false;
  if (user.role && user.role === 'admin') {
    return true;
  }

  // allow only users to update their own data
  return user.id === id;
};
