import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";
import "dotenv/config";

// for query purposes
const queryClient = postgres(process.env.DB_URL as string);
export const db = drizzle(queryClient, { schema, logger: true });
