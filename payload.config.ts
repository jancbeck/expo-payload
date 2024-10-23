import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";

export default buildConfig({
  collections: [
    {
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
      ],
    },
  ],
  secret: process.env.PAYLOAD_SECRET || "",
  db: postgresAdapter({
    idType: "uuid",
    pool: {
      connectionString: process.env.DATABASE_URI,
    },
  }),
  typescript: {
    autoGenerate: process.env.NODE_ENV === "development",
  },
});
