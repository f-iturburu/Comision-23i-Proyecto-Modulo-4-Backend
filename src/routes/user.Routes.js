import { Router } from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  login,
  updateUser,
  updateUserPassword
} from "../controllers/user.Controllers.js";
import { verifyToken } from "../validateToken.js";

const router = Router();


router.get("/user", verifyToken,getAllUsers);
router.post("/user", createUser);
router.get("/user/:id", verifyToken,getUserById);
router.post("/login", login);
router.put("/user", verifyToken,updateUser)
router.patch("/user", verifyToken, updateUserPassword)

export default router;