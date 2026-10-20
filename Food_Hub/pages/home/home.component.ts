import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../services/restaurant.service';
import { FoodService } from '../../services/food.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  restaurants: any[] = [];
  foods: any[] = [];
  currentSlide = 0;
  slideInterval: any;
  imageUrl = environment.imageUrl;
  isLoggedIn = false;
  addedToCart: {[key: string]: boolean} = {};

  constructor(
    private restaurantService: RestaurantService,
    private foodService: FoodService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn();
    this.authService.user$.subscribe(u => this.isLoggedIn = !!u);
    this.restaurantService.getAll().subscribe(data => {
      this.restaurants = data;
      this.startCarousel();
    });
    this.foodService.getAll().subscribe(data => this.foods = data.slice(0, 8));
  }

  ngOnDestroy(): void { clearInterval(this.slideInterval); }

  startCarousel(): void {
    this.slideInterval = setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % Math.max(this.restaurants.length, 1);
    }, 3500);
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.restaurants.length) % this.restaurants.length;
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.restaurants.length;
  }

  goToSlide(index: number): void { this.currentSlide = index; }

  addToCart(food: any): void {
    if (!this.isLoggedIn) { alert('Please login to add items to cart'); return; }
    this.cartService.addToCart({
      food: food._id,
      name: food.name,
      price: food.price,
      image: food.image,
      restaurantId: food.restaurant?._id || food.restaurant,
      restaurantName: food.restaurant?.name || ''
    }).subscribe(() => {
      this.addedToCart[food._id] = true;
      setTimeout(() => this.addedToCart[food._id] = false, 2000);
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'assets/placeholder.jpg';
    return path.startsWith('http') ? path : this.imageUrl + path;
  }
}