import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-restaurants',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.css']
})
export class RestaurantsComponent implements OnInit {
  restaurants: any[] = [];
  filtered: any[] = [];
  searchQuery = '';
  imageUrl = environment.imageUrl;

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.restaurantService.getAll().subscribe(data => {
      this.restaurants = data;
      this.filtered = data;
    });
  }

  search(): void {
    const q = this.searchQuery.toLowerCase();
    this.filtered = this.restaurants.filter(r =>
      r.name.toLowerCase().includes(q) || r.cuisine?.toLowerCase().includes(q)
    );
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://via.placeholder.com/300x200?text=Restaurant';
    return path.startsWith('http') ? path : this.imageUrl + path;
  }
}