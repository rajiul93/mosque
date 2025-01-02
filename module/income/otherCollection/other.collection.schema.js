import mongoose from "mongoose";
import { monthEnum } from "../../user/user.schema.js";

const otherCollectionSchema = new mongoose.Schema(
  {
    donatePersonName: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      require: true,
      enum: ["2024", "2025", "2026", "2027", "2028"],
    },
    month: {
      type: String,
      enum: monthEnum,
      require: true,
    },
    money: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);
const OtherCollection = mongoose.model(
  "otherCollection",
  otherCollectionSchema
);

export default OtherCollection;
