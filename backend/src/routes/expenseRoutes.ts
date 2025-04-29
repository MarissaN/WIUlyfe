import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { isToday, isThisWeek, isThisMonth, parseISO } from "date-fns";

const router = express.Router();
const prisma = new PrismaClient();

// POST route to add an expense
router.post("/expense", async (req: Request, res: Response) => {
  const { amount, description, date, category, email } = req.body;

  if (!amount || !description || !date || !category || !email) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new expense record
    const newExpense = await prisma.expense.create({
      data: {
        amount,
        description,
        date: new Date(date),
        category,
        userId: user.id, // Associate the expense with the logged-in user
      },
    });

    return res.status(201).json(newExpense);
  } catch (err) {
    console.error("Error adding expense:", err);
    return res.status(500).json({ error: "Failed to add expense." });
  }
});

// GET route to fetch expenses by filter (daily, weekly, monthly)
router.get("/expenses/:email", async (req: Request, res: Response) => {
  const { email } = req.params;
  const { filter } = req.query; // "filter" is coming as a query parameter

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Fetch all expenses for the user
    let expenses = await prisma.expense.findMany({
      where: { userId: user.id },
    });

    // Filter expenses based on the query parameter
    if (filter === "daily") {
      expenses = expenses.filter((exp) => isToday(new Date(exp.date)));
    } else if (filter === "weekly") {
      expenses = expenses.filter((exp) => isThisWeek(new Date(exp.date)));
    } else if (filter === "monthly") {
      expenses = expenses.filter((exp) => isThisMonth(new Date(exp.date)));
    }

    return res.status(200).json(expenses);
  } catch (err) {
    console.error("Error fetching expenses", err);
    return res.status(500).json({ error: "Failed to fetch expenses" });
  }
});

export default router;
