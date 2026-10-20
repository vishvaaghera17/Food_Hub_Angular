import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HeaderComponent],
  template: `
    <app-header *ngIf="!isAdminRoute()"></app-header>
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor(private router: Router) {}
  isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }
}