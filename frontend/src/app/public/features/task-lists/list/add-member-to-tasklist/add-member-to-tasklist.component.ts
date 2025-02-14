import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { AuthService, CheckUserResponse } from '../../../../../core/services/auth.service';
import { TaskListService } from '../../../../../core/services/tasklist.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SocketService } from '../../../../../core/services/webSocket.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-member-to-tasklist',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './add-member-to-tasklist.component.html',
  styleUrls: ['./add-member-to-tasklist.component.css']
})
export class AddMemberToTaskListComponent implements OnInit{
  form: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddMemberToTaskListComponent>,
    private taskListService: TaskListService,
    private authService: AuthService,
    
    private snackBar: MatSnackBar, 
    @Inject(MAT_DIALOG_DATA) public data: { taskListId: string }
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  ngOnInit(): void {
    
  }
  submit() {
    const tasklistID = parseInt(this.data.taskListId);
    if (this.form.valid) {
      const email = this.form.value.email;
      this.authService.checkUserByEmail(email).subscribe({
        next: (res: CheckUserResponse) => {
          if (res.exists) {
            const userId = parseInt(res.user.id);
            this.taskListService.checkUserAccess(tasklistID, userId).subscribe({
              next: (accessRes) => {
                console.log('accessRes', accessRes);
                if (accessRes.access) {
                  this.errorMessage = 'User already has access to this task list';
                } else {
                  this.taskListService.addMemberToTaskList(tasklistID, userId).subscribe({
                    next: () => {
                      
                      this.dialogRef.close();
                    },
                    error: (err) => {
                      this.errorMessage = err.error.message;
                    }
                  });
                }
              },
              error: (err) => {
                this.errorMessage = 'Failed to check user access';
              }
            });
          } else {
            this.errorMessage = 'User does not exist';
          }
        },
        error: (err) => {
          this.errorMessage = 'Failed to check user by email';
        }
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}