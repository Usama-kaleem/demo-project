import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TaskListService } from '../../../core/services/tasklist.service';
import { ITaskList } from '../../../core/interfaces/model/taskList.model.interface';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskListDialogComponent } from './add-task-list-dialog/add-task-list-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import { RenameTaskListDialogComponent } from './rename-task-list-dialog/rename-task-list-dialog.component';
import { AddMemberDialogComponent } from './add-member-dialog/add-member-dialog.component';
import { HeaderComponent } from "../../../core/components/header/header.component";
import { SocketService } from '../../../core/services/webSocket.service';

@Component({
  selector: 'app-task-lists',
  imports: [
    MatIconModule,
    ReactiveFormsModule,
    HeaderComponent
],
  templateUrl: './task-lists.component.html',
  styleUrl: './task-lists.component.css'
})
export class TaskListsComponent implements OnInit{
  taskList: ITaskList[] = [];
  message: string | null = null;
  authService = inject(AuthService);
  taskListService = inject( TaskListService)
  constructor(
    private dialog: MatDialog,
    private router: Router, 
    private webSocketService: SocketService
  ) 
  {
    this.loadTaskList()
    console.log('TaskListsComponent.constructor');
    
  }

  showPopup() {
    const dialogRef = this.dialog.open(AddTaskListDialogComponent);
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        console.log('Dialog Result:', result);
        this.loadTaskList();
      },
    })
  }
  loadTaskList() {
    //console.log('Loading Task List',localStorage.getItem('session'));
    this.taskListService.getTaskLists().subscribe((data: any) => {
      this.taskList = data;
    });
  }
  
  ngOnInit(): void {
    this.webSocketService.onMemberAdded((data) => {
      if (data.userId === this.authService.getSession().user.id) {
        this.message = `${data.name} has been assigned to you by ${this.authService.getSession().user.name}.`;
      }
    });
    console.log('TaskListsComponent.ngOnInit');
    //this.webSocketService.disconnect();
  }

  deleteTaskList(taskListId: number) {
    this.taskListService.deleteTaskList(taskListId).subscribe({
      next: (response) => {
        console.log('Task List Deleted:', response);
        this.loadTaskList();
      },
    });
  }

  openTaskList(taskListName: string, taskListId: number) {
    const formattedTaskListName = taskListName.replace(/\s+/g, '-').toLowerCase();
    const url = `http://${formattedTaskListName}.localhost:4200/taskList/${taskListId}`;
    window.open(url, '_blank');
  }

  renameTaskList(taskListId: number) {
    const dialogRef = this.dialog.open(RenameTaskListDialogComponent, {
      data: { id: taskListId },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTaskList();
      }
    });
  }

  showAddMemberDialog() {
    console.log('Opening Add Member Dialog');
    const dialogRef = this.dialog.open(AddMemberDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Member added:', result);
      }
    });
  }
  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }
  isSessionPresent(): boolean {
    console.log('Checking if session is present',localStorage.getItem('session'));
    return this.authService.isLoggedIn();
  }

}
