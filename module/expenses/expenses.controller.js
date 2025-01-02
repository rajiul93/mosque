import Expense from "./expenses.schema.js";

const createExpense = async (req, res) => {
  try {
    const {title, money } = req.body;

    if (!title || !money) {
      return res.status(400).json({
        success: false,
        message: "Both 'insertBy' and 'costField' are required.",
      });
    }

    const newExpense = { title, money };
    const savedExpense = await Expense.create(newExpense);

    return res.status(201).json({
      success: true,
      message: "Expense created successfully.",
      data: savedExpense,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error creating expense.",
      error: error.message,
    });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();

    return res.status(200).json({
      success: true,
      message: "Expenses fetched successfully.",
      data: expenses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching expenses.",
      error: error.message,
    });
  }
};
const getAllExpensesTotal = async (req, res) => {
  try {
    const expenses = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalCollection: { $sum: "$money" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Expenses fetched successfully.",
      data: expenses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching expenses.",
      error: error.message,
    });
  }
};

const updateExpense = async (req, res) => {
  try {
    const { id } = req.params; // Get expense ID from URL params
    const { insertBy, costField, money } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required for updating.",
      });
    }

    // Prepare update data
    const updateData = {};
    if (insertBy) updateData.insertBy = insertBy;
    if (costField) updateData.costField = costField;
    if (money) updateData.money = money;

    const updatedExpense = await Expense.findByIdAndUpdate(id, updateData, {
      new: true, // Return the updated document
      runValidators: true, // Validate against schema
    });

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found with the given ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully.",
      data: updatedExpense,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating expense.",
      error: error.message,
    });
  }
};
const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params; // Get expense ID from URL params

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required for deletion.",
      });
    }

    const deletedExpense = await Expense.findByIdAndDelete(id);

    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found with the given ID.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully.",
      data: deletedExpense,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting expense.",
      error: error.message,
    });
  }
};

export const expenseController = {
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  getAllExpensesTotal,
};
