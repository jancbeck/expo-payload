import type { CollectionConfig } from "payload";

export const Posts: CollectionConfig = {
  slug: "posts",
  fields: [
    {
      name: "title",
      type: "text",
    },
    {
      name: "content",
      type: "textarea",
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      hasMany: false,
    },
  ],
};
