import { Router } from "express";
import {
  updateQuestion
} from "../controllers/question.Controllers.js";
import { verifyToken } from "../helpers/validateToken.js";

const router = Router();


router.put("/question/:idQuestion/survey/:idSurvey", verifyToken, updateQuestion);


export default router;