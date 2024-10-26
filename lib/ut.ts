import { Post } from "@/payload-types";

// TODO: figure out why urls are broken
export const generateURL = (doc: Post) => {
  const key = doc._key;
  return `https://utfs.io/f/${key || ""}`;
};
