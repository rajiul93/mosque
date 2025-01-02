import mongoose from "mongoose";

const expenseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    money: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields.
  }
);

const Expense = mongoose.model("expense", expenseSchema);

export default Expense;
