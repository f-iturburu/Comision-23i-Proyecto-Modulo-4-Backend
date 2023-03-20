import { Router } from "express";
import {
    getSurveyById,
    getAllSurveys,
    getSurveyByIdWithMyAnswers,
    getAllMySurveys,
    getAllSurveysActive,
    createSurveyWithQuestions,
    updateSurveyPublished,
    deleteSurvey

} from "../controllers/survey.Controllers.js";
import { verifyToken } from "../helpers/validateToken.js";

const router = Router();

router.get("/survey/:id", verifyToken, getSurveyById)
router.get("/survey", verifyToken, getAllSurveys)
router.get("/surveys", verifyToken, getAllMySurveys)
router.get("/survey/:id/answers/me", verifyToken, getSurveyByIdWithMyAnswers);
router.post("/surveys/active", getAllSurveysActive)


router.post("/survey/question", verifyToken, createSurveyWithQuestions)
router.patch("/survey/:id/published", verifyToken, updateSurveyPublished)
router.delete("/survey/:id", verifyToken, deleteSurvey)


export default router;