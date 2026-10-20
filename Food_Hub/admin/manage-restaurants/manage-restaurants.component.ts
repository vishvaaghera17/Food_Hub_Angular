import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../services/restaurant.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-manage-restaurants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-restaurants.component.html',
  styleUrls: ['./manage-restaurants.component.css']
})
export class ManageRestaurantsComponent implements OnInit {
  restaurants: any[] = [];
  showForm = false;
  editMode = false;
  editId = '';
  selectedFile: File | null = null;
  imageUrl = environment.imageUrl;
  form = { name: '', description: '', cuisine: '', address: '', phone: '', email: '', rating: 0, deliveryTime: '30-45 min', minOrder: 0, deliveryFee: 30, isActive: true, isOpen: true };

  constructor(private restaurantService: RestaurantService) {}

  ngOnInit(): void { this.load(); }
  load(): void { this.restaurantService.getAdminAll().subscribe(data => this.restaurants = data); }

  openForm(r?: any): void {
    this.showForm = true;
    if (r) {
      this.editMode = true; this.editId = r._id;
      this.form = { ...r };
    } else {
      this.editMode = false; this.editId = '';
      this.form = { name: '', description: '', cuisine: '', address: '', phone: '', email: '', rating: 0, deliveryTime: '30-45 min', minOrder: 0, deliveryFee: 30, isActive: true, isOpen: true };
    }
  }

  closeForm(): void { this.showForm = false; this.selectedFile = null; }

  onFileChange(e: any): void { this.selectedFile = e.target.files[0]; }

  submit(): void {
    const fd = new FormData();
    Object.entries(this.form).forEach(([k, v]) => fd.append(k, String(v)));
    if (this.selectedFile) fd.append('image', this.selectedFile);
    const req = this.editMode
      ? this.restaurantService.update(this.editId, fd)
      : this.restaurantService.create(fd);
    req.subscribe(() => { this.load(); this.closeForm(); });
  }

  delete(id: string): void {
    if (confirm('Delete this restaurant?')) this.restaurantService.delete(id).subscribe(() => this.load());
  }

  getImageUrl(path: string): string {
    if (!path) return 'https://via.placeholder.com/60x60?text=R';
    return path.startsWith('http') ? path : this.imageUrl + path;
  }
}