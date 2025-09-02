"use server";

import { getPayload } from "@/lib/payload";

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
    return { isError: true, message: "Not logged in" };
  }
  try {
    const payload = await getPayload();
    const user = await getUser(token);
    if (!user) {
      throw new Error("User not found");
    }
    const file = photo
      ? {
          data: Buffer.from(
            photo.replace(/^data:image\/\w+;base64,/, ""),
            "base64",
          ),
          mimetype: "image/jpeg",
          name: "photo.jpg",
          size: photo.length,
        }
      : undefined;
    await payload.create({
      collection: "posts",
      data: {
        title,
        author: user.id,
      },
      file,
      user,
    });
    return { ok: true };
  } catch (error) {
    return { isError: true, message: (error as Error).message };
  }
}

export async function getUser(token: string) {
  const payload = await getPayload();
  const headers = new Headers({
    Authorization: `JWT ${token}`,
  });
  const { user } = await payload.auth({ headers });
  return user;
}

export async function loginUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const payload = await getPayload();
    const { token } = await payload.login({
      collection: "authors",
      data: {
        email,
        password,
      },
    });
    if (!token) {
      return { message: "Invalid credentials" };
    }
    return token;
  } catch (error) {
    return { message: (error as Error).message };
  }
}

export async function createUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  try {
    const payload = await getPayload();
    // TODO: add checks for existing user
    const author = await payload.create({
      collection: "authors",
      data: {
        email,
        password,
      },
      disableVerificationEmail: false,
    });
    if (!author) {
      return { isError: true, message: "Invalid credentials" };
    }
    return { ok: true };
  } catch (error) {
    return { isError: true, message: (error as Error).message };
  }
}

export async function verifyEmail(token: string) {
  const payload = await getPayload();
  try {
    await payload.verifyEmail({ collection: "authors", token });
    return { ok: true };
  } catch (error) {
    return { isError: true, message: "Invalid token" };
  }
}
