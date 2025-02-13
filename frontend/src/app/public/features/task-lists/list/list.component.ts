import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ITasks } from '../../../../core/interfaces/model/tasks.model.interface';
import { tasksService } from '../../../../core/services/tasks.service';
import  moment from 'moment';
import { AddTaskPopupComponent } from './add-task-popup/add-task-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { AddMemberToTaskListComponent } from './add-member-to-tasklist/add-member-to-tasklist.component';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-list',
  imports: [
    MatButtonToggleModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  standalone: true
})
export class ListComponent implements OnInit{
  
  moment = moment;
  route = inject(ActivatedRoute);
  tasksService = inject(tasksService);
  tasks: ITasks[]= [];
  taskListId: any;
  
  filterSubscription: Subscription | undefined;
  filters: string[] = []; 


  taskListName: string | null = null;
  taskListIdUrl: string | null = null;


  constructor(private dialog: MatDialog,
    private router: Router,
    private authService: AuthService
  ) {
    
    this.loadTaskList(this.filters)
  }
  formatDeadline(deadline: Date): string {
    const now = moment();
    const deadlineMoment = moment(deadline);
    const duration = moment.duration(deadlineMoment.diff(now));

    const days = Math.floor(Math.abs(duration.asDays()));
    const minutes = Math.abs(duration.minutes());
    const seconds = Math.abs(duration.seconds());

    if (deadlineMoment.isBefore(now)) {
      return `${days} days ${minutes} minutes ${seconds} seconds past due`;
    } else {
      return `${days} days ${minutes} minutes ${seconds} seconds until due`;
    }
  }
  openPopup(){
    const dialogRef = this.dialog.open(AddTaskPopupComponent, {
      data: { taskListId: this.taskListId }
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        console.log('Dialog Result:', result);
        this.loadTaskList(this.filters);
      },
    })
  }
  intervalId: any;
  
  ngOnInit(): void {
    
    this.filterSubscription = this.route.queryParamMap.subscribe(params => {
      const filters = params.getAll('filter');
      this.loadTaskList(filters);
    });
    this.intervalId = setInterval(() => {
      this.updateLiveTime();
    }, 1000);
    this.isSessionPresent()
  }
  
  addMember(){
    const dialogRef = this.dialog.open(AddMemberToTaskListComponent, {
      data: { taskListId: this.taskListId } // Pass the taskListId to the dialog
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        console.log('Dialog Result:', result);
        this.loadTaskList(this.filters);
      },
    })
  }
  markAsCompleted(taskId: number) {
    console.log('Marking task as completed:', taskId);
    this.tasksService.updateTaskStatus(taskId, 'completed').subscribe({
      next: (response) => {
        console.log('Task Updated:', response);
        this.loadTaskList(this.filters);
      },
      error: (error) => {
        console.error('Error updating task:', error);
      }
    });
  }
  loadTaskList(filters: string[]) {
    this.route.params.subscribe((params: any) => {
      this.taskListId = params.id;
      this.tasksService.getTaskbyId(params.id).subscribe((data: any) => {
        this.tasks = this.applyFilters(data, filters);
      });
    });
  }
  updateLiveTime(): void {
    this.tasks.forEach(task => {
      if (task.status !== 'completed') {
        task.deadline = new Date(task.deadline);
      }
    });
  }
  applyFilters(tasks: ITasks[], filters: string[]): ITasks[] {
    if (filters.length === 0) {
      return tasks;
    }
    return tasks.filter(task => {
      if (filters.includes('incomplete') && task.status !== 'completed') {
        return true;
      }
      if (filters.includes('complete') && task.status === 'completed') {
        return true;
      }
      if (filters.includes('past-due') && new Date(task.deadline) < new Date() && task.status !== 'completed') {
        return true;
      }
      return false;
    });
  }

  onFilterChange(event: any): void {
    const selectedFilters = event.value;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { filter: selectedFilters },
      queryParamsHandling: 'merge'
    });
  }

  isSessionPresent(): boolean {
    //console.log('Checking if session is present',localStorage.getItem('session'));
    return this.authService.isLoggedIn();
  }

}
