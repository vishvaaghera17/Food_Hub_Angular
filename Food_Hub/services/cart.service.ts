import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  private cartSubject = new BehaviorSubject<any>({ items: [] });
  cart$ = this.cartSubject.asObservable();
  constructor(private http: HttpClient) {}

  getCart(): Observable<any> {
    return this.http.get(this.apiUrl).pipe(tap(cart => this.cartSubject.next(cart)));
  }
  addToCart(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, data).pipe(tap(cart => this.cartSubject.next(cart)));
  }
  updateCart(foodId: string, quantity: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update`, { foodId, quantity }).pipe(tap(cart => this.cartSubject.next(cart)));
  }
  clearCart(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`).pipe(tap(() => this.cartSubject.next({ items: [] })));
  }
  getCartCount(): number {
    const cart = this.cartSubject.value;
    return cart?.items?.reduce((sum: number, i: any) => sum + i.quantity, 0) || 0;
  }
}