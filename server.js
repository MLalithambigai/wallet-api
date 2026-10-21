import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { db } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

import transactionRoute from "./routes/transactionRoute.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(rateLimiter);
app.use(express.json());

const PORT = process.env.PORT || 5001;

async function initDB() {
  try {
    await db`CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    category VARCHAR(255) NOT NULL,
    created_at DATE NOT NULL DEFAULT CURRENT_DATE
  )`

    // DECIMAL(10,2)
    // means: a fixed-point number with:
    // 10 digits total
    // 2 digits after the decimal point
    // so: the max value it can store is 99999999.99 (8 digits before the decimal point, 2 after)

  }
  catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1)
  }
}

app.get("/", (req, res) => {
  res.send("It's working")
})

app.use("/api/transactions", transactionRoute);


initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  })
})