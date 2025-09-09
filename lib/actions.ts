'use server';

import { getPayload } from '@/lib/payload';

export async function createPost({
  title,
  photo,
  authCookie,
}: {
  title: string;
  photo?: string;
  authCookie: string;
}) {
  try {
    const payload = await getPayload();
    const { user } = await payload.auth({
      headers: new Headers({ Cookie: authCookie }),
    });
    if (!user) {
      throw new Error('User not found');
    }
    const file = photo
      ? {
          data: Buffer.from(
            photo.replace(/^data:image\/\w+;base64,/, ''),
            'base64',
          ),
          mimetype: 'image/jpeg',
          name: 'photo.jpg',
          size: photo.length,
        }
      : undefined;
    await payload.create({
      collection: 'posts',
      data: {
        title,
        user: user.id,
      },
      file,
      user,
      overrideAccess: false,
    });
    return { ok: true };
  } catch (error) {
    return { isError: true, message: (error as Error).message };
  }
}
