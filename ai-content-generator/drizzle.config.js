import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.tsx",
  out: "./drizzle",
  dbCredentials:{
    url:'postgresql://neondb_owner:npg_lRoM6GJQszY5@ep-falling-frost-ad53s3ag-pooler.c-2.us-east-1.aws.neon.tech/ai-content-generator?sslmode=require&channel_binding=require'
  }
});
