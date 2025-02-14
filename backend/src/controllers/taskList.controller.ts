import { Request, Response } from "express";
import Joi from "joi";
import { generateSlug } from "../shared/general.utils";
import { addtaskList, addTaskListToUser, deletetaskList, getAlltaskList, getAlltaskLists, gettaskListById, gettaskListBySlug } from "../services/taskList.service";
import { User } from "../models/User";
import { TaskList } from "../models/TaskList";
import { io } from "..";
import { UserTaskList } from "../models/UserTaskList";
import { get } from "http";

export const gettaskListController = async (req: Request, res: Response) => {

    const userId = (req as any).user.get('id');

    const taskList = await getAlltaskList(userId);


    res.json(taskList)
}
export const checktaskListaccessController = async (req: Request, res: Response) => {
    
    const { taskListId,userId  } = req.query;


    console.log('taskListId', taskListId);
    console.log('userId', userId);
    if (!userId || !taskListId) {
        res.status(400).json({ message: 'Invalid request' });
        return;
    }
    const user = await User.findByPk(parseInt(userId as string));
    const taskList = await TaskList.findByPk(parseInt(taskListId as string));

    if (!userId) {
        res.status(404).json({ message: 'User or not found' });
        return;
    }

    if (!userId) {
        res.status(404).json({ message: 'Task list not found' });
        return;
    }
    if (taskList && taskList.get('userId') === parseInt(userId as string)) {
        res.status(200).json({ access: true });
        return;
    }
    const userTaskList = await UserTaskList.findOne({
        where: {
            userId,
            taskListId
        }
    });
    if (userTaskList) {
        res.status(200).json({ access: true });
        return;
    }


    res.status(200).json({ access: false });
}
export const checktaskListController = async (req: Request, res: Response) => {
    //get name from params
    const { name } = req.params;
    const taskList = await TaskList.findOne({
        where: {
            name
        }
    });

    if (!taskList) {
        res.status(200).json({ available: true }); // Task list name is present
       
    } else {
        res.status(200).json({ available: false });
       
    }
}
export const addtaskListController = async (req: Request , res: Response) => {

    const schema = Joi.object({
        name: Joi.string().required()
    });

    const schemaValidation = schema.validate(req.body);
    if (schemaValidation.error) {
         res.status(400).json(schemaValidation.error.details);
         return;
    }

    const {name} = req.body;
    const userId = (req as any).user.get('id');
    let slug = generateSlug(name);

    const taskListBySlug = await gettaskListBySlug(slug);
    if(taskListBySlug){
        slug=generateSlug(name, true);
    }
    
    const taskList = await addtaskList(name, slug, userId);
    const userTaskList = await addTaskListToUser(userId, taskList.get('id'));

    res.json(taskList);
}
export const deletetaskListController = async (req: Request, res: Response) =>{

    const { id } = req.params;
    //checking if we found the taskList or not
    
    let taskList = await gettaskListById(parseInt(id));

    if(!taskList){
        res.status(404).json({message: 'TaskList Not Found :('})
        return;
    }
    //If we have the taskList
    await deletetaskList(parseInt(id));

    res.json(taskList);

}
export const updatetaskListController = async (req: Request, res: Response) => {
    const schema = Joi.object({
        name: Joi.string().required()
    });
    const schemaValidation = schema.validate(req.body);
    if (schemaValidation.error) {
         res.status(400).json(schemaValidation.error.details);
         return;
    }
    const { name } = req.body;
    const { id } = req.params;
    const taskList = await TaskList.findByPk(id);
    if(!taskList){
         res.status(404).json({message: 'TaskList not found'});
         return;
    }
    taskList.name = name;
    await taskList.save();

    res.json(taskList);
}
export const addMemberToTaskListController = async (req: Request, res: Response) => {

    const { taskListId, userId } = req.body;
    if(!taskListId || !userId){
        res.status(400).json({message: 'Invalid Data'});
        return;
    }
    const addMember = await addTaskListToUser(parseInt(userId), parseInt(taskListId));
    const tasklistname = await TaskList.findByPk(parseInt(taskListId));
    const name = tasklistname?.get('name')
    const tasklist = await gettaskListById(parseInt(taskListId));

    io.to(`user-${userId}`).emit(`user-${userId}`, { userId, name, tasklist });

    res.json({addMember ,message: 'User added to task list'});
}
