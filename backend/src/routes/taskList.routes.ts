import { Router } from "express";
import { addMemberToTaskListController, addtaskListController, checktaskListaccessController, checktaskListController, deletetaskListController, gettaskListController, updatetaskListController } from "../controllers/taskList.controller";
import { authenticateJWT } from "../shared/auth.utils";

const router = Router();

router.get('/',authenticateJWT, gettaskListController);
router.get('/check-access', checktaskListaccessController);
router.get('/:name',authenticateJWT, checktaskListController);
router.post('/',authenticateJWT, addtaskListController);
router.put('/:id',authenticateJWT, updatetaskListController);
router.delete('/:id',authenticateJWT, deletetaskListController);
router.post('/addMember', addMemberToTaskListController);


export default router;
