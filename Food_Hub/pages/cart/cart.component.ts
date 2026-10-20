import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cart: any = { items: [] };
  deliveryAddress = '';
  phone = '';
  paymentMethod = 'Cash on Delivery';
  notes = '';
  loading = false;
  imageUrl = environment.imageUrl;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.deliveryAddress = user?.address || '';
    this.phone = user?.phone || '';
    this.cartService.getCart().subscribe(data => this.cart = data);
  }

  updateQty(item: any, delta: number): void {
    const newQty = item.quantity + delta;
    this.cartService.updateCart(item.food, newQty).subscribe(data => this.cart = data);
  }

  get subtotal(): number {
    return this.cart?.items?.reduce((s: number, i: any) => s + i.price * i.quantity, 0) || 0;
  }

  get deliveryFee(): number { return this.cart?.items?.length ? 30 : 0; }
  get total(): number { return this.subtotal + this.deliveryFee; }

  placeOrder(): void {
    // Validation
    if (!this.deliveryAddress || !this.deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }
    if (!this.phone || !this.phone.trim()) {
      alert('Please enter phone number');
      return;
    }

    const orderData = {
      items: this.cart.items,
      restaurantId: this.cart.restaurant,
      restaurantName: this.cart.restaurantName,
      totalAmount: this.total,
      deliveryFee: this.deliveryFee,
      deliveryAddress: this.deliveryAddress.trim(),
      phone: this.phone.trim(),
      paymentMethod: this.paymentMethod,
      notes: this.notes,
      paymentStatus: 'Pending'
    };

    // ✅ Online Payment — save to sessionStorage and redirect
    if (this.paymentMethod === 'Online Payment') {
      try {
        const jsonData = JSON.stringify(orderData);
        sessionStorage.setItem('pendingOrder', jsonData);

        // Verify it was saved
        const saved = sessionStorage.getItem('pendingOrder');
        if (!saved) {
          alert('Session storage error. Please try again.');
          return;
        }

        console.log('✅ Order data saved, navigating to payment...');
        this.router.navigate(['/payment']).then(success => {
          console.log('Navigation result:', success);
          if (!success) {
            console.error('Navigation failed');
            window.location.href = '/payment';
          }
        });

      } catch (err) {
        console.error('SessionStorage error:', err);
        alert('Browser storage error. Please enable cookies/storage.');
      }
      return;
    }

    // Cash on Delivery — place order directly
    this.loading = true;
    this.orderService.placeOrder(orderData).subscribe({
      next: (order) => {
        this.loading = false;
        this.router.navigate(['/order', order._id]);
      },
      error: (err) => {
        this.loading = false;
        console.error('Order error:', err);
        alert('Order placement failed. Please try again.');
      }
    });
  }

  clearCart(): void {
    if (confirm('Clear cart?'))
      this.cartService.clearCart().subscribe(() => this.cart = { items: [] });
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://via.placeholder.com/80x80?text=Food';
    return path.startsWith('http') ? path : this.imageUrl + path;
  }
}