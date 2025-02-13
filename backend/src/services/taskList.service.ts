import { TaskList } from "../models/TaskList";
import { UserTaskList } from "../models/UserTaskList";


export async function getAlltaskList (userId: number){

    const userTaskLists = await UserTaskList.findAll({
        where: {
          userId
        }
      });
  
      const taskListIds = userTaskLists.map(utl => utl.taskListId);
  
      const taskListsFromUserTaskList = await TaskList.findAll({
        where: {
          id: taskListIds
        }
      });
  
      const taskListsFromUserId = await TaskList.findAll({
        where: {
          userId
        }
      });
  
      const combinedTaskLists = [...taskListsFromUserTaskList, ...taskListsFromUserId];
      const uniqueTaskLists = Array.from(new Set(combinedTaskLists.map(tl => tl.id)))
        .map(id => combinedTaskLists.find(tl => tl.id === id));
  
      return uniqueTaskLists;
    
}
export async function getAlltaskLists (){

    const taskList = TaskList.findAll();

    return taskList;
}

export async function addtaskList(name: string, slug: string, userId: number){
    const taskList = new TaskList();
    taskList.name = name;
    taskList.slug = slug;
    taskList.userId = userId;
    await taskList.save();
    
    return taskList;
}
export async function addTaskListToUser(userId: number, taskListId: number){
    
    const userTaskList = new UserTaskList();
    console.log("userId", userId);
    console.log("taskListId", taskListId);
    userTaskList.userId = userId;
    userTaskList.taskListId = taskListId;
    console.log("userTaskList", userTaskList);
    await userTaskList.save();
    
    return userTaskList;
}

export async function gettaskListBySlug(slug: string) {
    const taskList = await TaskList.findOne({
        where:{
            slug
        }
    })
    return taskList;
}

export async function gettaskListById(id: number){
    const taskList = await TaskList.findByPk(id);
    return taskList;
}

export async function deletetaskList(id: number){
    const taskList = await TaskList.findByPk(id);
    if(!taskList){
        throw new Error ('taskList Not Found');
    }
    //if taskList is there
    await taskList.destroy();

    return taskList;
}
export const getTaskListById = async (id: string) => {
  return await TaskList.findByPk(id);
};

export const checkUserTaskList = async (userId: number, taskListId: number) => {
    try {
        return await UserTaskList.findOne({
            where:{
                userId,
                taskListId
            }
        });
    }
    catch(error){
        return false;
    }
}

