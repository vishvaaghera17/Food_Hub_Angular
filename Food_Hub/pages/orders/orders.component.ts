import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}
  ngOnInit(): void { this.orderService.getMyOrders().subscribe(data => this.orders = data); }

  getStatusClass(status: string): string {
    const map: {[k: string]: string} = {
      'Pending': 'status-pending', 'Confirmed': 'status-confirmed',
      'Preparing': 'status-preparing', 'Out for Delivery': 'status-delivery',
      'Delivered': 'status-delivered', 'Cancelled': 'status-cancelled'
    };
    return map[status] || '';
  }

  cancel(id: string): void {
    if (confirm('Cancel this order?')) {
      this.orderService.cancelOrder(id).subscribe(() => {
        const order = this.orders.find(o => o._id === id);
        if (order) order.status = 'Cancelled';
      });
    }
  }
}