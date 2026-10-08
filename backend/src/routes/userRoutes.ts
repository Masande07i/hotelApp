import { Router } from "express";
import { getUserById, updateUserById, deleteUserById} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.use(protect);

router.get("/users/:id", getUserById);
router.put("/users/:id", updateUserById);
router.delete("/users/:id", deleteUserById);

export default router;