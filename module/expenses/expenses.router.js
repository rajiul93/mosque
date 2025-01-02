import express from "express";
import { expenseController } from "./expenses.controller.js";

const router = express.Router();


router.post("/", expenseController.createExpense); // Create an expense
router.get("/", expenseController.getAllExpenses); // Get all expenses
router.get("/total", expenseController.getAllExpensesTotal); // Get all expenses
router.put("/:id", expenseController.updateExpense); // Update an expense by ID
router.delete("/:id", expenseController.deleteExpense);

export const expenseRouter = router;
