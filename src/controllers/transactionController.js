import { db } from "../config/db.js";

// GET /api/transactions/summary/:userId - Get balance, income, expenses
export async function getTransactionSummary(req, res) {
  try {
    const { userId } = req.params;

    const summaryResult = await db`
      SELECT 
        COALESCE(SUM(amount), 0) AS balance,
        COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END), 0) AS expenses
      FROM transactions 
      WHERE user_id = ${userId}
    `;

    res.status(200).json({
      balance: summaryResult[0].balance,
      income: summaryResult[0].income,
      expenses: summaryResult[0].expenses,
    });
  } catch (error) {
    console.log("Error getting the summary", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// GET /api/transactions/:userId - Get all transactions for a user
export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await db`
      SELECT * FROM transactions 
      WHERE user_id = ${userId} 
      ORDER BY created_at DESC, id DESC
    `;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error fetching transactions", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// POST /api/transactions - Create a new transaction
export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || amount === undefined || !category || !user_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const numericAmount = Number(amount);
    if (isNaN(numericAmount) || numericAmount === 0) {
      return res.status(400).json({ error: "Amount must be a valid non-zero number" });
    }

    // Save expense as a negative value; income as a positive value
    const finalAmount =
      category.toLowerCase() === "expense"
        ? -Math.abs(numericAmount)
        : Math.abs(numericAmount);

    const transaction = await db`
      INSERT INTO transactions(user_id, title, amount, category)
      VALUES (${user_id}, ${title}, ${finalAmount}, ${category}) 
      RETURNING *
    `;

    console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// DELETE /api/transactions/:id - Delete a transaction by id
export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const transaction = await db`DELETE FROM transactions WHERE id = ${id} RETURNING *`;

    if (transaction.length === 0) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleting the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
