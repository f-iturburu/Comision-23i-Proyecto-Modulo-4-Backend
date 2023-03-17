import { Router } from "express";

import { createAllAnswers, createAnswer } from "../controllers/answer.Controllers.js";
import { verifyToken } from "../helpers/validateToken.js";

const router = Router();

router.post("/answer/:idQuestion", verifyToken, createAnswer);
router.post("/allAnswers/:idSurvey", verifyToken, createAllAnswers);

export default router;