'use server';

import { getPayload } from '@/lib/payload';
import { auth } from '@/lib/auth';

const getUserRole = (role: string | null | undefined) => {
  if (role?.includes('admin')) {
    return 'admin';
  }
  if (role?.includes('user')) {
    return 'user';
  }
};

export async function createPost({
  title,
  photo,
  token,
}: {
  title: string;
  photo?: string;
  token: string | null | undefined;
}) {
  if (!token) {
    return { isError: true, message: 'Not logged in' };
  }
  try {
    const payload = await getPayload();
    const user = await getUser(token);
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
    });
    return { ok: true };
  } catch (error) {
    return { isError: true, message: (error as Error).message };
  }
}

export async function getUser(authCookie: string) {
  const payload = await getPayload();
  const session = await auth.api.getSession({
    headers: new Headers({ Cookie: authCookie }),
  });

  const authId = session?.user.id;
  if (!authId) return null;
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

  return user && role ? { ...user, collection: 'users', role } : null;
}
