import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class FoodService {
  private apiUrl = `${environment.apiUrl}/foods`;
  constructor(private http: HttpClient) {}

  getAll(restaurantId?: string, category?: string): Observable<any[]> {
    let url = this.apiUrl;
    const params: string[] = [];
    if (restaurantId) params.push(`restaurant=${restaurantId}`);
    if (category) params.push(`category=${category}`);
    if (params.length) url += '?' + params.join('&');
    return this.http.get<any[]>(url);
  }
  getById(id: string): Observable<any> { return this.http.get(`${this.apiUrl}/${id}`); }
  getAdminAll(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrl}/admin/all`); }
  create(data: FormData): Observable<any> { return this.http.post(this.apiUrl, data); }
  update(id: string, data: FormData): Observable<any> { return this.http.put(`${this.apiUrl}/${id}`, data); }
  delete(id: string): Observable<any> { return this.http.delete(`${this.apiUrl}/${id}`); }
}