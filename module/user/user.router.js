import express from "express";
import { authMiddleware } from "../../middleware/middleware.js";
import { userController } from "./user.controller.js";

const router = express.Router();
router.get("/overall-collection", userController.overallCollection);
router.post("/", userController.createUser);
router.post("/login", userController.login);

router.get("/", userController.getAllUser);
router.get("/role", userController.getUserRoleByPhone);
router.get("/category", userController.getUsersWithCategory);
router.get("/:phone", authMiddleware,  userController.getSingleUser);
router.get("/total/sum", userController.getTotalSum);

router.get("/all-payment-history/:id", userController.getAllPaymentHistory);

router.get("/all-user/payment", userController.getAllUsersPaymentHistory);

router.get("/specific-payment-history/:id", userController.getPaymentHistoryByYear);

router.put("/:id/payments", userController.addNewPayment);
router.put("/fixed-amount/:userId", userController.updateFixedAmount);
router.put("/image-update/:userId", userController.updateImage);
router.put("/phone-update", userController.updatePhoneNumber);
router.put("/update-amount/:userId", userController.updatePaymentAmount);
router.put("/update-category/:id", userController.categoryUpdate);
router.put("/update-role/:id", userController.updateUserRole);



router.delete("/user/specific-payment/:userId", userController.deleteUserPayment);

export const userRouter = router;
