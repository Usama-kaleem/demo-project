import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ITaskList } from "../interfaces/model/taskList.model.interface";
import { AuthService } from "./auth.service";
import { map, Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class TaskListService {

    baseURL = environment.BACKEND_URL+'/api/taskList';
    httpClient = inject(HttpClient);
    authService = inject(AuthService);
    
    constructor() {
    }
    getTaskLists() {
        let session = localStorage.getItem('session');
        this.authService.session = session ? JSON.parse(session) : undefined;
        return this.httpClient.get<ITaskList[]>(this.baseURL, {
            headers: {
                Authorization: `Bearer ${this.authService.session?.accessToken}`
            }
        });
    }

    getTaskListById(id: number) {
      return this.httpClient.get<ITaskList[]>(this.baseURL, {
          headers: {
              Authorization: `Bearer ${this.authService.session?.accessToken}`
          }
      });
    }
    addTaskList(name: string) {
        return this.httpClient.post<ITaskList>(this.baseURL, {name},{
            headers: {
                Authorization: `Bearer ${this.authService.session?.accessToken}`
            }
        });
    }

    checkTaskList(name: string): Observable<boolean> {
        return this.httpClient.get<any>(`${this.baseURL}/${name}`, {
          headers: {
            Authorization: `Bearer ${this.authService.session?.accessToken}`
          }
        }).pipe(
          map(response => response.available)
        );
    }

    deleteTaskList(taskListId: number) {

        return this.httpClient.delete(`${this.baseURL}/${taskListId}`, {
            headers: {
                Authorization: `Bearer ${this.authService.session?.accessToken}`
            }
        });
        
    }

    updateTaskList(taskListId: number, name: string) {
        return this.httpClient.put<ITaskList>(`${this.baseURL}/${taskListId}`, {name}, {
            headers: {
                Authorization: `Bearer ${this.authService.session?.accessToken}`
            }
        });
    }
    register({name, email, password}: {name: string, email: string, password: string}) {
        return this.httpClient.post(this.baseURL+'/register', {name, email, password});    
      }
    addMemberToTaskList( taskListId: number, userId: number ) {
        console.log('Add Member:', taskListId);
        console.log('Add Member:', userId);
        return this.httpClient.post(`${this.baseURL}/addMember`, { taskListId, userId });
    }
    
    checkUserAccess( taskListId: number, userId: number ): Observable<any> {
        return this.httpClient.get(this.baseURL + '/check-access', {
            params: {
                taskListId: taskListId.toString(),
                userId: userId.toString()
            }
        });
    }
    
}