import mongoose from "mongoose";
import { monthEnum } from "../../user/user.schema.js"; // Added .js for proper module resolution if you're using ES Modules.

const weeklyCollectionSchema = new mongoose.Schema( // Added `new` keyword for clarity.
  {
    donatePersonName: {
      type: String,
      required: true, // Changed `require` to `required` (correct keyword in Mongoose schema definition).
    },
    year: {
      type: Number,
      required: true, // Changed `require` to `required`.
      enum: [2024, 2025, 2026, 2027, 2028], // Year values should be numbers, not strings.
    },
    month: {
      type: String,
      enum: monthEnum, // `monthEnum` must be imported correctly from the user schema.
      required: true, // Changed `require` to `required`.
    },
    money: {
      type: Number,
      required: true, // Changed `require` to `required`.
    },
    week: {
      type: String,
      required: true, // Changed `require` to `required`.
      enum: ["week-1", "week-2", "week-3", "week-4"], // Valid week options.
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt` fields.
  }
);

// Mongoose Model Creation
const Weekly = mongoose.model("Weekly", weeklyCollectionSchema); // Changed model name to "Weekly" (capitalized for convention).

export default Weekly;
