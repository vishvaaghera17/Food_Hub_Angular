import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../services/food.service';
import { RestaurantService } from '../../services/restaurant.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-food-items',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-food-items.component.html',
  styleUrls: ['./manage-food-items.component.css']
})
export class ManageFoodItemsComponent implements OnInit {
  foods: any[] = [];
  restaurants: any[] = [];
  showForm = false;
  editMode = false;
  editId = '';
  selectedFile: File | null = null;
  imageUrl = environment.imageUrl;
  categories = ['Starters', 'Main Course', 'Breads', 'Rice', 'Beverages', 'Desserts', 'Fast Food', 'Snacks', 'Salads', 'Soups'];
  form = { name: '', description: '', price: 0, category: '', restaurant: '', isAvailable: true, isVeg: false, preparationTime: '15-20 min' };

  constructor(private foodService: FoodService, private restaurantService: RestaurantService) {}

  ngOnInit(): void {
    this.load();
    this.restaurantService.getAdminAll().subscribe(data => this.restaurants = data);
  }

  load(): void { this.foodService.getAdminAll().subscribe(data => this.foods = data); }

  openForm(f?: any): void {
    this.showForm = true;
    if (f) {
      this.editMode = true; this.editId = f._id;
      this.form = { ...f, restaurant: f.restaurant?._id || f.restaurant };
    } else {
      this.editMode = false; this.editId = '';
      this.form = { name: '', description: '', price: 0, category: '', restaurant: '', isAvailable: true, isVeg: false, preparationTime: '15-20 min' };
    }
  }

  closeForm(): void { this.showForm = false; this.selectedFile = null; }
  onFileChange(e: any): void { this.selectedFile = e.target.files[0]; }

  submit(): void {
    const fd = new FormData();
    Object.entries(this.form).forEach(([k, v]) => fd.append(k, String(v)));
    if (this.selectedFile) fd.append('image', this.selectedFile);
    const req = this.editMode ? this.foodService.update(this.editId, fd) : this.foodService.create(fd);
    req.subscribe(() => { this.load(); this.closeForm(); });
  }

  delete(id: string): void {
    if (confirm('Delete this food item?')) this.foodService.delete(id).subscribe(() => this.load());
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://via.placeholder.com/60x60?text=F';
    return path.startsWith('http') ? path : this.imageUrl + path;
  }
}