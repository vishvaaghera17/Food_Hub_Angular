import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;
  constructor(private http: HttpClient) {}

  placeOrder(data: any): Observable<any> { return this.http.post(this.apiUrl, data); }
  getMyOrders(): Observable<any[]> { return this.http.get<any[]>(`${this.apiUrl}/my-orders`); }
  getOrderById(id: string): Observable<any> { return this.http.get(`${this.apiUrl}/${id}`); }
  getAllOrders(): Observable<any[]> { return this.http.get<any[]>(this.apiUrl); }
  updateStatus(id: string, status: string): Observable<any> { return this.http.put(`${this.apiUrl}/${id}/status`, { status }); }
  cancelOrder(id: string): Observable<any> { return this.http.put(`${this.apiUrl}/${id}/cancel`, {}); }
}