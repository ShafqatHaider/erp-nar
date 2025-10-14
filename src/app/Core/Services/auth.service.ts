import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { AuthResponse, LoginData, RegisterData, User } from "../models/auth.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.ROOT_API_URL}/auth`
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(loginData: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          const user: User = {
            userId: response.userId,
            email: response.email,
            name: response.name,
            lastLogin: response.lastLogin,
            regTime: '',
            isActive: 1
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  register(registerData: { name: string; email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, registerData)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          const user: User = {
            userId: response.userId,
            email: response.email,
            name: response.name,
            lastLogin: response.lastLogin,
            regTime: '',
            isActive: 1
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.clear();
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  updateUserStatus(userId: number, isActive: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/status`, isActive);
  }
}