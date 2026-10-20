import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form = { email: '', password: '' };
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.loading = true; this.error = '';
    this.authService.login(this.form).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.role === 'admin') this.router.navigate(['/admin/dashboard']);
        else this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed';
      }
    });
  }
}