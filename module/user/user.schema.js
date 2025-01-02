import mongoose from "mongoose";
export const monthEnum = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const rolesEnum = [
  "president",
  "vice president",
  "general secretory",
  "assistant editor",
  "accounter",
  "assistant accounter",
  "advisor",
];
const paymentSchema = new mongoose.Schema({
  year: {
    type: Number,
  },
  month: {
    type: String,
    enum: monthEnum,
    required: true,
  },
  amount: {
    type: Number,
    min: 0,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    phone: {
      type: Number, 
    },
    imageUrl:{
      type:String,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "user"],
    },
    category: {
      type: String,
      enum: rolesEnum,
      required: false,
    },
    payment: {
      type: [paymentSchema],
      default: [],
    },
    fixAmount:{
        type:Number,
        default:0
    },
    status: {
      type:String,
      enum: ["inactive" , "active", "block"]
    }

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
