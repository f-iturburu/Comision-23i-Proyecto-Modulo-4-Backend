import { Router } from "express";
import {
  createQuestion
} from "../controllers/question.Controllers.js";
import { verifyToken } from "../validateToken.js";

const router = Router();


router.post("/question/:idSurvey", verifyToken, createQuestion);


export default router;
