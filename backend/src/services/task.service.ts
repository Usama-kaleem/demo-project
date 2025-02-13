import { Task } from "../models/Task";

export async function getAllTasks (){
    const task = Task.findAll();

    return task;
}

export async function addTask(title: string, description: string, status: 'pending' | 'completed', deadline: Date, taskListId: number) {
    const task = new Task();
    task.title = title;
    task.description = description;
    task.deadline = deadline;
    task.status= status;
    task.taskListId = taskListId;

    await task.save();

    return task;
}