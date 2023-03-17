import { Router } from "express";
import {
    getSurveyById,
    createSurvey,
    getAllSurveys
} from "../controllers/survey.Controllers.js";
import { verifyToken } from "../validateToken.js";

const router = Router();


router.get("/survey/:id",getSurveyById);
router.post("/survey", verifyToken,createSurvey);
router.get("/survey", getAllSurveys);

export default router;
