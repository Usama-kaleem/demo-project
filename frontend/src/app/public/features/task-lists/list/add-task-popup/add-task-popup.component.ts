import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { tasksService } from '../../../../../core/services/tasks.service';
import { ITasks } from '../../../../../core/interfaces/model/tasks.model.interface';
import { ActivatedRoute } from '@angular/router';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set the time to midnight to compare only the date part

    return selectedDate > today ? null : { pastDate: true };
  };
}
@Component({
  selector: 'app-add-task-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogContent,
    MatDialogActions
  ],
  providers: [ {provide: DateAdapter, useClass: NativeDateAdapter}, {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS}, ],
  templateUrl: './add-task-popup.component.html',
  styleUrls: ['./add-task-popup.component.css']
})

export class AddTaskPopupComponent {
  form: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTaskPopupComponent>,
    private taskService: tasksService,
    private route: ActivatedRoute,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      deadline: ['',[Validators.required , futureDateValidator()]] 
    });
  }
  taskListId: string | null = "apple";
  
  taskData!: ITasks;
  submit() {
    if (this.form.valid) {
      this.taskData = {
        ...this.form.value,
        status: 'pending', 
        taskListId: this.data.taskListId 
        

      };
      console.log('Task Data:', this.taskData);
      this.taskService.addtask(this.taskData).subscribe({
        next: (response) => {
          this.dialogRef.close();
        },
        error: () => {
          this.errorMessage = 'An error occurred while adding the task';
        }
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}