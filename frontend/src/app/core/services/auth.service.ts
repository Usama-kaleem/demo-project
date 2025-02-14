import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, share } from 'rxjs';
import { Router } from '@angular/router';
export interface Session {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}
export interface CheckUserResponse {
  exists: boolean;
  user: {
    id: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseURL = environment.BACKEND_URL + '/api/auth';
  httpClient = inject(HttpClient);
  router = inject(Router);
  session?: Session;
  constructor() {
    let session = localStorage.getItem('session');
    if (session) {
      session = JSON.parse(session);
    }
  }

  login({ email, password }: { email: string; password: string }) {
    this.session = undefined;
    localStorage.removeItem('session');
    let ob = this.httpClient
      .post<Session>(this.baseURL + '/login', { email, password })
      .pipe(share());

    ob.subscribe({
      next: (r) => {
        this.session = r;
        localStorage.setItem('session', JSON.stringify(r));

      },
    });
    return ob;
  }
  subdomainlogin({ email, password, taskListId }: { email: string; password: string , taskListId: string}) {
    let ob = this.httpClient.post<Session>(this.baseURL + '/subdomain', { email, password,taskListId }).pipe(share());
    ob.subscribe({
      next: (r) => {
        this.session = r;
        localStorage.setItem('session', JSON.stringify(r));
      },
    });
    return ob;
  }

  logout() {
    this.session = undefined;
    localStorage.removeItem('session');
    this.router.navigate(['/auth/login']);
  }

  register({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    return this.httpClient.post(this.baseURL + '/register', {
      name,
      email,
      password,
    });
  }
  checkUserByEmail(email: string): Observable<CheckUserResponse> {
    return this.httpClient.get<CheckUserResponse>(this.baseURL + '/' + email);
  }

  getSession(): any {
    let session = localStorage.getItem('session');
    if (session) {
      session = JSON.parse(session);
    }
    return session;
  }

  isLoggedIn(): boolean {
    return this.getSession() !== null;
  }
}
