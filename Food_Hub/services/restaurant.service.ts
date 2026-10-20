import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private apiUrl = `${environment.apiUrl}/restaurants`;
  constructor(private http: HttpClient) {}

  getAll(): Observable<any[]> { return this.http.get<any[]>(this.apiUrl); }
  getById(id: string): Observable<any> { return this.http.get(`${this.apiUrl}/${id}`); }
  getAdminAll(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrl}/admin/all`); }

  create(data: FormData): Observable<any> { return this.http.post(this.apiUrl, data); }
  update(id: string, data: FormData): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, data); }
  delete(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}