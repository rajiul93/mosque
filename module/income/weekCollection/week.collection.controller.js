import Weekly from "./week.collection.schema.js";

const createWeeklyCollection = async (req, res) => {
  try {
    const { donatePersonName, year, month, money, week } = req.body;

    if (!donatePersonName || !year || !month || !money || !week) {
      return res.status(400).json({
        success: false,
        message:
          "All fields are required: donatePersonName, year, month, money, and week.",
      });
    }

    const newWeeklyCollection = {
      donatePersonName,
      year,
      month,
      money,
      week,
    };
    const savedDocument = await Weekly.create(newWeeklyCollection);

    return res.status(201).json({
      success: true,
      message: "Weekly collection created successfully",
      data: savedDocument,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error creating weekly collection",
      error: error.message,
    });
  }
};
const getWeeklyCollection = async (req, res) => {
  try {
    const savedDocument = await Weekly.find();

    return res.status(201).json({
      success: true,
      message: "Weekly collection created successfully",
      data: savedDocument,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error creating weekly collection",
      error: error.message,
    });
  }
};
const getWeeklyCollectionTotal = async (req, res) => {
  try {
    const savedDocument = await Weekly.aggregate([
      {
        $group: {
          _id: null,
          totalCollection: { $sum: "$money" },
        },
      },
    ]);

    return res.status(201).json({
      success: true,
      message: "Weekly collection created successfully",
      data: savedDocument,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error total weekly collection",
      error: error.message,
    });
  }
};
const updateWeeklyCollection = async (req, res) => {
  try {
    const { id } = req.params; // URL থেকে আইডি পাওয়া
    const { donatePersonName, year, month, money, week } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "ID is required to update the weekly collection.",
      });
    }

    if (!donatePersonName && !year && !month && !money && !week) {
      return res.status(400).json({
        success: false,
        message:
          "At least one field is required to update: donatePersonName, year, month, money, or week.",
      });
    }

    // আপডেট তথ্য সংগ্রহ
    const updateData = {};
    if (donatePersonName) updateData.donatePersonName = donatePersonName;
    if (year) updateData.year = year;
    if (month) updateData.month = month;
    if (money) updateData.money = money;
    if (week) updateData.week = week;

    // ডাটাবেসে আপডেট করা
    const updatedDocument = await Weekly.findByIdAndUpdate(id, updateData, {
      new: true, // আপডেট হওয়া ডকুমেন্ট রিটার্ন করবে
      runValidators: true, // ভ্যালিডেশন চেক চালাবে
    });

    if (!updatedDocument) {
      return res.status(404).json({
        success: false,
        message: "Weekly collection not found with the given ID.",
      });
    }

    // সফল রেসপন্স
    return res.status(200).json({
      success: true,
      message: "Weekly collection updated successfully.",
      data: updatedDocument,
    });
  } catch (error) {
    console.error(error);

    // ত্রুটির রেসপন্স
    return res.status(500).json({
      success: false,
      message: "Error updating weekly collection.",
      error: error.message,
    });
  }
};

export const weeklyCollectionController = {
  createWeeklyCollection,
  getWeeklyCollection,
  getWeeklyCollectionTotal,
  updateWeeklyCollection,
};
