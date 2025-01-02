import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Expense from "../expenses/expenses.schema.js";
import OtherCollection from "../income/otherCollection/other.collection.schema.js";
import Weekly from "../income/weekCollection/week.collection.schema.js";
import User from "./user.schema.js";
const createUser = async (req, res) => {
  try {
    const { phone, password, name } = req.body;
    console.log(req.body);
    // Make sure to get other details too if needed
    const user = await User.findOne({ phone });

    if (user === null) {
      // If user doesn't exist, create a new one
      const newUser = new User({
        phone,
        password,
        name, // Add any other fields you need for the user
      });

      const savedUser = await newUser.save();

      return res.status(201).json({
        success: true,
        message: "User created successfully!",
        data: savedUser,
      });
    } else {
      // If user exists, return a response with an appropriate message
      return res.status(400).json({
        success: false,
        message: "Email is already in use.",
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const { phone, password } = req.body;
    // Make sure to get other details too if needed
    const user = await User.findOne({ phone });

    if (!user) {
      console.log("user passi na");

      res.status(400).json({
        success: false,
        message: "User Not Found",
        error: error.message,
      });
    }
    if (user.password !== password) {
      console.log("user password milche na");

      res.status(400).json({
        success: false,
        message: "wrong password",
        error: error.message,
      });
    }
    if (user.phone === parseInt(phone) && user.password === password) {
      const token = jwt.sign(
        {
          data: user.phone,
        },
        "secret",
        { expiresIn: "1h" }
      );

      res.status(200).json({
        success: true,
        message: "successfully login",
        data: token,
      });
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const allUser = await User.find();

    res.status(201).json({
      success: true,
      message: "Get all user  successfully!",
      data: allUser,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error get  user",
      error: error.message,
    });
  }
};
const getSingleUser = async (req, res) => {
  try {
    console.log(req.phone);
    const phone = req.params.phone;
    const allUser = await User.findOne({ phone });

    res.status(201).json({
      success: true,
      message: "Get all user  successfully!",
      data: allUser,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error get  user",
      error: error.message,
    });
  }
};

// Controller to update the phone number
const updatePhoneNumber = async (req, res) => {
  try {
    const { userId, phone } = req.body;
    console.log(req.body.userId);
    // Validate the input
    if (!userId || !phone) {
      return res
        .status(400)
        .json({ message: "User ID and phone number are required" });
    }

    // Check if the phone number is valid
    if (!/^\d{10,15}$/.test(phone)) {
      return res.status(400).json({ message: "Invalid phone number format" });
    }

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { phone },
      { new: true, runValidators: true } // Return the updated document and apply validation
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the updated user data
    res.status(200).json({
      message: "Phone number updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating phone number:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

const addNewPayment = async (req, res) => {
  try {
    const { id } = req.params; // Get User ID from URL
    const { year, month, amount } = req.body; // Get Payment Data from Request Body

    if (!year || !month || !amount) {
      return res.status(400).json({
        message: "All payment fields (year, month, amount) are required.",
      });
    }

    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a payment with the same year and month already exists
    const isDuplicate = user.payment.find(
      (p) => p.year === parseInt(year) && p.month === month
    );

    if (isDuplicate) {
      throw new Error(`Payment already exists for ${month}, ${year}`);
    }

    // Create a new payment object
    const newPayment = { year, month, amount };

    // Add the new payment to the user's payment array
    user.payment.push(newPayment);

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "New payment added successfully",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding new payment",
      error: error.message,
    });
  }
};

const updateFixedAmount = async (req, res) => {
  try {
    const { userId } = req.params; // Get User ID from URL
    const { fixAmount } = req.body; // Get fixedAmount from request body

    // Validate the input
    if (fixAmount === undefined || fixAmount === null) {
      return res.status(400).json({
        message: "fixedAmount is required",
      });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update the fixedAmount
    user.fixAmount = fixAmount;

    // Save the updated user
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "fixedAmount updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating fixedAmount",
      error: error.message,
    });
  }
};
const updateImage = async (req, res) => {
  try {
    const { userId } = req.params; // Get User ID from URL
    const { imageUrl } = req.body; // Get fixedAmount from request body

    // Validate the input
    if (imageUrl === undefined || imageUrl === null) {
      return res.status(400).json({
        message: "fixedAmount is required",
      });
    }

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Update the fixedAmount
    user.imageUrl = imageUrl;

    // Save the updated user
    const updatedUser = await user.save();

    return res.status(200).json({
      success: true,
      message: "fixedAmount updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating fixedAmount",
      error: error.message,
    });
  }
};

const getAllPaymentHistory = async (req, res) => {
  try {
    // Check if req.params.id is valid and is a valid MongoDB ObjectId
    if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID provided",
      });
    }

    // Use aggregate to fetch payment history for the user
    const result = await User.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.id), // Match the user by ObjectId
        },
      },
      {
        $unwind: "$payment", // Unwind the 'payment' array
      },
      {
        $group: {
          _id: "$payment.year", // Group payments by year
          payments: {
            $push: {
              month: "$payment.month",
              amount: "$payment.amount",
              paymentId: "$payment._id",
            },
          },
        },
      },
      {
        $project: {
          year: "$_id", // Show year
          payments: 1, // Show payment details
          _id: 0, // Do not show the MongoDB default _id field
        },
      },
    ]);

    // If no results are found, send a 404 response
    if (!result || result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No payments found for the specified user.",
      });
    }

    // Send the successful response
    return res.status(200).json({
      success: true,
      message: "User payments fetched successfully",
      data: result,
    });
  } catch (error) {
    // Log the error and send the response
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user payments",
      error: error.message,
    });
  }
};
const getPaymentHistoryByYear = async (req, res) => {
  try {
    // Extract user ID and year from request parameters or query
    const userId = req.params.id;
    const requestedYear = parseInt(req.query.year) || new Date().getFullYear(); // Default to current year if not provided

    // Validate if the user ID is valid
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID provided",
      });
    }

    // Aggregation pipeline to get payments for a specific year
    const result = await User.aggregate([
      // Step 1: Match user by ID
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },

      // Step 2: Unwind the payments array to process each payment individually
      { $unwind: "$payment" },

      // Step 3: Match payments for the specific year (or current year if not provided)
      { $match: { "payment.year": requestedYear } },

      // Step 4: Optionally, group payments back into an array for easier handling
      {
        $group: {
          _id: "$_id", // Group by the user ID
          userName: { $first: "$userName" },
          payments: { $push: "$payment" },
        },
      },
    ]);

    // Check if the user exists and has payments for the requested year
    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No payments found for user ${userId} in the year ${requestedYear}`,
      });
    }

    // Return the successful response with the payment data
    return res.status(200).json({
      success: true,
      message: `Payments for the year ${requestedYear} fetched successfully`,
      data: result[0].payments,
    });
  } catch (error) {
    // Log the error and send the response
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user payments",
      error: error.message,
    });
  }
};

const getTotalSum = async (req, res) => {
  try {
    const result = await User.aggregate([
      { $unwind: "$payment" },
      {
        $group: {
          _id: null,
          totalSum: { $sum: "$payment.amount" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: `total sum get successfully`,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user payments",
      error: error.message,
    });
  }
};

const updatePaymentAmount = async (req, res) => {
  try {
    const userId = req.params.userId; // User ID from the route parameter
    const { year, month, amount } = req.body; // Year, month, and amount from the request body

    // Validate the inputs
    if (!year || !month || !amount) {
      return res.status(400).json({
        success: false,
        message: "Year, month, and amount are required fields.",
      });
    }

    // Find the user by their ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Find the payment for the specific year and month
    const paymentIndex = user.payment.findIndex(
      (payment) => payment.year === year && payment.month === month
    );

    if (paymentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Payment record for ${month} ${year} not found.`,
      });
    }

    // Update the amount for the specific payment
    user.payment[paymentIndex].amount = amount;

    // Save the updated user document
    await user.save();

    return res.status(200).json({
      success: true,
      message: `Payment amount updated for ${month} ${year}.`,
      data: user.payment[paymentIndex],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error updating payment amount.",
      error: error.message,
    });
  }
};

