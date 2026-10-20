import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  user: any = null;
  cartCount = 0;
  isMenuOpen = false;

  constructor(
    public authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(u => {
      this.user = u;
      if (u) this.cartService.getCart().subscribe();
    });
    this.cartService.cart$.subscribe(() => {
      this.cartCount = this.cartService.getCartCount();
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }

  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
}