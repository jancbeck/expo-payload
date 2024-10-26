"use server";

import { getPayload } from "@/lib/payload";

export async function createPost(data = {}, token: string) {
  const payload = await getPayload();
  const user = await getUser(token);
  if (!user) {
    throw new Error("User not found");
  }
  await payload.create({
    collection: "posts",
    data: {
      ...data,
      author: user.id,
    },
    user,
  });
  return { ok: true };
}

export async function getUser(token: string) {
  const payload = await getPayload();
  const headers = new Headers({
    Authorization: `JWT ${token}`,
  });
  const { user } = await payload.auth({ headers });
  return user;
}

export async function login({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const payload = await getPayload();
  const { token } = await payload.login({
    collection: "authors",
    data: {
      email,
      password,
    },
  });
  if (!token) {
    return { isError: true, message: "Invalid credentials" };
  }
  return token;
}

export async function signup({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const payload = await getPayload();
  // TODO: add checks for existing user and email validation
  const author = await payload.create({
    collection: "authors",
    data: {
      email,
      password,
    },
    disableVerificationEmail: true,
  });
  if (!author) {
    return { isError: true, message: "Invalid credentials" };
  }
  return { ok: true };
}