const getAllUsersPaymentHistory = async (req, res) => {
  try {
    const { year } = req.query; // বছর চাওয়ার জন্য URL এর query থেকে নিতে হবে
    console.log("Requested Year:", year);

    const currentYear = parseInt(year) || moment().year(); // যদি বছর না দেয়া হয়, বর্তমান বছর নিবো
    const currentYearStr = Number(currentYear); // বছরকে স্ট্রিং এ কনভার্ট করা

    // সকল ইউজারদের পেমেন্ট তথ্য নিয়ে আসা, এবং নির্দিষ্ট বছর অনুযায়ী ফিল্টার করা
    const users = await User.aggregate([
      {
        $project: {
          name: 1, // ইউজারের নাম
          role: 1, // ইউজারের রোল
          payment: {
            $filter: {
              input: "$payment", // ইউজারের পেমেন্ট অ্যারে
              as: "payment",
              cond: { $eq: [String("$$payment.year"), currentYearStr] }, // বছরের সাথে স্ট্রিং হিসাবে তুলনা
            },
          },
        },
      },
    ]);
    console.log(users);

    // যদি কোনো পেমেন্ট ডেটা না পাওয়া যায়
    const usersWithNoPayment = users.filter(
      (user) => user.payment.length === 0
    );

    // যদি কোন পেমেন্ট ডেটা না থাকে, তবে 404 রিটার্ন করুন
    if (usersWithNoPayment.length === users.length) {
      return res.status(404).json({
        success: false,
        message: `No payment data found for the year ${currentYear}.`,
      });
    }

    // যদি পেমেন্ট ডেটা থাকে, তবে 200 রিটার্ন করুন
    return res.status(200).json({
      success: true,
      message: `Payment data retrieved for the year ${currentYear}.`,
      data: users.filter((user) => user.payment.length > 0), // শুধুমাত্র পেমেন্ট তথ্য সহ ইউজার রিটার্ন করা
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error retrieving payment data.",
      error: error.message,
    });
  }
};
// const deleteUserPayment = async (req, res) => {
//   try {
//     const { userId } = req.params; // ইউজার ID
//     const { paymentId } = req.body; // পেমেন্ট ID
//     console.log(req.body);

