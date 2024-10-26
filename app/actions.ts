"use server";

import { getPayload } from "payload";
import config from "@payload-config";

export async function createPost(data = {}) {
  const payload = await getPayload({ config });
  await payload.create({
    collection: "posts",
    data,
  });
  return { ok: true };
}
