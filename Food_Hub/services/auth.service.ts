import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  private userSubject = new BehaviorSubject<any>(this.getStoredUser());
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/register`, data).pipe(
      tap((res: any) => { this.setSession(res); })
    );
  }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, data).pipe(
      tap((res: any) => { this.setSession(res); })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/profile`);
  }

  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/profile`, data).pipe(
      tap((res: any) => { this.setSession(res); })
    );
  }

  private setSession(res: any): void {
    localStorage.setItem('token', res.token);
    localStorage.setItem('user', JSON.stringify(res));
    this.userSubject.next(res);
  }

  private getStoredUser(): any {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  isAdmin(): boolean {
    const u = this.getStoredUser();
    return u?.role === 'admin';
  }

  getCurrentUser(): any {
    return this.userSubject.value;
  }
}