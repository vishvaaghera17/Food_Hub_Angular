import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  form = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  };
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.error = '';

    if (!this.form.name || !this.form.email || !this.form.password) {
      this.error = 'Name, Email and Password are required';
      return;
    }

    if (this.form.password !== this.form.confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    if (this.form.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      return;
    }

    this.loading = true;

    // Send only needed fields — no confirmPassword
    const payload = {
      name: this.form.name,
      email: this.form.email,
      password: this.form.password,
      phone: this.form.phone,
      address: this.form.address
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}