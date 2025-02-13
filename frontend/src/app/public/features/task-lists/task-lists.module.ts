import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TaskListsRoutingModule } from './task-lists-routing.module';
import { AddTaskListDialogComponent } from './add-task-list-dialog/add-task-list-dialog.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    TaskListsRoutingModule,
    MatDialogModule,
    MatButtonModule,
    AddTaskListDialogComponent
  ]
})
export class TaskListsModule { }
