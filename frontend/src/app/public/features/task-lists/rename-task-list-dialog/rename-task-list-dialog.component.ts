import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TaskListService } from '../../../../core/services/tasklist.service'; // Adjust the import path as necessary
import { Observable, of, map, catchError } from 'rxjs';
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
  selector: 'app-rename-task-list-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions
  ],
  templateUrl: './rename-task-list-dialog.component.html',
  styleUrls: ['./rename-task-list-dialog.component.css']
})
export class RenameTaskListDialogComponent {
  form: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RenameTaskListDialogComponent>,
    private taskListService: TaskListService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: [data.name, Validators.required, uniqueTaskListValidator(this.taskListService)]
    });
  }

  submit() {
    console.log('Form:', this.form.value, this.data.id);
    if (this.form.valid) {
      this.taskListService.updateTaskList(this.data.id, this.form.value.name).subscribe({
        next: (response) => {
          console.log('Task List Renamed:', response);
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error renaming task list:', error);
          this.errorMessage = 'An error occurred while renaming the task list';
        }
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}