import { Router } from "express";
import { createAnswer } from "../controllers/answer.Controllers.js";
import { verifyToken } from "../validateToken.js";

const router = Router();

router.post("/answer/:idQuestion", verifyToken,createAnswer);

export default router;