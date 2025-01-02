import { default as OtherCollection } from "./other.collection.schema.js";

const getOtherCollection = async (req, res) => {
  try {
    const savedDocument = await OtherCollection.find();

    return res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: savedDocument,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error creating document",
      error: error.message,
    });
  }
};
const getOtherCollectionMonthly = async (req, res) => {
  try {
    // Body থেকে month এবং year পাওয়ার চেষ্টা
    const { month, year } = req.body;

    // চলমান মাস ও বছর পেতে Date ব্যবহার
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString("default", {
      month: "long",
    }); // যেমন: January
    const currentYear = currentDate.getFullYear(); // যেমন: 2024

    // মাস ও বছর সেট করা
    const filterMonth = month || currentMonth; // যদি বডি থেকে মাস না আসে, তবে বর্তমান মাস নেবে
    const filterYear = year || currentYear; // যদি বডি থেকে বছর না আসে, তবে বর্তমান বছর নেবে

    // MongoDB Aggregate Query
    const savedDocument = await OtherCollection.aggregate([
      {
        $match: {
          month: filterMonth, // মাস অনুযায়ী ফিল্টার
          year: parseInt(filterYear), // বছর অনুযায়ী ফিল্টার
        },
      },
      {
        $group: {
          _id: { month: "$month", year: "$year" }, // মাস এবং বছর উভয়কে গ্রুপ করা হচ্ছে
          totalCollection: { $sum: "$money" }, // টাকার যোগফল
        },
      },
    ]);

    // সফল রেসপন্স
    return res.status(200).json({
      success: true,
      message: `Collection fetched successfully for ${filterMonth}, ${filterYear}`,
      data: savedDocument,
    });
  } catch (error) {
    console.error(error);

    // ত্রুটি হলে রেসপন্স
    return res.status(500).json({
      success: false,
      message: "Error fetching monthly collection",
      error: error.message,
    });
  }
};
const getOtherCollectionYearly = async (req, res) => {
  try {
    // Body থেকে year পাওয়ার চেষ্টা
    const { year } = req.body;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const requestedYear = year || currentYear;
     console.log(requestedYear);

    const result = await OtherCollection.aggregate([
      {
        $match: {
          year: requestedYear.toString(), // বছর অনুযায়ী ফিল্টার
        },
      },
      {
        $group: {
          _id: "$year", // শুধু বছরের ভিত্তিতে গ্রুপ করা হচ্ছে
          totalCollection: { $sum: "$money" }, // টাকার যোগফল বের করা
        },
      },
    ]);
    console.log(result);
    // সফল রেসপন্স
    return res.status(200).json({
      success: true,
      message: `Yearly collection fetched successfully for ${requestedYear}`,
      data: result,
    });
  } catch (error) {
    console.error(error);

    // ত্রুটি হলে রেসপন্স
    return res.status(500).json({
      success: false,
      message: "Error fetching yearly collection",
      error: error.message,
    });
  }
};

const getTotalCollection = async (req, res) => {
  try {
    const savedDocument = await OtherCollection.aggregate([
      {
        $group: {
          _id: null,
          totalCollection: { $sum: "$money" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: `Get total`,
      data: savedDocument,
    });
  } catch (error) {
    console.error(error);

    // ত্রুটি হলে রেসপন্স
    return res.status(500).json({
      success: false,
      message: "Error fetching yearly collection",
      error: error.message,
    });
  }
};

const createOtherCollection = async (req, res) => {
  try {
    // রিকোয়েস্ট থেকে ডেটা সংগ্রহ।
    const { year, month, donatePersonName, money } = req.body;

    console.log(req.body);

    // ডকুমেন্ট সেভ করুন।
    const savedDocument = await OtherCollection.create({
      year,
      month,
      money,
      donatePersonName,
    });
    console.log(savedDocument);
    return res.status(201).json({
      success: true,
      message: "Document created successfully",
      data: savedDocument,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error creating document",
      error: error.message,
    });
  }
};
const updateOtherCollection = async (req, res) => {
  try {
    const { year, month, money, donatePersonName } = req.body;
    const id = req.params.id;

    const updateDoc = {
      year,
      month,
      money,
      donatePersonName,
    };
    const savedDocument = await OtherCollection.findByIdAndUpdate(
      id,
      updateDoc
    );
    return res.status(201).json({
      success: true,
      message: "Document update successfully",
      data: savedDocument,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Error creating document",
      error: error.message,
    });
  }
};
const deleteOtherCollection = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const result = await OtherCollection.deleteOne({ _id: id });
    return res.status(200).json({
      success: true,
      message: "Document delete successfully",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error delete document",
      error: error.message,
    });
  }
};

export const otherCollectionController = {
  createOtherCollection,
  getOtherCollection,
  deleteOtherCollection,
  updateOtherCollection,
  getOtherCollectionMonthly,
  getOtherCollectionYearly,
  getTotalCollection,
};
