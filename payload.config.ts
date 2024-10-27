import { postgresAdapter } from "@payloadcms/db-postgres";
import { resendAdapter } from "@payloadcms/email-resend";
import { uploadthingStorage } from "@payloadcms/storage-uploadthing";
import { buildConfig } from "payload";
import { Admins } from "@/collections/Admins";
import { Authors } from "@/collections/Authors";
import { Posts } from "@/collections/Posts";

export default buildConfig({
  collections: [Admins, Authors, Posts],
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
  email: resendAdapter({
    defaultFromAddress: "delivered@resend.dev",
    defaultFromName: "Payload CMS",
    apiKey: process.env.RESEND_API_KEY || "",
  }),
  plugins: [
    uploadthingStorage({
      collections: {
        posts: true,
      },
      options: {
        apiKey: process.env.UPLOADTHING_SECRET,
        acl: "public-read",
      },
    }),
  ],
});
