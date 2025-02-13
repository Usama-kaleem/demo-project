import { Router } from "express";
import { addTaskController, getTaskController, deleteTaskController, updateTaskController, getTasksByListIdController } from "../controllers/task.controller";
import { subdomainAuth } from "../shared/auth.utils";

const router = Router();


router.get('/',getTaskController);
router.get('/:id',getTasksByListIdController);
router.post('/',addTaskController);
router.put('/',updateTaskController);
router.delete('/',deleteTaskController);

export default router;
