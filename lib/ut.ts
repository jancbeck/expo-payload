import { Post } from '@/payload-types';

export const generateURL = (doc: Post) => {
  const key = doc._key;
  return `https://utfs.io/f/${key || ''}`;
};
