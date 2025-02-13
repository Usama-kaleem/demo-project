import { Request, Response } from "express";
import { addTask, getAllTasks } from "../services/task.service";
import { Task } from "../models/Task";
import Joi from "joi";

export const getTaskController = async (req: Request, res: Response) => {

    const categories = await getAllTasks();

    res.json(categories)
}

export const addTaskController = async (req: Request, res: Response) => {

    const schema = Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        status: Joi.string().valid('pending', 'completed').required(),
        deadline: Joi.date(),
        taskListId: Joi.number().required()
    })
    const schemaValidation = schema.validate(req.body);
    if (schemaValidation.error) {
         res.status(400).json(schemaValidation.error.details);
         return;
    }

    const { title, description,status, deadline,taskListId } = req.body;

    const task = await addTask(title, description, status, deadline,taskListId);

    res.json(task);
}

export const updateTaskController = async (req: Request, res: Response) => {

    const schema = Joi.object({
        status: Joi.string().valid('pending', 'completed').required(),
        id: Joi.number().required()
    })
    const schemaValidation = schema.validate(req.body);
    if (schemaValidation.error) {
         res.status(400).json(schemaValidation.error.details);
         return
    }
    const {status, id} = req.body;
    const task = await Task.findByPk(id);
    if(!task){
         res.status(404).json({message: 'Task not found'});
         return
    }
    task.status = status;
    await task.save();

    res.json(task);
    
}
export const deleteTaskController = async (req: Request, res: Response)  => {

    const schema = Joi.object({
        id: Joi.number().required()
    })
    const schemaValidation = schema.validate(req.body);
    if (schemaValidation.error) {
         res.status(400).json(schemaValidation.error.details)
         return
    }
    const {id} = req.body;
    const task = await Task.findByPk(id);
    if(!task){
         res.status(404).json({message: 'Task not found'});
         return
    }
    await task.destroy();

     res.json({message: 'Task deleted'});
}

export const getTasksByListIdController = async (req: Request, res: Response) => {
    
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ message: 'Id is required' });
        return;
    }

    const tasks = await Task.findAll({
        where: {
            taskListId: id
        }
    });

    if (!tasks) {
        res.status(404).json({ message: 'Tasks not found' });
        return;
    }

    res.json(tasks);
}