//     const user = await User.updateOne(
//       { _id: userId },
//       { $pull: { payment: { _id: paymentId } } },
//       { new: true }
//     );

//     console.log(user);

//     if (user.n === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No payment record found or user not found.",
//       });
//     }

//     // পেমেন্ট সফলভাবে ডিলিট হলে
//     return res.status(200).json({
//       success: true,
//       message: "Payment record deleted successfully.",
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       success: false,
//       message: "Error deleting payment record.",
//       error: error.message,
//     });
//   }
// };
const deleteUserPayment = async (req, res) => {
  try {
    const { userId } = req.params;
    const { paymentId } = req.query;

    const user = await User.updateOne(
      { _id: userId },
      { $pull: { payment: { _id: paymentId } } }
    );

    if (user.matchedCount === 0 || user.modifiedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No payment record found or user not found.",
      });
    }

    // যাচাই করুন ডেটা মুছে গেছে কি না
    const updatedUser = await User.findOne({ _id: userId });

    return res.status(200).json({
      success: true,
      message: "Payment record deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error deleting payment record.",
      error: error.message,
    });
  }
};
const overallCollection = async (req, res) => {
  try {
    const userTotal = await User.aggregate([
      { $unwind: "$payment" },
      {
        $group: {
          _id: null,
          totalSum: { $sum: "$payment.amount" },
        },
      },
    ]);
    const weekCollection = await Weekly.aggregate([
      {
        $group: {
          _id: null,
          totalCollection: { $sum: "$money" },
        },
      },
    ]);

    const otherCollection = await OtherCollection.aggregate([
      {
        $group: {
          _id: null,
          totalCollection: { $sum: "$money" },
        },
      },
    ]);
    const expenses = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalCollection: { $sum: "$money" },
        },
      },
    ]);
    const totalExpense = expenses[0];

    const otherTotal = otherCollection[0].totalCollection;
    const weekTotal = weekCollection[0].totalCollection;
    const userTotalSum = userTotal[0].totalSum;

    return res.status(200).json({
      success: true,
      message: `total sum get successfully`,
      data: {
        weekCollection,
        userTotal,
        otherCollection,
        otherTotal,
        weekTotal,
        userTotalSum,
        totalExpense,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user payments",
      error: error.message,
    });
  }
};
const categoryUpdate = async (req, res) => {
  const { id } = req.params; // User ID from request parameters
  const category = req.body; // Fields to update from the request body
  console.log(category);

  try {
    const user = await User.findByIdAndUpdate(
      id,
      { $set: category }, // Only update the specified fields
      { new: true, runValidators: true } // Return the updated document and run validations
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user);
    res.status(200).json(user); // Respond with the updated user
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to update user", details: error.message });
  }
};

const getUsersWithCategory = async (req, res) => {
  try {
    // Find users with a defined 'category' field
    const users = await User.find(
      { category: { $exists: true, $ne: null } }, // Ensure 'category' is not null or undefined
      { name: 1, category: 1, imageUrl: 1, _id: 0,phone:1 } // Select only name, category, and imageUrl fields
    );

    res.status(200).json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error("Error fetching users with category:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
 

// Update user details by ID
  const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params; // Get the user ID from the route params
    const updates = req.body; // Fields to update from the request body

    // Fetch the user to check the role
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent updates to admin users
    if (user.role === "admin") {
      return res.status(403).json({
        error: "Admins cannot be updated",
      });
    }

    // Proceed to update if the role is not admin
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: updates }, // Dynamically update fields
      { new: true, runValidators: true } // Return the updated document and run validation
    );

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user", details: error.message });
  }
};


// Get single user's role by phone
 const getUserRoleByPhone = async (req, res) => {
  const { phone } = req.query;

  try {
    // Find user by phone
    const user = await User.findOne({ phone: phone }).select("role");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the role of the user
    res.status(200).json({ role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const userController = {
  createUser,
  login,
  getAllUser,
  addNewPayment,
  getSingleUser,
  updateFixedAmount,
  getAllPaymentHistory,
  getPaymentHistoryByYear,
  updatePaymentAmount,
  getAllUsersPaymentHistory,
  deleteUserPayment,
  updateImage,
  getTotalSum,
  updatePhoneNumber,
  overallCollection,
  categoryUpdate,
  getUsersWithCategory,
  updateUserRole,
  getUserRoleByPhone
};
