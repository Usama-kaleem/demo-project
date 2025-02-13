import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { RouterModule } from '@angular/router';

import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  submit () {
    this.authService.login({
      email: this.form.value.email!,
      password: this.form.value.password!
    }).subscribe({
      next: ()=> {
        this.router.navigate(['/']);
      },
      error: (error)=> {
        alert(error.error.message);
        console.log(error.error);
      }
    });
  }

}
