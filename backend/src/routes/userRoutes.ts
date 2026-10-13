import { Router } from "express";
import {getAllUsers,getUserById,
    updateUser,deleteUser
} from "../controllers/userController";
import { protect, adminOnly } from "../middleware/authMiddleware";

const router = Router();

router.use(protect);

router.get("/me", getUserById);
router.put("/me", updateUser);

router.get("/", adminOnly, getAllUsers);
router.get("/:id", adminOnly, getUserById);
router.put("/:id", adminOnly, updateUser);
router.delete("/:id", adminOnly, deleteUser);

export default router;