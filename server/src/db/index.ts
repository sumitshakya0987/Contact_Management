import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is missing");
}

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});

const connectDB = async () => {
    try {
        await client.connect();
        console.log("Connected to database");
    } catch (error) {
        console.error("Database connection failed:", error);
        process.exit(1);
    }
};

connectDB();

export const db = drizzle(client, { schema });
