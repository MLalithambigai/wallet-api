import {neon} from "@neondatabase/serverless";

import "dotenv/config";

// Creates a SQL connection using our DB URL
export const db = neon(process.env.DATABASE_URL);

