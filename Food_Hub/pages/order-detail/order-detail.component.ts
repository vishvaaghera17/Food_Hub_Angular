import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  order: any = null;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.orderService.getOrderById(id).subscribe({
      next: (data) => this.order = data,
      error: (err) => console.error('Error fetching order:', err)
    });
  }

  getStatusClass(status: string): string {
    const map: { [k: string]: string } = {
      'Pending': 'status-pending',
      'Confirmed': 'status-confirmed',
      'Preparing': 'status-preparing',
      'Out for Delivery': 'status-delivery',
      'Delivered': 'status-delivered',
      'Cancelled': 'status-cancelled'
    };
    return map[status] || '';
  }

  isStepDone(step: string): boolean {
    const steps = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered'];
    const current = steps.indexOf(this.order?.status);
    const target = steps.indexOf(step);
    return current >= target;
  }
}