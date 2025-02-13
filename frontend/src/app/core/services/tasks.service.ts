import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ITasks } from "../interfaces/model/tasks.model.interface";

@Injectable({
  providedIn: 'root'
})

export class tasksService {

    baseURL = environment.BACKEND_URL+'/api/tasks';
    httpClient = inject(HttpClient);
    
    constructor() { }

    getTaskbyId(id: number) {
      console.log('Get Task by ID:', id);
        return this.httpClient.get<ITasks>(this.baseURL + '/' + id);
    }

    addtask(task: ITasks) {
      console.log('Add Task:', task.taskListId);
        return this.httpClient.post<ITasks>(this.baseURL, task);
    }

    updateTaskStatus(taskId: number, status: string) {
      return this.httpClient.put<ITasks>(`${this.baseURL}`, { status, id: taskId });
    }
}