import express from "express";
import GuestController from "../controllers/GuestController";

const router = express.Router();

router.get("/fields", GuestController.findFields);
router.get("/districts", GuestController.findDistricts);
router.get("/churches", GuestController.findChurches);

export default router;
