import { Router } from "express";
import { getUserById} from "../controllers/userController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.use(protect);

router.get("/users/:id", getUserById);


export default router;