import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getMyUser,
  login,
  updateUsername,
  updateUserPassword
} from "../controllers/user.Controllers.js";

import { verifyToken } from "../helpers/validateToken.js";

const router = Router();

router.get("/users", verifyToken,getAllUsers);
router.get("/user", verifyToken,getMyUser);

router.post("/user", createUser);
router.post("/login", login);

router.patch("/user/username", verifyToken,updateUsername)
router.patch("/user/password", verifyToken, updateUserPassword)

export default router;