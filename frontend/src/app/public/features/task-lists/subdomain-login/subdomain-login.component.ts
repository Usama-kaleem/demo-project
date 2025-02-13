import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-subdomain-login',
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
  ],
  templateUrl: './subdomain-login.component.html',
  styleUrls: ['./subdomain-login.component.css'],
})
export class SubdomainLoginComponent implements OnInit {
  form: FormGroup;
  errorMessage: string | null = null;
  taskListName?: string;
  taskListId?: string;

  authService = inject(AuthService);
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      //this.taskListName = params.get('taskListName')!;
      this.taskListId = params.get('id')!;
    });
    //console.log('Task List Name:', this.taskListName);
    console.log('Task List ID:', this.taskListId);
  }

  submit() {
    if (this.form.valid) {
      const email = this.form.value.email!;
      const password = this.form.value.password!;
      const taskListId = this.taskListId!;
      
      this.authService.subdomainlogin({ email, password, taskListId }).subscribe({
        next: () => {
          console.log('User logged in');
          // const url = `http://${this.taskListName}.localhost:4200/taskList/${this.taskListId}`;
          // window.location.href = url;
          this.router.navigate([`tasks/${taskListId}`]);
        },
        error: (error: { error: { message: string | null; }; }) => {
          this.errorMessage = error.error.message;
        }
      });
    }
  }
  checkAcess() {

  }
}