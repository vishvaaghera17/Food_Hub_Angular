import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-manage-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-orders.component.html',
  styleUrls: ['./manage-orders.component.css']
})
export class ManageOrdersComponent implements OnInit {
  orders: any[] = [];
  statuses = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

  constructor(private orderService: OrderService) {}
  ngOnInit(): void { this.orderService.getAllOrders().subscribe(data => this.orders = data); }

  updateStatus(id: string, status: string): void {
    this.orderService.updateStatus(id, status).subscribe(() => {
      const order = this.orders.find(o => o._id === id);
      if (order) order.status = status;
    });
  }

  getStatusClass(s: string): string {
    const map: {[k: string]: string} = { 'Pending': 'status-pending', 'Confirmed': 'status-confirmed', 'Preparing': 'status-preparing', 'Out for Delivery': 'status-delivery', 'Delivered': 'status-delivered', 'Cancelled': 'status-cancelled' };
    return map[s] || '';
  }
}