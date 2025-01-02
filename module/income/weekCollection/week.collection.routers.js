import express from "express"
import { weeklyCollectionController } from "./week.collection.controller.js"

const router  = express.Router()

router.get("/", weeklyCollectionController.getWeeklyCollection)
router.get("/total", weeklyCollectionController.getWeeklyCollectionTotal)
router.post("/", weeklyCollectionController.createWeeklyCollection)
router.put("/:id", weeklyCollectionController.updateWeeklyCollection)

export const weeklyCollectionRouter =  router
