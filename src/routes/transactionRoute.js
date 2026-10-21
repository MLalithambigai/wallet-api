import express from "express";
import {
  getTransactionSummary,
  getTransactionsByUserId,
  createTransaction,
  deleteTransaction,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/summary/:userId", getTransactionSummary);
router.get("/:userId", getTransactionsByUserId);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
