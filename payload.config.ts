import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import { Admins } from "@/collections/Admins";
import { Customers } from "@/collections/Customers";
import { Posts } from "@/collections/Posts";

export default buildConfig({
  collections: [Admins, Customers, Posts],
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
  admin: {
    user: "admins",
  },
});
