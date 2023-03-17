import { Router } from "express";
import {
    getSurveyById,
    createSurvey,
    getAllSurveys,
    getSurveyByIdWithMyAnswers,
    getAllMySurveys,
    getAllSurveysActive,
    createSurveyWithQuestions,
    updateSurveyPublished,
    updateSurveyCategories,
    updateSurveyEndDate
} from "../controllers/survey.Controllers.js";
import { verifyToken } from "../helpers/validateToken.js";

const router = Router();

router.get("/survey/:id", verifyToken, getSurveyById)
router.get("/survey", verifyToken, getAllSurveys)
router.get("/surveys", verifyToken, getAllMySurveys)
router.get("/survey/:id/answers/me", verifyToken, getSurveyByIdWithMyAnswers);
router.get("/surveys/active", getAllSurveysActive)

router.post("/survey", verifyToken, createSurvey)
router.post("/survey/question", verifyToken, createSurveyWithQuestions)

router.patch("/survey/:id/published", verifyToken, updateSurveyPublished)
router.patch("/survey/:id/categories", verifyToken, updateSurveyCategories)
router.patch("/survey/:id/date", verifyToken, updateSurveyEndDate)

export default router;