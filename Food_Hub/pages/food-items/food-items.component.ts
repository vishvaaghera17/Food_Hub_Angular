import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FoodService } from '../../services/food.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { RestaurantService } from '../../services/restaurant.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-food-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './food-items.component.html',
  styleUrls: ['./food-items.component.css']
})
export class FoodItemsComponent implements OnInit {
  foods: any[] = [];
  filtered: any[] = [];
  categories: string[] = [];
  selectedCategory = '';
  searchQuery = '';
  restaurantId = '';
  restaurantName = '';
  imageUrl = environment.imageUrl;
  addedToCart: {[key: string]: boolean} = {};

  constructor(
    private foodService: FoodService,
    private cartService: CartService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private restaurantService: RestaurantService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.restaurantId = params['restaurant'] || '';
      if (this.restaurantId) {
        this.restaurantService.getById(this.restaurantId).subscribe(r => this.restaurantName = r.name);
      }
      this.loadFoods();
    });
  }

  loadFoods(): void {
    this.foodService.getAll(this.restaurantId).subscribe(data => {
      this.foods = data;
      this.filtered = data;
      const cats = [...new Set(data.map((f: any) => f.category))];
      this.categories = cats as string[];
    });
  }

  filter(): void {
    this.filtered = this.foods.filter(f => {
      const matchCat = !this.selectedCategory || f.category === this.selectedCategory;
      const matchSearch = !this.searchQuery || f.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  addToCart(food: any): void {
    if (!this.authService.isLoggedIn()) { alert('Please login to add items to cart'); return; }
    this.cartService.addToCart({
      food: food._id, name: food.name, price: food.price,
      image: food.image,
      restaurantId: food.restaurant?._id || food.restaurant,
      restaurantName: food.restaurant?.name || this.restaurantName
    }).subscribe(() => {
      this.addedToCart[food._id] = true;
      setTimeout(() => this.addedToCart[food._id] = false, 2000);
    });
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://via.placeholder.com/300x200?text=Food';
    return path.startsWith('http') ? path : this.imageUrl + path;
  }
}