import express from "express";
import { otherCollectionController } from "./other.collection.controller.js";

const router = express.Router();

router.get("/", otherCollectionController.getOtherCollection);
router.post("/monthly", otherCollectionController.getOtherCollectionMonthly);
router.post("/yearly", otherCollectionController.getOtherCollectionYearly);
router.get("/total", otherCollectionController.getTotalCollection);
router.post("/", otherCollectionController.createOtherCollection);
router.put("/:id", otherCollectionController.updateOtherCollection);
router.delete("/:id", otherCollectionController.deleteOtherCollection);

export const otherCollectionRouter = router;
