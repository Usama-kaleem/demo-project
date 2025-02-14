import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Observable, of, map, catchError } from 'rxjs';
import { TaskListService } from '../../../../core/services/tasklist.service';
export function uniqueTaskListValidator(taskListService: TaskListService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return taskListService.checkTaskList(control.value).pipe(
      map(isAvailable => (isAvailable ? null : { taskListNameTaken: true })),
      catchError(() => of(null))
    );
  };
}
@Component({
  selector: 'app-add-task-list-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './add-task-list-dialog.component.html',
  styleUrls: ['./add-task-list-dialog.component.css'],
})

export class AddTaskListDialogComponent {
 
  form: FormGroup;
  errorMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTaskListDialogComponent>,
    private taskListService: TaskListService
  ) {
    console.log('Add Task List Dialog');
    this.form = this.fb.group({
      taskListName: ['', Validators.required, uniqueTaskListValidator(this.taskListService)]
    });
  }

  submit() {
    console.log('Form Value:', this.form.value);
    if (this.form.valid) {
      this.taskListService.addTaskList(this.form.value.taskListName).subscribe({
        next: (response) => {
          console.log('Task List Added:', response);
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error adding task list:', error);
          if (error.status === 400 && error.error.message === 'Task List Name Already Exists') {
            this.errorMessage = 'Task List Name Already Exists';
          } else {
            this.errorMessage = 'An error occurred while adding the task list';
          }
        }
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}