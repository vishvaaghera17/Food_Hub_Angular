import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant.service';
import { FoodService } from '../../services/food.service';
import { OrderService } from '../../services/order.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats = { restaurants: 0, foods: 0, orders: 0, users: 0, revenue: 0, pending: 0 };
  recentOrders: any[] = [];

  constructor(
    private restaurantService: RestaurantService,
    private foodService: FoodService,
    private orderService: OrderService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.restaurantService.getAdminAll().subscribe(data => this.stats.restaurants = data.length);
    this.foodService.getAdminAll().subscribe(data => this.stats.foods = data.length);
    this.http.get<any[]>(`${environment.apiUrl}/users`).subscribe(data => this.stats.users = data.length);
    this.orderService.getAllOrders().subscribe(data => {
      this.stats.orders = data.length;
      this.stats.revenue = data.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.totalAmount, 0);
      this.stats.pending = data.filter(o => o.status === 'Pending').length;
      this.recentOrders = data.slice(0, 5);
    });
  }

  getStatusClass(s: string): string {
    const map: {[k: string]: string} = { 'Pending': 'status-pending', 'Confirmed': 'status-confirmed', 'Preparing': 'status-preparing', 'Out for Delivery': 'status-delivery', 'Delivered': 'status-delivered', 'Cancelled': 'status-cancelled' };
    return map[s] || '';
  }
}