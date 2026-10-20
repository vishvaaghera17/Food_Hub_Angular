import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  orderData: any = null;
  paymentTab: string = 'upi';
  loading: boolean = false;
  paymentSuccess: boolean = false;
  countdown: number = 3;
  upiId: string = '';
  cardNumber: string = '';
  cardName: string = '';
  cardExpiry: string = '';
  cardCVV: string = '';
  selectedBank: string = '';
  banks: string[] = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank',
    'Axis Bank', 'Kotak Mahindra Bank', 'Punjab National Bank',
    'Bank of Baroda', 'Canara Bank', 'Union Bank of India', 'IndusInd Bank'
  ];

  constructor(private router: Router, private orderService: OrderService) {}

  ngOnInit(): void {
    const data = sessionStorage.getItem('pendingOrder');
    if (!data) { this.router.navigate(['/cart']); return; }
    this.orderData = JSON.parse(data);
  }

  setTab(tab: string): void { this.paymentTab = tab; }

  formatCard(e: any): void {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let out = '';
    for (let i = 0; i < val.length; i++) {
      if (i > 0 && i % 4 === 0) out += ' ';
      out += val[i];
    }
    this.cardNumber = out;
  }

  formatExpiry(e: any): void {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
    this.cardExpiry = val;
  }

  isFormValid(): boolean {
    if (this.paymentTab === 'upi')
      return this.upiId.includes('@') && this.upiId.length > 4;
    if (this.paymentTab === 'card')
      return this.cardNumber.replace(/\s/g, '').length === 16
        && this.cardName.trim().length > 2
        && this.cardExpiry.length === 5
        && this.cardCVV.length === 3;
    if (this.paymentTab === 'netbanking')
      return this.selectedBank !== '';
    return false;
  }

  getSubtotal(): number {
    if (!this.orderData) return 0;
    return this.orderData.totalAmount - this.orderData.deliveryFee;
  }

  processPayment(): void {
    if (!this.isFormValid()) { alert('Please fill all payment details'); return; }
    this.loading = true;
    setTimeout(() => {
      this.loading = false;
      this.paymentSuccess = true;
      const payload = Object.assign({}, this.orderData, { paymentStatus: 'Paid' });
      this.orderService.placeOrder(payload).subscribe({
        next: (order: any) => {
          sessionStorage.removeItem('pendingOrder');
          const t = setInterval(() => {
            this.countdown--;
            if (this.countdown === 0) { clearInterval(t); this.router.navigate(['/order', order._id]); }
          }, 1000);
        },
        error: () => { alert('Order failed after payment. Contact support.'); this.router.navigate(['/orders']); }
      });
    }, 2000);
  }

  goBack(): void { this.router.navigate(['/cart']); }
}