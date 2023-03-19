import { Router } from "express";

import { createAllAnswers} from "../controllers/answer.Controllers.js";
import { verifyToken } from "../helpers/validateToken.js";

const router = Router();

router.post("/allAnswers/:idSurvey", verifyToken, createAllAnswers);

export default router;