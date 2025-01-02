import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import { expenseRouter } from "./module/expenses/expenses.router.js";
import { otherCollectionRouter } from "./module/income/otherCollection/other.collection.router.js";
import { weeklyCollectionRouter } from "./module/income/weekCollection/week.collection.routers.js";
import { userRouter } from "./module/user/user.router.js";
const app = express();


const corsOptions = {
  origin: ["http://localhost:5173", "http://localhost:5174"],
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());
dotenv.config();

const port = process.env.PORT || 3000;
const uri = process.env.DB_URL;
async function main() {
  try {
    await mongoose
      .connect(uri)
      .then(() => console.log("Database connected successfully"))
      .catch((err) => console.error("Database connection error:", err));

    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}
main();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/other-collection" , otherCollectionRouter)
app.use("/api/v1/weekly-collection" ,  weeklyCollectionRouter)
app.use("/api/v1/expenses" ,   expenseRouter) 
 
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});